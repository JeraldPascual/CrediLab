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
  - **Frontend (Mobile):** Building the mobile-optimized badge claiming UI (no code editor, large buttons, wallet connect).
  - **Security:** Implementing Keystroke Velocity and Focus Tracking hooks.
  - **Serverless Proxy:** Creating Vercel API route (`/api/execute-code`) to securely proxy Judge0 API calls.
  - **Integration:** Connecting UI to Firebase Auth/Firestore and Judge0 via Vercel.
  - **Lite Mode:** Implementing auto-detection (`hardwareConcurrency <= 2`) and manual toggle.

## 3. Blockchain Specialist (Student B)
- **Focus:** Web3 Integration (Thirdweb).
- **Tasks:**
  - Smart Contract deployment (ERC-1155/SBT) via Thirdweb dashboard to Polygon Amoy Testnet.
  - Configure Claim Conditions: "Max 1 per Wallet" + Gasless Minting (Thirdweb relayer, free tier).
  - "Connect Wallet" integration: MetaMask (desktop) + WalletConnect (mobile).
  - Minting function (triggered only after all test cases pass AND no cheat flags).
  - Wallet State Guard: Reset verification state if wallet address changes.
  - Test minting flow on both desktop and mobile.

## 4. Documentation & QA Specialist (Student C)
- **Focus:** Deliverables, Testing, & Presentation (Non-Technical).
- **Tasks:**
  - **Documentation:** Writing the Project PDF (Problem, Solution, Impact, Architecture Diagram).
  - **Presentation:** Creating the Slide Deck for the pitch (10 slides max).
  - **Red Team QA:** Trying to "break" the app (e.g., fast pasting, tab switching) to test anti-cheat measures.
  - **Lite Mode Audit:** Verifying performance on low-end devices (2GB RAM).
  - **Mobile QA:** Testing badge claiming flow on a real phone.
  - **Research:** Ensuring SDG 4 alignment in our messaging.
  - **Backup Demo Video:** Record full user flow as contingency for demo day.

---

## MVP Scope Awareness
- **We ARE building:** Student coding (desktop) + badge claiming (mobile) + ONE hardcoded challenge.
- **We are NOT building:** Professor dashboard, multiple challenges, advanced anti-cheat. These are "Phase 2" future work.
- **Desktop:** Code editor, execution, verification, anti-cheat.
- **Mobile:** Badge claiming, wallet connect, social sharing.
- **Hosting:** Vercel (frontend + serverless API routes). No credit card needed.
- **Execution API:** Judge0 (public instance). Proxied securely through Vercel serverless functions.
