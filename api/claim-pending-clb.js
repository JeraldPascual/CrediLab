/**
 * Vercel Serverless Function: Claim Pending CLB
 *
 * For users who already completed challenges but CLB was never sent on-chain
 * (e.g. service account wasn't configured at deploy time).
 *
 * Sends their full Firestore credits balance on-chain in one transaction.
 *
 * Route: POST /api/claim-pending-clb
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
      console.error('[claim-pending-clb] JSON.parse failed:', e.message);
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

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isAllowed =
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3000';
  if (isAllowed) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = getDB();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }
    const idToken = authHeader.split("Bearer ")[1];
    const firebaseKey = process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
    const verifyRes = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo?key=${firebaseKey}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
    );
    const verifyData = await verifyRes.json();
    if (verifyData.error || !verifyData.users?.[0]) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const uid = verifyData.users[0].localId;

    // 2. Get user
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const userData = userDoc.data();
    const walletAddress = userData.walletAddress;
    const pendingCLB = userData.totalCLBEarned ?? userData.credits ?? 0;

    if (!walletAddress) {
      return res.status(400).json({ error: "No wallet connected. Connect MetaMask first." });
    }
    if (pendingCLB <= 0) {
      return res.status(400).json({ error: "No CLB balance to claim." });
    }

    // 3. Check on-chain balance to avoid double-send
    const rpcUrl = process.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com';
    const contractAddress = process.env.VITE_CLB_CONTRACT_ADDRESS;
    const privateKey = process.env.SYSTEM_WALLET_PRIVATE_KEY;

    if (!contractAddress || !privateKey) {
      return res.status(500).json({ error: "Server wallet not configured." });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, CLB_ABI, wallet);

    const onChainBalance = await contract.balanceOf(walletAddress);
    const onChainCLB = parseFloat(ethers.formatEther(onChainBalance));

    // How much is still pending (Firestore credits - on-chain balance)
    const toSend = Math.max(0, pendingCLB - onChainCLB);

    if (toSend <= 0) {
      return res.status(200).json({
        success: true,
        alreadySent: true,
        message: "Your CLB is already on-chain!",
        onChainCLB,
      });
    }

    // 4. Send the pending amount
    const amountWei = ethers.parseEther(toSend.toString());
    const tx = await contract.transfer(walletAddress, amountWei);
    const receipt = await tx.wait();

    // 5. Log to events
    const timestamp = new Date().toISOString();
    await db.collection('events').doc(`claim-${uid}-${Date.now()}`).set({
      type: 'claim',
      uid,
      amountCLB: toSend,
      walletAddress,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      timestamp,
      status: 'success',
    });

    // 6. Update pool
    const poolRef = db.collection('system').doc('credit_pool');
    const poolDoc = await poolRef.get();
    if (poolDoc.exists) {
      await poolRef.update({
        distributed: (poolDoc.data().distributed || 0) + toSend,
        remaining: (poolDoc.data().remaining || 10000) - toSend,
        lastIssuanceAt: timestamp,
      });
    }

    return res.status(200).json({
      success: true,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber,
      sentCLB: toSend,
      message: `${toSend} CLB sent to your wallet!`,
    });

  } catch (err) {
    console.error('[claim-pending-clb] Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
