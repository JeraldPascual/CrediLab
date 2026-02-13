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
const COOLDOWN_MS = 10_000;

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
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
  } catch (err) {
    return res.status(401).json({ error: "Token verification failed" });
  }

  // 2. Rate limit check (10s cooldown per user)
  const now = Date.now();
  const lastCall = rateLimitMap.get(uid);
  if (lastCall && now - lastCall < COOLDOWN_MS) {
    const waitSec = Math.ceil((COOLDOWN_MS - (now - lastCall)) / 1000);
    return res.status(429).json({
      error: `Rate limited. Please wait ${waitSec} seconds before submitting again.`,
    });
  }
  rateLimitMap.set(uid, now);

  // 3. Parse request body
  const { code, languageId, stdin } = req.body || {};
  if (!code || !languageId) {
    return res.status(400).json({ error: "Missing code or languageId" });
  }

  // 4. Submit to Judge0 CE API (free public endpoint — no API key required)
  // Using ce.judge0.com public instance for hackathon/testing
  // For production, self-host Judge0 or use RapidAPI paid tier
  const JUDGE0_URL = process.env.JUDGE0_URL || "https://ce.judge0.com";

  try {
    // Submit code — use synchronous endpoint (wait=true) for simplicity
    const submitRes = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,status,time,memory,compile_output`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.error("Judge0 API error:", submitRes.status, errText);
      return res.status(502).json({ error: "Judge0 API error: " + submitRes.status });
    }

    const result = await submitRes.json();

    // Decode base64 fields
    const decode = (s) => (s ? Buffer.from(s, "base64").toString("utf-8") : null);

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
