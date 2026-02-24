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
    const { challengeId, rewardAmount, targetUid } = req.body || {};

    if (!challengeId || typeof challengeId !== 'string') {
      return res.status(400).json({ error: "Missing or invalid challengeId" });
    }

    if (!rewardAmount || typeof rewardAmount !== 'number' || rewardAmount <= 0) {
      return res.status(400).json({ error: "Missing or invalid rewardAmount" });
    }

    // For weekly task admin approvals: the admin is authenticated, but CLB
    // goes to targetUid (the student who submitted). Admin's uid is kept
    // as `approvedBy` for audit trail.
    const approvedBy = uid; // the authenticated caller
    if (targetUid && req.body?.isWeeklyTask) {
      console.log(`[Reward] Approving weekly task for student ${targetUid}`);
      uid = targetUid; // redirect all reward logic to the student
    }

    // ─── Server-side reward validation ───────────────────────────────────
    // Inline reward map — must stay in sync with src/data/challenges.js
    // This prevents spoofed client requests claiming inflated rewards.
    const REWARD_MAP = {
      // Core challenges
      "greeting-001": 20, "grade-calc-002": 55, "fib-003": 18,
      "reverse-004": 15, "bubblesort-005": 60,
      // Java challenges — Easy
      "even-odd-006": 15, "area-calc-007": 15, "temp-convert-008": 18,
      "sum-digits-009": 18, "multiplication-table-010": 20,
      // Java challenges — Medium
      "student-avg-011": 50, "palindrome-check-012": 50, "array-stats-013": 55,
      "payroll-calc-014": 55, "vowel-count-015": 60,
      // Java challenges — Hard
      "bank-account-016": 80, "matrix-add-017": 75, "word-frequency-018": 85,
      "pattern-print-019": 80, "inventory-mgr-020": 90,
      // Weekly SDG Tasks (dynamic — capped at 50, not strict-matched)
      "sdg15-tree-action-w9": 35,
      // Mobile app quiz rewards — isolated from web completedChallenges
      "mobile_quiz_easy": 10,
      "mobile_quiz_medium": 25,
      "mobile_quiz_hard": 50,
    };

    // Weekly tasks use "sdg" prefix — allow flexible rewards up to 50 CLB
    const isWeeklyTask = challengeId.startsWith("sdg") || req.body?.isWeeklyTask;
    // Mobile quiz rewards — separate flow, never touch web completedChallenges
    const isMobileQuiz = challengeId.startsWith("mobile_quiz_");
    // Determine if this is a quiz/challenge reward vs weekly task (must be after isWeeklyTask)
    const isQuizReward = !isWeeklyTask && !isMobileQuiz;
    const MAX_REWARD_PER_CHALLENGE = isWeeklyTask ? 50 : 100;
    const expectedReward = REWARD_MAP[challengeId];

    if (expectedReward !== undefined && rewardAmount !== expectedReward) {
      console.warn(`[Reward] Mismatch: client sent ${rewardAmount} for ${challengeId}, expected ${expectedReward}`);
      return res.status(400).json({
        error: `Reward mismatch for challenge "${challengeId}". Expected ${expectedReward} CLB.`
      });
    }

    if (rewardAmount > MAX_REWARD_PER_CHALLENGE) {
      return res.status(400).json({ error: `Reward amount exceeds maximum (${MAX_REWARD_PER_CHALLENGE} CLB)` });
    }

    // For unknown challenge IDs (e.g. weekly tasks), allow up to MAX_REWARD cap
    if (expectedReward === undefined) {
      console.warn(`[Reward] Unknown challengeId "${challengeId}" — allowing with cap`);
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
    //    Web challenges  → tracked in completedChallenges (Firestore field)
    //    Weekly tasks    → tracked in weekly_completions (separate collection)
    //    Mobile quizzes  → tracked in mobileQuizRewards (separate field, never touches
    //                       completedChallenges so web progress is never polluted)
    const completedChallenges = userData.completedChallenges || [];
    const mobileQuizRewards = userData.mobileQuizRewards || [];

    if (!isWeeklyTask && !isMobileQuiz && completedChallenges.includes(challengeId)) {
      return res.status(409).json({
        error: "Challenge already completed",
        alreadyCompleted: true
      });
    }

    // Mobile quiz rewards are one-time per difficulty tier (easy/medium/hard),
    // even though the quizzes themselves are infinitely repeatable.
    if (isMobileQuiz && mobileQuizRewards.includes(challengeId)) {
      return res.status(409).json({
        error: `You have already claimed the reward for ${challengeId}. Quizzes are repeatable but CLB rewards are earned once per difficulty.`,
        alreadyRewarded: true
      });
    }

    // 5. Mark challenge as complete in Firestore UNCONDITIONALLY
    //    Web challenges  → append to completedChallenges
    //    Weekly tasks    → skip (own collection)
    //    Mobile quizzes  → append to mobileQuizRewards (isolated from web progress)
    const timestamp = new Date().toISOString();
    const updatePayload = { lastCompletionAt: timestamp };
    if (!isWeeklyTask && !isMobileQuiz) {
      updatePayload.completedChallenges = [...completedChallenges, challengeId];
    }
    if (isMobileQuiz) {
      updatePayload.mobileQuizRewards = [...mobileQuizRewards, challengeId];
    }
    await userRef.update(updatePayload);

    // 6. Transfer CLB on-chain if wallet is connected, otherwise queue as pending
    if (walletAddress) {
      try {
        const { txHash, blockNumber } = await sendCLBOnChain(walletAddress, rewardAmount);

        // Log successful on-chain transaction
        await db.collection('events').doc(`issuance-${uid}-${challengeId}-${Date.now()}`).set({
          type: isWeeklyTask ? 'weekly_task_reward' : 'issuance',
          uid,
          challengeId,
          amountCLB: rewardAmount,
          walletAddress,
          txHash,
          blockNumber,
          timestamp,
          status: 'success',
          method: 'system_wallet',
          ...(isWeeklyTask && { approvedBy })
        });

        // Update Firestore credits to match on-chain reality
        await userRef.update({
          credits: (userData.credits || 0) + rewardAmount,
          totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + rewardAmount,
          ...(isQuizReward && { quizCredits: (userData.quizCredits ?? 0) + rewardAmount }),
          ...(isMobileQuiz && { mobileQuizCredits: (userData.mobileQuizCredits ?? 0) + rewardAmount }),
          lastRewardAt: timestamp
        });
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
          ...(isQuizReward && { quizCredits: (userData.quizCredits ?? 0) + rewardAmount }),
          ...(isMobileQuiz && { mobileQuizCredits: (userData.mobileQuizCredits ?? 0) + rewardAmount }),
          lastRewardAt: timestamp
        });

        // Decrement pool even on fallback so accounting stays accurate
        const poolRefFallback = db.collection('system').doc('credit_pool');
        const poolDocFallback = await poolRefFallback.get();
        if (poolDocFallback.exists) {
          await poolRefFallback.update({
            distributed: (poolDocFallback.data().distributed || 0) + rewardAmount,
            remaining: (poolDocFallback.data().remaining || 10000) - rewardAmount,
            lastIssuanceAt: timestamp
          });
        } else {
          await poolRefFallback.set({ total: 10000, distributed: rewardAmount, remaining: 10000 - rewardAmount, lastIssuanceAt: timestamp });
        }

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
        ...(isQuizReward && { quizCredits: (userData.quizCredits ?? 0) + rewardAmount }),
        ...(isMobileQuiz && { mobileQuizCredits: (userData.mobileQuizCredits ?? 0) + rewardAmount }),
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
