/**
 * Vercel Serverless Function: Verify Challenge Completion
 *
 * Purpose: Verify student completed challenge and mark as complete in Firestore.
 * Note: CLB tokens are transferred via MetaMask (frontend), not server-side.
 *
 * Route: POST /api/reward-student
 *
 * Flow:
 * 1. Verify Firebase Auth token
 * 2. Check if challenge already completed
 * 3. Mark challenge as complete in Firestore
 * 4. Return success (student will claim reward via MetaMask separately)
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side)
if (getApps().length === 0) {
  // For Vercel deployment, use service account from environment variable
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      };

  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

export default async function handler(req, res) {
  // CORS headers — restrict to app domain in production
  const allowedOrigins = ['https://credilab.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
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

    // 4. Validate wallet address
    const walletAddress = userData.walletAddress;
    if (!walletAddress) {
      return res.status(400).json({
        error: "No wallet connected. Please connect MetaMask first.",
        needsWallet: true
      });
    }

    // 5. Check if challenge already completed
    const completedChallenges = userData.completedChallenges || [];
    if (completedChallenges.includes(challengeId)) {
      return res.status(409).json({
        error: "Challenge already completed",
        alreadyCompleted: true
      });
    }

    // 6. Mark challenge as complete in Firestore
    const timestamp = new Date().toISOString();

    await userRef.update({
      completedChallenges: [...completedChallenges, challengeId],
      lastCompletionAt: timestamp
    });

    // 7. Return success (student will claim reward via MetaMask)
    return res.status(200).json({
      success: true,
      message: "Challenge completed! Claim your CLB reward via MetaMask.",
      needsClaim: true,
      rewardAmount,
      challengeId
    });

  } catch (error) {
    console.error('[Reward] Error:', error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
