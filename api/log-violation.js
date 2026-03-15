/**
 * Vercel Serverless Function: Log Anti-Cheat Violations (server-only writes)
 *
 * Route: POST /api/log-violation
 * Auth: Firebase ID Token (Bearer)
 * Body: { challengeId: string, reason: string, metadata?: object }
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

function getDB() {
  if (getApps().length === 0) {
    let serviceAccount;
    try {
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          };
    } catch (e) {
      console.error("[log-violation] JSON.parse failed:", e.message);
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };
    }
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

export default async function handler(req, res) {
  // CORS — allow Vercel deployments, localhost, and Android emulator
  const origin = req.headers.origin || "";
  const isAllowed =
    origin.endsWith(".vercel.app") ||
    origin === "http://localhost:5173" ||
    origin === "http://localhost:3000" ||
    origin === "http://10.0.2.2:5173";
  if (isAllowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const db = getDB();

    // ── 1. Verify Firebase Auth token ──────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
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

    // ── 2. Validate request body ──────────────────────────────────────────
    const { challengeId, reason, metadata } = req.body || {};

    if (!challengeId || typeof challengeId !== "string") {
      return res.status(400).json({ error: "challengeId is required" });
    }

    if (!reason || typeof reason !== "string") {
      return res.status(400).json({ error: "reason is required" });
    }

    const now = Date.now();
    const summaryDocId = `${uid}_${challengeId}`;
    const summaryRef = db.collection("violationSummaries").doc(summaryDocId);

    const logEntry = {
      userId: uid,
      challengeId,
      reason,
      metadata: metadata || null,
      timestamp: now,
    };

    // ── 3. Write summary + audit log (server-only) ────────────────────────
    await db.runTransaction(async (tx) => {
      const summarySnap = await tx.get(summaryRef);
      const prevCount = summarySnap.exists ? summarySnap.data().count || 0 : 0;
      const nextCount = prevCount + 1;

      tx.set(
        summaryRef,
        {
          userId: uid,
          challengeId,
          count: nextCount,
          lastUpdated: now,
          log: FieldValue.arrayUnion({ reason, timestamp: now, count: nextCount }),
        },
        { merge: true }
      );
    });

    await db.collection("cheatLogs").add(logEntry);

    return res.status(200).json({
      success: true,
      message: "Violation logged",
    });
  } catch (error) {
    console.error("[log-violation] Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
}
