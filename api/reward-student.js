/**
 * Vercel Serverless Function: Verify Challenge Completion + Auto-Transfer CLB
 *
 * Purpose: Mark challenge complete in Firestore and auto-transfer CLB tokens
 *          from the system wallet to the student's connected wallet on-chain.
 *
 * Route: POST /api/reward-student
 *
 * Flow:
 * 1. Verify Firebase Auth token
 * 2. Check if challenge already completed (idempotent)
 * 3. Mark challenge as complete in Firestore
 * 4a. If wallet connected → transfer CLB on-chain via system wallet
 * 4b. If no wallet → log to pending_rewards for later batch send
 * 5. Log transaction to events collection
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
      console.error('[reward-student] JSON.parse failed:', e.message);
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

// Minimal ABI — only what the system wallet needs
const CLB_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)"
];

/**
 * Transfer CLB from system wallet (0x87b8...) to student wallet.
 * System wallet holds the 10,000 CLB pool.
 * Each reward decrements the pool — pure transfer(), no minting.
 */
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

  console.log(`[CLB] Transferring ${amountCLB} CLB from system wallet to ${toAddress}...`);
  const tx = await contract.transfer(toAddress, amountWei);
  const receipt = await tx.wait();
  console.log(`[CLB] Transferred in block ${receipt.blockNumber} — txHash: ${tx.hash}`);
  return { txHash: tx.hash, blockNumber: receipt.blockNumber };
}

export default async function handler(req, res) {
  // CORS headers — allow Vercel deployments + localhost dev
  const origin = req.headers.origin || '';
  const isAllowed =
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3000';
  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = getDB();

    // 1. Verify Firebase Auth token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let uid;

    try {
      // Verify token with Firebase REST API
      const firebaseKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
      const verifyRes = await fetch(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${firebaseKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        }
      );
      const verifyData = await verifyRes.json();
      if (verifyData.error || !verifyData.users?.[0]) {
        return res.status(401).json({ error: "Invalid Firebase token" });
      }
      uid = verifyData.users[0].localId;
    } catch {
      return res.status(401).json({ error: "Token verification failed" });
    }

    // 2. Parse request body
    const { challengeId, rewardAmount } = req.body || {};

    if (!challengeId || typeof challengeId !== 'string') {
      return res.status(400).json({ error: "Missing or invalid challengeId" });
    }

    if (!rewardAmount || typeof rewardAmount !== 'number' || rewardAmount <= 0) {
      return res.status(400).json({ error: "Missing or invalid rewardAmount" });
    }

    // Server-side reward cap — never trust client-supplied amounts blindly
    const MAX_REWARD_PER_CHALLENGE = 100;
    if (rewardAmount > MAX_REWARD_PER_CHALLENGE) {
      return res.status(400).json({ error: `Reward amount exceeds maximum (${MAX_REWARD_PER_CHALLENGE} CLB)` });
    }

    // 3. Get user data from Firestore
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const userData = userDoc.data();
    const walletAddress = userData.walletAddress || null;

    // 4. Check if challenge already completed (idempotent guard)
    const completedChallenges = userData.completedChallenges || [];
    if (completedChallenges.includes(challengeId)) {
      return res.status(409).json({
        error: "Challenge already completed",
        alreadyCompleted: true
      });
    }

    // 5. Mark challenge as complete in Firestore UNCONDITIONALLY
    //    (completion is always recorded regardless of wallet status)
    const timestamp = new Date().toISOString();
    await userRef.update({
      completedChallenges: [...completedChallenges, challengeId],
      lastCompletionAt: timestamp
    });

    // 6. Transfer CLB on-chain if wallet is connected, otherwise queue as pending
    if (walletAddress) {
      try {
        const { txHash, blockNumber } = await sendCLBOnChain(walletAddress, rewardAmount);

        // Log successful on-chain transaction
        await db.collection('events').doc(`issuance-${uid}-${challengeId}-${Date.now()}`).set({
          type: 'issuance',
          uid,
          challengeId,
          amountCLB: rewardAmount,
          walletAddress,
          txHash,
          blockNumber,
          timestamp,
          status: 'success',
          method: 'system_wallet'
        });

        // Update Firestore credits to match on-chain reality
        await userRef.update({
          credits: (userData.credits || 0) + rewardAmount,
          totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + rewardAmount,
          lastRewardAt: timestamp
        });

        // Update system pool stats
        const poolRef = db.collection('system').doc('credit_pool');
        const poolDoc = await poolRef.get();
        if (poolDoc.exists) {
          await poolRef.update({
            distributed: (poolDoc.data().distributed || 0) + rewardAmount,
            remaining: (poolDoc.data().remaining || 10000) - rewardAmount,
            lastIssuanceAt: timestamp
          });
        } else {
          await poolRef.set({ total: 10000, distributed: rewardAmount, remaining: 10000 - rewardAmount, lastIssuanceAt: timestamp });
        }

        return res.status(200).json({
          success: true,
          transferred: true,
          message: `${rewardAmount} CLB sent to your wallet!`,
          txHash,
          blockNumber,
          rewardAmount,
          challengeId
        });

      } catch (chainError) {
        // On-chain transfer failed — fall back to pending queue so student doesn't lose reward
        console.error('[CLB] On-chain transfer failed, queuing as pending:', chainError.message);

        // Still credit the student's Firestore balance immediately
        await userRef.update({
          credits: (userData.credits || 0) + rewardAmount,
          totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + rewardAmount,
          lastRewardAt: timestamp
        });

        const pendingId = `pending-${uid}-${challengeId}-${Date.now()}`;
        await db.collection('pending_rewards').doc(pendingId).set({
          uid,
          email: userData.email,
          displayName: userData.displayName,
          walletAddress,
          challengeId,
          amountCLB: rewardAmount,
          status: 'pending',
          createdAt: timestamp,
          error: chainError.message,
          sentAt: null,
          txHash: null
        });

        return res.status(200).json({
          success: true,
          transferred: false,
          pending: true,
          message: "Challenge complete! CLB reward queued — will be sent shortly.",
          pendingId,
          rewardAmount,
          challengeId
        });
      }
    } else {
      // No wallet connected — credit Firestore balance and queue on-chain transfer for later
      await userRef.update({
        credits: (userData.credits || 0) + rewardAmount,
        totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + rewardAmount,
        lastRewardAt: timestamp
      });

      const pendingId = `pending-${uid}-${challengeId}-${Date.now()}`;
      await db.collection('pending_rewards').doc(pendingId).set({
        uid,
        email: userData.email,
        displayName: userData.displayName || '',
        walletAddress: null,
        challengeId,
        amountCLB: rewardAmount,
        status: 'no_wallet',
        createdAt: timestamp,
        sentAt: null,
        txHash: null
      });

      return res.status(200).json({
        success: true,
        transferred: false,
        needsWallet: true,
        message: "Challenge complete! Connect MetaMask in your Profile to receive CLB rewards.",
        rewardAmount,
        challengeId
      });
    }

  } catch (error) {
    console.error('[Reward] Error:', error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
