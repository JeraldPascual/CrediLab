# Tech Stack

## Frontend (The App)
- **Framework:** React.js (via Vite) - *Fast & Lightweight.*
- **Compatibility:** `vite-plugin-node-polyfills` (Required for Web3/Buffer support).
- **Language:** JavaScript.
- **Editor:** CodeMirror 6 (Supports Java/C# highlighting).
- **Styling:** Tailwind CSS (Utility-first).
- **Security:** Custom Anti-Cheat Hooks (Keystroke Velocity, Focus Tracking).

## Execution Engine (The "Lab")
- **Service:** **Judge0 API** (Public Instance for MVP, self-hosting documented as future work).
- **Languages Supported:** Java, C#, Python, JavaScript.
- **Method:** "Standard Input Injection" (Sends pre-defined inputs to handle `Scanner` logic).
- **Resilience:** Rate-limited and debounced to prevent API abuse (429 handling).
- **Future:** Self-host Judge0 Docker container on cloud infrastructure for production scalability.

## Backend-as-a-Service (BaaS)
- **Database:** Firebase Firestore (Stores User Profiles, Integrity Logs).
- **Auth:** Firebase Auth (Google Login).
- **Hosting:** Vercel (Frontend + Serverless API Routes).
- **Serverless Proxy:** Vercel Serverless Functions (Secures Judge0 API calls and hides API keys, no credit card required).

## Blockchain (The Trust Layer)
- **SDK:** Thirdweb React SDK.
- **Network:** Polygon Amoy Testnet.
- **Contract:** ERC-1155 (Soulbound / Non-Transferable).

## Tools
- **Version Control:** GitHub.
