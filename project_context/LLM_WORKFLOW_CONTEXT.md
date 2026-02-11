# AI Context: CrediLab Project Guidelines

## **Context Overview**
**Project Name:** CrediLab
**Goal:** Decentralized Coding Assessment Platform for low-end devices.
**Deadline:** Feb 26, 2026 (Hackathon).
**Core Constraint:** Must run on 2GB RAM Android phones (3G network).

---

## **Tech Stack (Strict Adherence)**
- **Frontend:** React + Vite (JavaScript).
- **Styling:** Tailwind CSS (Mobile-First).
- **Editor:** CodeMirror 6 (with "Lite Mode" logic).
- **Execution:** Judge0 API (Public Instance for MVP) - *Handle rate limits gracefully.*
- **Serverless Proxy:** Vercel Serverless Functions (API Routes) - *Secures API calls, hides Judge0 credentials, no credit card required.*
- **Backend:** Firebase (Auth/Firestore) - *Serverless architecture only.*
- **Hosting:** Vercel - *Free tier with automatic deployments from GitHub.*
- **Blockchain:** Ethereum Sepolia Testnet via MetaMask (desktop) and WalletConnect (mobile) — *Student B exploring on-chain credential verification or smart contracts. Zero gas costs (testnet only, no real ETH required).*
- **Reward System:** Credit-based system stored in Firebase Firestore — *Fixed pool of 10,000 credits (= ₱10,000 PHP). Leaderboard with no material benefits.*

---

## **Critical "Red Team" Constraints (Security)**
*When generating code, you MUST implement these specific anti-cheat/safety measures:*

1.  **Anti-Paste (Heuristic):** Do not just block `onPaste`. Instead, calculate **Keystroke Velocity**. If `(chars / time) > 50`, flag as suspicious.
2.  **Focus Tracking:** Watch `window.onblur` and `document.visibilityState`. Count violations.
3.  **Duplicate Protection:** Check Firestore if user already completed a challenge before awarding credits. Disable earning for completed challenges.
4.  **Rate Limiting:** Debounce the "Run Code" button (10s cooldown) to prevent Judge0 API abuse.

---

## **Architectural Rules**
1.  **No Heavy Assets:** Do not import large libraries (e.g., no Three.js, no heavy Lottie files).
2.  **"Lite Mode" Logic:** All UI components must have a check for `isLiteMode`. If true, render minimal HTML/CSS (no syntax highlighting, no gradients). Auto-detect: `navigator.hardwareConcurrency <= 2` enables Lite Mode. Performance gain: ~40% smaller bundle, ~200MB less memory.
3.  **Error Handling:** Never leave a `catch` block empty. Always show user feedback (e.g., "Compiler busy, retrying..."). Pre-record backup demo video in case of API failure.
4.  **Optimistic UI:** For credit awarding, show success state immediately after Firestore write, don't wait for leaderboard update to unfreeze the UI.
5.  **API Security:** Never expose Judge0 API keys in frontend. All execution requests must go through Vercel Serverless Functions proxy.

---

## **Directory Structure Map (Monorepo)**
This project uses a **monorepo** structure — frontend, backend, and blockchain code all live in one repository with dedicated folders.

```
CrediLab/
├── src/                    # Frontend (React + Vite) — Student A
│   ├── components/         # Reusable UI (Button, Card, Modal)
│   ├── pages/              # Route views (Home, Editor, Profile)
│   ├── hooks/              # Custom React hooks (useKeystrokeTracker, useFocusTracker)
│   ├── utils/              # Helper logic (Judge0 fetcher, verifier, credits)
│   ├── data/               # Static data (challenges.js, constants)
│   ├── assets/             # Images, icons, fonts
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── api/                    # Backend (Vercel Serverless Functions) — Student A
│   └── execute-code.js     # Judge0 proxy (secures API key, rate limits)
├── web3/                   # Blockchain & Wallet (Ethereum Sepolia) — Student B
│   ├── contracts/          # Smart contracts (Solidity) if applicable
│   ├── wallet/             # MetaMask + WalletConnect integration logic
│   ├── utils/              # Web3 helpers (ethers.js wrappers, hash utils)
│   └── README.md           # Student B's notes & approach decisions
├── project_context/        # Documentation (Read these if unsure)
├── public/                 # Static files (index.html, favicon)
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vercel.json             # Vercel deployment config
└── .env.local              # Environment variables (NEVER commit)
```

**Ownership Rules:**
- **Student A** owns `/src` and `/api`. Frontend + backend logic.
- **Student B** owns `/web3`. Blockchain, wallet, and Ethereum integration. **This folder is open for revision by Student B** — the initial structure is a starting point.
- **Student C** owns `/project_context` (docs) and performs QA across all folders.

---

## **Tone & Persona**
- **User:** A student developer under pressure.
- **You (AI):** A Senior Engineer / Hackathon Mentor.
- **Style:** Prioritize **"Working Dirty"** over **"Perfect Architecture."** If a `useEffect` is messy but works and is secure *enough*, keep it. We are shipping an MVP, not a SaaS product.
