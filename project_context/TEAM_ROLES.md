# Team Roles (1st Year BSIT)

## 1. The Architect (AI Mentor)
- Provides code snippets.
- Ensures architectural integrity.
- Reminds team of SDG goals.
- **Goal:** Guide the team to a winning MVP by Feb 26.

## 2. Full Stack Developer (Student A - You)
- **Focus:** Frontend (React/UI) & Serverless Backend (Vercel/Firebase).
- **Tasks:**
  - **Frontend (Desktop):** Building the Code Editor page with CodeMirror 6, stdin input box, and output panel.
  - **Frontend (Mobile):** Building the mobile-optimized credit/credential viewing UI (no code editor, large buttons).
  - **Security:** Implementing Keystroke Velocity and Focus Tracking hooks.
  - **Serverless Proxy:** Creating Vercel API route (`/api/execute-code`) to securely proxy Judge0 API calls.
  - **Integration:** Connecting UI to Firebase Auth/Firestore and Judge0 via Vercel.
  - **Wallet (Desktop):** MetaMask integration for desktop wallet connection.
  - **Credit System:** Implementing the global credit pool display, credit earning logic, and leaderboard UI.
  - **Lite Mode:** Implementing auto-detection (`hardwareConcurrency <= 2`) and manual toggle.

## 3. Blockchain Specialist (Student B)
- **Focus:** Ethereum Integration & Credit/Reward System.
- **Tasks:**
  - **Wallet (Mobile):** WalletConnect integration for mobile wallet connection.
  - **Ethereum Integration:** Exploring on-chain credential storage or smart contract implementation on Sepolia testnet (zero-cost, demo purposes only).
  - **Credit System Backend:** Implementing credit pool logic in Firestore (deducting from global pool, awarding to users).
  - **Leaderboard:** Building the leaderboard feature (ranked by most credits, no material benefits).
  - **Wallet State Guard:** Reset verification state if wallet address changes.
  - **Credential Verification:** Storing completion proofs (code hash + timestamp) linked to wallet address (Firestore + potential Ethereum integration).
  - **Testing:** Test wallet connect flow on both desktop (MetaMask) and mobile (WalletConnect).

## 4. Documentation & QA Specialist (Student C)
- **Focus:** Deliverables, Testing, & Presentation (Non-Technical).
- **Tasks:**
  - **Documentation:** Writing the Project PDF (Problem, Solution, Impact, Architecture Diagram).
  - **Presentation:** Creating the Slide Deck for the pitch (10 slides max).
  - **Red Team QA:** Trying to "break" the app (e.g., fast pasting, tab switching) to test anti-cheat measures.
  - **Lite Mode Audit:** Verifying performance on low-end devices (2GB RAM).
  - **Mobile QA:** Testing wallet connect and credit claiming flow on a real phone.
  - **Research:** Ensuring SDG 4 alignment in our messaging.
  - **Backup Demo Video:** Record full user flow as contingency for demo day.

---

## MVP Scope Awareness
- **We ARE building:** Student coding (desktop) + credit earning + leaderboard + wallet-linked credentials + TWO professor-style Java problems with user input.
- **We are NOT building:** Professor dashboard, advanced anti-cheat, paid blockchain transactions. These are "Phase 2" future work.
- **Desktop:** Code editor, execution, verification, anti-cheat, MetaMask wallet connect.
- **Mobile:** Credit viewing, WalletConnect, social sharing.
- **Credits:** Fixed pool of 10,000 credits (= ₱10,000 PHP). Students earn by completing challenges. Leaderboard ranks by credits.
- **Hosting:** Vercel (frontend + serverless API routes). No credit card needed.
- **Execution API:** Judge0 (public instance). Proxied securely through Vercel serverless functions.
