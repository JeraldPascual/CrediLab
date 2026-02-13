/**
 * Execute code via Judge0 API
 *
 * In production (deployed to Vercel): uses /api/execute-code serverless function
 * In development (localhost): directly calls Judge0 public API from browser
 */

const IS_DEV = import.meta.env.DEV;
const JUDGE0_URL = "https://ce.judge0.com";

export async function executeCode({ code, languageId, stdin, firebaseToken }) {
  // In production, use the serverless proxy (has auth + rate limiting)
  if (!IS_DEV) {
    const res = await fetch("/api/execute-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({ code, languageId, stdin }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Execution failed");
    }

    return await res.json();
  }

  // In development, call Judge0 directly from browser (no auth needed for testing)
  console.log("[DEV MODE] Calling Judge0 directly from browser (no rate limit protection)");

  try {
    const submitRes = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true&fields=stdout,stderr,status,time,memory,compile_output`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: btoa(code),
          language_id: languageId,
          stdin: stdin ? btoa(stdin) : null,
          cpu_time_limit: 5,
          memory_limit: 128000,
        }),
      }
    );

    if (!submitRes.ok) {
      throw new Error(`Judge0 API error: ${submitRes.status}`);
    }

    const result = await submitRes.json();

    // Decode base64 fields
    const decode = (s) => (s ? atob(s) : null);

    return {
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      compile_output: decode(result.compile_output),
      status: result.status,
      time: result.time,
      memory: result.memory,
    };
  } catch (err) {
    console.error("Judge0 execution error:", err);
    throw err;
  }
}
