/**
 * Vercel Serverless Function: Log Blockchain Transaction
 *
 * Purpose: Log CLB token transfer after student claims reward via MetaMask
 *
 * Route: POST /api/log-transaction
 *
 * Flow:
 * 1. Verify Firebase Auth token
 * 2. Log transaction to events/issuance collection
 * 3. Update system pool stats
 * 4. Increment user's Firestore credits (for UI display)
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
      console.error('[log-transaction] JSON.parse failed:', e.message);
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
    const { challengeId, txHash, blockNumber, amount } = req.body || {};

    if (!challengeId || !txHash || !amount) {
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

    // 4. Log transaction to events collection
    const timestamp = new Date().toISOString();

    await db.collection('events').doc(`issuance-${uid}-${challengeId}-${Date.now()}`).set({
      type: 'issuance',
      uid,
      challengeId,
      amountCLB: amount,
      walletAddress,
      txHash,
      blockNumber: blockNumber || null,
      timestamp,
      status: 'success',
      method: 'metamask' // Indicates student signed transaction
    });

    // 5. Update user's Firestore credits (for UI caching)
    await userRef.update({
      credits: (userData.credits || 0) + amount,
      totalCLBEarned: (userData.totalCLBEarned ?? userData.credits ?? 0) + amount,
      lastRewardAt: timestamp
    });

    // 6. Update system pool stats
    const poolRef = db.collection('system').doc('credit_pool');
    const poolDoc = await poolRef.get();

    if (poolDoc.exists) {
      await poolRef.update({
        distributed: (poolDoc.data().distributed || 0) + amount,
        remaining: (poolDoc.data().remaining || 10000) - amount,
        lastIssuanceAt: timestamp
      });
    } else {
      await poolRef.set({
        total: 10000,
        distributed: amount,
        remaining: 10000 - amount,
        lastIssuanceAt: timestamp
      });
    }

    console.log(`[Log] Transaction logged: ${txHash} (${amount} CLB to ${walletAddress})`);

    return res.status(200).json({
      success: true,
      message: "Transaction logged successfully"
    });

  } catch (error) {
    console.error('[Log] Error:', error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
