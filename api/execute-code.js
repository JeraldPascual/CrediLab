/**
 * Vercel Serverless Function: Judge0 API Proxy
 *
 * - Secures the Judge0 API key (never exposed to browser)
 * - Rate-limits requests (10-second cooldown per user via in-memory map)
 * - Verifies Firebase Auth token before execution
 *
 * Route: POST /api/execute-code
 */

// In-memory rate limit map (resets on cold start — good enough for hackathon)
const rateLimitMap = new Map();
const COOLDOWN_MS = 10000;

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

  // 1. Verify Firebase Auth token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const idToken = authHeader.split("Bearer ")[1];
  let uid;

  try {
    // Verify token with Firebase REST API (no admin SDK needed)
    // Note: Vercel serverless uses FIREBASE_API_KEY (no VITE_ prefix)
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

  // 2. Rate limit check (10s cooldown per user per submission batch)
  // Each submission sends one request per test case — use a batchId to group them
  const { batchId } = req.body || {};
  const rateLimitKey = batchId ? `${uid}:${batchId}` : uid;
  const now = Date.now();

  if (!batchId) {
    // Single run (no batch) — apply cooldown on the uid directly
    const lastCall = rateLimitMap.get(uid);
    if (lastCall && now - lastCall < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - (now - lastCall)) / 1000);
      return res.status(429).json({
        error: `Rate limited. Please wait ${waitSec} seconds before submitting again.`,
      });
    }
    rateLimitMap.set(uid, now);
  } else {
    // Batched run — only rate-limit between different batches, not within one
    const batchFirstCall = rateLimitMap.get(rateLimitKey);
    if (!batchFirstCall) {
      // First call in this batch — check if previous batch was too recent
      const lastBatch = rateLimitMap.get(uid);
      if (lastBatch && now - lastBatch < COOLDOWN_MS) {
        const waitSec = Math.ceil((COOLDOWN_MS - (now - lastBatch)) / 1000);
        return res.status(429).json({
          error: `Rate limited. Please wait ${waitSec} seconds before submitting again.`,
        });
      }
      rateLimitMap.set(uid, now);
      rateLimitMap.set(rateLimitKey, now);
    }
    // Subsequent calls in same batch — allowed through without rate limit
  }

  // 3. Parse request body
  const { code, languageId, stdin } = req.body || {};
  if (!code || !languageId) {
    return res.status(400).json({ error: "Missing code or languageId" });
  }

  // Input size limits (prevent abuse)
  if (code.length > 50000) {
    return res.status(400).json({ error: "Code exceeds maximum length (50KB)" });
  }
  if (stdin && stdin.length > 10000) {
    return res.status(400).json({ error: "Input exceeds maximum length (10KB)" });
  }

  // 4. Submit to Judge0 CE API
  const JUDGE0_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";

  // Build headers — RapidAPI key if available, otherwise plain
  const judge0Headers = { "Content-Type": "application/json" };
  if (RAPIDAPI_KEY) {
    judge0Headers["X-RapidAPI-Key"] = RAPIDAPI_KEY;
    judge0Headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
  }

  try {
    // Step 1: Submit (async — don't use wait=true, it times out on free tier)
    const submitRes = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=true`,
      {
        method: "POST",
        headers: judge0Headers,
        body: JSON.stringify({
          source_code: Buffer.from(code).toString("base64"),
          language_id: languageId,
          stdin: stdin ? Buffer.from(stdin).toString("base64") : null,
          cpu_time_limit: 5,
          memory_limit: 128000,
        }),
      }
    );

    if (!submitRes.ok) {
      const errText = await submitRes.text();
      console.error("Judge0 submit error:", submitRes.status, errText);
      return res.status(502).json({ error: "Code execution unavailable (Judge0 " + submitRes.status + ")" });
    }

    const { token } = await submitRes.json();
    if (!token) {
      return res.status(502).json({ error: "No submission token returned from Judge0" });
    }

    // Step 2: Poll for result (max 10 attempts × 1.5s = 15s)
    const decode = (s) => (s ? Buffer.from(s, "base64").toString("utf-8") : null);
    let result = null;

    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 1500));

      const pollRes = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,status,time,memory,compile_output`,
        { headers: judge0Headers }
      );

      if (!pollRes.ok) continue;

      const data = await pollRes.json();
      // Status id 1 = In Queue, 2 = Processing
      if (data.status?.id <= 2) continue;

      result = data;
      break;
    }

    if (!result) {
      return res.status(504).json({ error: "Code execution timed out. Try again." });
    }

    return res.status(200).json({
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      compile_output: decode(result.compile_output),
      status: result.status,
      time: result.time,
      memory: result.memory,
    });
  } catch (err) {
    console.error("Judge0 proxy error:", err);
    return res.status(500).json({ error: "Failed to execute code: " + err.message });
  }
}
