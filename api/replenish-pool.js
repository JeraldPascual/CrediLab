/**
 * POST /api/replenish-pool
 *
 * Called by Student B after minting new CLB to the system wallet on-chain.
 * Increments the Firestore pool counter so the header pool bar stays accurate.
 *
 * Auth: x-admin-secret header
 *
 * Body: { amount: number, txHash: string, note?: string }
 *
 * Student B Android / Kotlin usage:
 *   val body = """{"amount":5000,"txHash":"0x...","note":"Month top-up"}"""
 *   val req = Request.Builder()
 *     .url("https://credi-lab.vercel.app/api/replenish-pool")
 *     .addHeader("x-admin-secret", ADMIN_SECRET)
 *     .post(body.toRequestBody("application/json".toMediaType()))
 *     .build()
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

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const isAllowed =
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173' ||
    origin === 'http://10.0.2.2:5173';
  if (isAllowed) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Admin auth
  if (req.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { amount, txHash, note } = req.body || {};
  if (!amount || typeof amount !== 'number' || amount <= 0)
    return res.status(400).json({ error: 'Missing or invalid amount' });
  if (!txHash || typeof txHash !== 'string')
    return res.status(400).json({ error: 'Missing txHash — required for audit trail' });

  try {
    const db = getDB();
    const poolRef = db.collection('system').doc('credit_pool');
    const poolDoc = await poolRef.get();
    const timestamp = new Date().toISOString();

    let newTotal, newRemaining;

    if (poolDoc.exists) {
      const d = poolDoc.data();
      newTotal     = (d.total     || 10000) + amount;
      newRemaining = (d.remaining || 0)     + amount;
      await poolRef.update({ total: newTotal, remaining: newRemaining, lastReplenishedAt: timestamp, lastReplenishTxHash: txHash, lastReplenishNote: note || null });
    } else {
      newTotal = 10000 + amount;
      newRemaining = newTotal;
      await poolRef.set({ total: newTotal, distributed: 0, remaining: newRemaining, lastReplenishedAt: timestamp, lastReplenishTxHash: txHash, lastReplenishNote: note || null });
    }

    // Audit log
    await db.collection('events').doc(`replenish-${Date.now()}`).set({
      type: 'pool_replenish', amountCLB: amount, txHash, note: note || null,
      timestamp, newTotal, newRemaining, status: 'success',
    });

    console.log(`[Pool] +${amount} CLB minted. New total: ${newTotal}, remaining: ${newRemaining}`);
    return res.status(200).json({ success: true, newTotal, newRemaining, txHash });

  } catch (err) {
    console.error('[Pool] Error:', err.message);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}
