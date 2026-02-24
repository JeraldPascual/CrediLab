# Utils

Helper functions for API interaction.

| File | Purpose |
|---|---|
| `executeCode.js` | Sends code to `/api/execute-code` (Judge0 CE API) with Firebase auth token. Dev mode calls Judge0 directly; production uses the Vercel serverless proxy with auth + rate limiting. |
