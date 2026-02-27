/**
 * POST /api/award-weekly-winner
 *
 * Finds the top-voted community_approved submission for a given week and
 * awards CLB to that student. Idempotent — won't double-award.
 *
 * Auth: x-admin-secret header (Student A admin or scheduled cron)
 *
 * Body: { weekNumber?: number }   ← defaults to current ISO week
 *
 * How to test manually:
 *   curl -X POST https://credilab.vercel.app/api/award-weekly-winner \
 *     -H "Content-Type: application/json" \
 *     -H "x-admin-secret: <ADMIN_SECRET>" \
 *     -d '{"weekNumber": 9}'
 *
 * What it does:
 *   1. Queries weekly_completions for the given week
 *   2. Picks the doc with the highest netScore (must be community_approved)
 *   3. Calls reward-student logic to transfer CLB on-chain
 *   4. Sets clbAwarded: true on the winning doc (idempotency guard)
 *   5. Returns winner info
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
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          };
    } catch {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
    }
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

function getCurrentISOWeek() {
  const d = new Date();
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

const CLB_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];

async function sendCLBOnChain(toAddress, amountCLB) {
  const provider = new ethers.JsonRpcProvider(
    process.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
  );
  const wallet = new ethers.Wallet(process.env.SYSTEM_WALLET_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.VITE_CLB_CONTRACT_ADDRESS, CLB_ABI, wallet);
  const tx = await contract.transfer(toAddress, ethers.parseEther(amountCLB.toString()));
  const receipt = await tx.wait();
  return { txHash: tx.hash, blockNumber: receipt.blockNumber };
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isAllowed = origin.endsWith('.vercel.app') || origin === 'http://localhost:5173';
  if (isAllowed) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Accept: admin secret (manual POST) OR Vercel Cron bearer token (scheduled GET)
  const adminOk = req.headers['x-admin-secret'] === process.env.ADMIN_SECRET;
  const cronOk  = req.headers['authorization'] === `Bearer ${process.env.CRON_SECRET}`;
  if (!adminOk && !cronOk) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const db = getDB();
    const weekNumber = req.body?.weekNumber ?? getCurrentISOWeek();

    // 1. Fetch all community_approved submissions for the week
    const ref = db.collection('weekly_completions');
    const snapAll = await ref
      .where('weekNumber', '==', weekNumber)
      .where('status', '==', 'community_approved')
      .get();

    const candidates = snapAll.docs
      .map(d => ({ docId: d.id, ...d.data() }))
      .filter(d => !d.clbAwarded); // exclude already awarded

    if (candidates.length === 0) {
      return res.status(200).json({
        success: false,
        message: `No eligible community_approved submissions for week ${weekNumber}`,
        weekNumber,
      });
    }

    // 2. Pick the winner — highest netScore; ties broken by earliest submission
    const winner = candidates.sort((a, b) => {
      const scoreDiff = (b.netScore ?? 0) - (a.netScore ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      // Tie-break: earlier submission wins
      const aTime = a.completedAt?.toMillis?.() ?? 0;
      const bTime = b.completedAt?.toMillis?.() ?? 0;
      return aTime - bTime;
    })[0];

    console.log(`[WeeklyWinner] Week ${weekNumber}: winner is ${winner.displayName} (${winner.uid}), netScore=${winner.netScore ?? 0}`);

    // 3. Get winner's wallet + reward amount from the task doc
    const userDoc = await db.collection('users').doc(winner.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: `Winner user doc not found: ${winner.uid}` });
    }
    const userData = userDoc.data();
    const walletAddress = userData.walletAddress || null;
    const rewardAmount = winner.rewardCLB ?? 35; // fallback to 35 if not stored on doc
    const timestamp = new Date().toISOString();

    // 4. Idempotency — mark winner doc immediately before transfer
    const winnerDocRef = db.collection('weekly_completions').doc(winner.docId);
    await winnerDocRef.update({
      clbAwarded: true,
      status: 'weekly_winner',
      awardedAt: timestamp,
      awardedReward: rewardAmount,
    });

    // 5. Transfer CLB on-chain (if wallet connected) or credit Firestore + queue pending
    let txHash = null, blockNumber = null, transferred = false;

    if (walletAddress) {
      try {
        ({ txHash, blockNumber } = await sendCLBOnChain(walletAddress, rewardAmount));
        transferred = true;
        console.log(`[WeeklyWinner] Transferred ${rewardAmount} CLB → ${walletAddress} tx:${txHash}`);
      } catch (chainErr) {
        console.error('[WeeklyWinner] On-chain transfer failed:', chainErr.message);
        // Still update Firestore below — admin can retry on-chain manually
      }
    }

    // 6. Update winner's Firestore credits
    await db.collection('users').doc(winner.uid).update({
      credits: (userData.credits || 0) + rewardAmount,
      totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + rewardAmount,
      lastRewardAt: timestamp,
    });

    // 7. Decrement pool
    const poolRef = db.collection('system').doc('credit_pool');
    const poolDoc = await poolRef.get();
    if (poolDoc.exists) {
      await poolRef.update({
        distributed: (poolDoc.data().distributed || 0) + rewardAmount,
        remaining: (poolDoc.data().remaining || 10000) - rewardAmount,
        lastIssuanceAt: timestamp,
      });
    }

    // 8. Log to events collection so it shows in transaction history
    await db.collection('events').doc(`weekly-winner-${winner.uid}-w${weekNumber}-${Date.now()}`).set({
      type: 'weekly_winner_reward',
      uid: winner.uid,
      challengeId: winner.taskId ?? `weekly-w${weekNumber}`,
      amountCLB: rewardAmount,
      walletAddress,
      txHash,
      blockNumber,
      timestamp,
      status: transferred ? 'success' : 'pending',
      method: transferred ? 'system_wallet' : 'pending',
      weekNumber,
      netScore: winner.netScore ?? 0,
      displayName: winner.displayName,
    });

    return res.status(200).json({
      success: true,
      winner: {
        uid: winner.uid,
        displayName: winner.displayName,
        netScore: winner.netScore ?? 0,
        rewardAmount,
        walletAddress,
        txHash,
        transferred,
      },
      weekNumber,
      totalCandidates: candidates.length,
      message: `${winner.displayName} awarded ${rewardAmount} CLB for week ${weekNumber}!`,
    });

  } catch (err) {
    console.error('[WeeklyWinner] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
