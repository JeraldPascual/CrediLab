# Tech Stack

## Frontend (The App)
- **Framework:** React.js (via Vite) - *Fast & Lightweight.*
- **Compatibility:** `vite-plugin-node-polyfills` (Required for Ethereum/Web3 integration if using ethers.js or web3.js).
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

## Credit & Reward System (The Motivation Layer)
- **Credits Pool:** Fixed 10,000 credits displayed globally (1 credit = ₱1 PHP for student understanding).
- **Distribution:** Students earn credits by completing challenges quickly and correctly.
- **Leaderboard:** Public ranking by most credits earned (no material benefits, bragging rights only).
- **Storage:** Firebase Firestore (credits balance, leaderboard rankings, completion timestamps).
- **Goal:** Encourage speed and task completion — credits deplete from the shared pool, creating urgency.

## Wallet Integration (Identity Layer)
- **Desktop:** MetaMask (managed by Student A).
- **Mobile:** WalletConnect (managed by Student B).
- **Blockchain:** Ethereum Sepolia Testnet (zero-cost testnet for demo purposes).
- **Purpose:** Wallet address serves as decentralized identity for credential verification.
- **Implementation:** Direct MetaMask/WalletConnect integration with Sepolia testnet. Student B will determine final Ethereum integration approach (on-chain storage or smart contracts).

## Tools
- **Version Control:** GitHub.
