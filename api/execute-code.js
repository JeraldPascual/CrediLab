/**
 * Vercel Serverless Function: Judge0 API Proxy
 *
 * Purpose:
 * - Secures the Judge0 API key (never exposed to the browser)
 * - Rate-limits requests (10-second cooldown per user)
 * - Verifies Firebase Auth token before execution
 *
 * Route: POST /api/execute-code
 *
 * Request Body:
 * {
 *   code: string,        // Source code to execute
 *   languageId: number,   // Judge0 language ID (62 = Java)
 *   stdin: string         // Standard input for Scanner
 * }
 *
 * Headers:
 *   Authorization: Bearer <firebase-id-token>
 *
 * Owner: Student A
 * Status: Scaffold — implementation coming in Phase 1
 */

export default async function handler(req, res) {
  // TODO: Implement in Phase 1
  // 1. Verify Firebase Auth token
  // 2. Rate limit check (10s cooldown)
  // 3. Forward to Judge0 API
  // 4. Return result

  res.status(501).json({
    error: 'Not implemented yet',
    message: 'Judge0 proxy will be implemented in Phase 1'
  });
}
