/**
 * Vercel Serverless Function: Cash Out Pending Credits → On-Chain CLB
 *
 * Purpose: Let a student convert their accumulated Firestore credits balance
 *          into real CLB tokens sent to their connected wallet on-chain.
 *          (The "Claim" / "Cash Out" button in the mobile app.)
 *
 * Route: POST /api/claim-tokens
 *
 * Auth: Firebase ID Token (Bearer)
 *   — uid is ALWAYS derived from the verified token, never from the request body.
 *   — A user can only claim their own credits. No targetUid accepted.
 *
 * Body: { amount: number }   ← exact integer of credits to convert
 *
 * Flow:
 * 1. Verify Firebase Auth token → resolve uid
 * 2. Validate amount (positive integer, ≤ user's Firestore credits balance)
 * 3. Check wallet is connected (on-chain transfer requires a wallet address)
 * 4. Deduct credits from Firestore FIRST (pessimistic lock — prevents double-spend)
 * 5. Send CLB on-chain from system wallet to student wallet
 * 6. If on-chain fails → refund credits, log error, return 500
 * 7. Log transaction to events collection + decrement system pool
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ethers } from 'ethers';

function getDB() {
  if (getApps().length === 0) {
    let serviceAccount;
    try {
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
          };
    } catch (e) {
      console.error('[claim-tokens] JSON.parse failed:', e.message);
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      };
    }
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

const CLB_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

async function sendCLBOnChain(toAddress, amountCLB) {
  const rpcUrl = process.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
  const contractAddress = process.env.VITE_CLB_CONTRACT_ADDRESS;
  const privateKey = process.env.SYSTEM_WALLET_PRIVATE_KEY;

  if (!contractAddress) throw new Error('VITE_CLB_CONTRACT_ADDRESS not set in Vercel env');
  if (!privateKey) throw new Error('SYSTEM_WALLET_PRIVATE_KEY not set in Vercel env');

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, CLB_ABI, wallet);

  const amountWei = ethers.parseEther(amountCLB.toString());

  console.log(`[CLB] Claiming ${amountCLB} CLB → ${toAddress}...`);
  const tx = await contract.transfer(toAddress, amountWei);
  const receipt = await tx.wait();
  console.log(`[CLB] Claim confirmed block ${receipt.blockNumber} — txHash: ${tx.hash}`);
  return { txHash: tx.hash, blockNumber: receipt.blockNumber };
}

export default async function handler(req, res) {
  // CORS — allow Vercel deployments, localhost, and Android emulator
  const origin = req.headers.origin || '';
  const isAllowed =
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3000' ||
    origin === 'http://10.0.2.2:5173';
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = getDB();

    // ── 1. Verify Firebase Auth token ──────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let uid;

    try {
      const firebaseKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
      const verifyRes = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${firebaseKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );
      const verifyData = await verifyRes.json();
      if (verifyData.error || !verifyData.users?.[0]) {
        return res.status(401).json({ error: 'Invalid Firebase token' });
      }
      uid = verifyData.users[0].localId;
    } catch {
      return res.status(401).json({ error: 'Token verification failed' });
    }

    // ── 2. Validate request body ──────────────────────────────────────────
    const { amount } = req.body || {};

    if (!amount || typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'amount must be a positive integer' });
    }

    // Hard cap: no single claim can exceed 500 CLB (prevents fat-finger wipes)
    const MAX_SINGLE_CLAIM = 500;
    if (amount > MAX_SINGLE_CLAIM) {
      return res.status(400).json({
        error: `Single claim cannot exceed ${MAX_SINGLE_CLAIM} CLB. Split into smaller claims.`
      });
    }

    // ── 3. Load user + validate balance ──────────────────────────────────
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const currentCredits = userData.credits ?? 0;
    const walletAddress = userData.walletAddress || null;

    if (amount > currentCredits) {
      return res.status(400).json({
        error: `Insufficient credits. You have ${currentCredits} CLB available to claim.`,
        available: currentCredits
      });
    }

    if (!walletAddress) {
      return res.status(400).json({
        error: 'No wallet connected. Connect MetaMask in your Profile before claiming.',
        needsWallet: true
      });
    }

    const timestamp = new Date().toISOString();
    const claimId = `claim-${uid}-${Date.now()}`;

    // ── 4. Deduct credits FIRST (pessimistic — prevents double-spend) ─────
    //    If on-chain fails we refund. If we credited first and chain failed,
    //    we'd have to chase the discrepancy the other way around.
    await userRef.update({
      credits: currentCredits - amount,
      lastClaimAt: timestamp
    });

    // ── 5. Send CLB on-chain ──────────────────────────────────────────────
    try {
      const { txHash, blockNumber } = await sendCLBOnChain(walletAddress, amount);

      // Log event
      await db.collection('events').doc(claimId).set({
        type: 'claim',
        uid,
        walletAddress,
        amountCLB: amount,
        txHash,
        blockNumber,
        timestamp,
        status: 'success',
        method: 'system_wallet',
        creditsBefore: currentCredits,
        creditsAfter: currentCredits - amount
      });

      // Decrement system pool
      const poolRef = db.collection('system').doc('credit_pool');
      const poolDoc = await poolRef.get();
      if (poolDoc.exists) {
        await poolRef.update({
          distributed: (poolDoc.data().distributed || 0) + amount,
          remaining: (poolDoc.data().remaining || 10000) - amount,
          lastIssuanceAt: timestamp
        });
      }

      return res.status(200).json({
        success: true,
        message: `${amount} CLB sent to your wallet!`,
        txHash,
        blockNumber,
        amount,
        creditsRemaining: currentCredits - amount
      });

    } catch (chainError) {
      // ── 6. On-chain failed → refund the deducted credits ─────────────
      console.error('[claim-tokens] On-chain transfer failed, refunding credits:', chainError.message);

      await userRef.update({
        credits: currentCredits, // restore original balance
        lastClaimAt: null
      });

      // Log the failure
      await db.collection('events').doc(claimId + '-failed').set({
        type: 'claim_failed',
        uid,
        walletAddress,
        amountCLB: amount,
        timestamp,
        status: 'failed',
        error: chainError.message
      });

      return res.status(500).json({
        error: 'On-chain transfer failed. Your credits were not deducted.',
        details: chainError.message
      });
    }

  } catch (error) {
    console.error('[claim-tokens] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
