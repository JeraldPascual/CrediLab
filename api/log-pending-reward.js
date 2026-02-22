/**
 * Vercel Serverless Function: Log Pending CLB Reward
 *
 * Purpose: Track rewards that need to be sent by system admin in batch
 *
 * Route: POST /api/log-pending-reward
 *
 * Flow:
 * 1. Verify Firebase Auth token
 * 2. Create pending reward document in Firestore
 * 3. Admin dashboard will show all pending rewards for batch processing
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
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
    console.error('[log-pending-reward] Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
  }
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

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
    // 1. Verify Firebase Auth token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let uid;

    try {
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
    const { challengeId, amount } = req.body || {};

    if (!challengeId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 3. Get user data
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const walletAddress = userData.walletAddress;

    if (!walletAddress) {
      return res.status(400).json({ error: "No wallet connected" });
    }

    // 4. Create pending reward document
    const timestamp = new Date().toISOString();
    const pendingId = `pending-${uid}-${challengeId}-${Date.now()}`;

    await db.collection('pending_rewards').doc(pendingId).set({
      uid,
      email: userData.email,
      displayName: userData.displayName,
      walletAddress,
      challengeId,
      amountCLB: amount,
      status: 'pending', // pending | sent | failed
      createdAt: timestamp,
      sentAt: null,
      txHash: null
    });

    console.log(`[Pending] Reward logged: ${amount} CLB for ${walletAddress} (${challengeId})`);

    // 5. Update Firestore credits immediately (optimistic UI)
    await userRef.update({
      credits: (userData.credits || 0) + amount,
      totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + amount,
      pendingRewards: (userData.pendingRewards || 0) + amount
    });

    return res.status(200).json({
      success: true,
      message: "Reward marked as pending. Admin will send CLB tokens soon.",
      pendingId
    });

  } catch (error) {
    console.error('[Pending] Error:', error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
