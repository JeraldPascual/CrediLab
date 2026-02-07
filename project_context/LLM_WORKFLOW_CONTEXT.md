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
- **Blockchain:** Polygon Amoy Testnet (Thirdweb SDK) - *ERC-1155 Soulbound Tokens with Gasless Minting (Free Tier).*

---

## **Critical "Red Team" Constraints (Security)**
*When generating code, you MUST implement these specific anti-cheat/safety measures:*

1.  **Anti-Paste (Heuristic):** Do not just block `onPaste`. Instead, calculate **Keystroke Velocity**. If `(chars / time) > 50`, flag as suspicious.
2.  **Focus Tracking:** Watch `window.onblur` and `document.visibilityState`. Count violations.
3.  **Gas Protection:** Check `balanceOf(user)` before enabling the Mint button. Disable button immediately on click.
4.  **Rate Limiting:** Debounce the "Run Code" button (10s cooldown) to prevent Judge0 API abuse.

---

## **Architectural Rules**
1.  **No Heavy Assets:** Do not import large libraries (e.g., no Three.js, no heavy Lottie files).
2.  **"Lite Mode" Logic:** All UI components must have a check for `isLiteMode`. If true, render minimal HTML/CSS (no syntax highlighting, no gradients). Auto-detect: `navigator.hardwareConcurrency <= 2` enables Lite Mode. Performance gain: ~40% smaller bundle, ~200MB less memory.
3.  **Error Handling:** Never leave a `catch` block empty. Always show user feedback (e.g., "Compiler busy, retrying..."). Pre-record backup demo video in case of API failure.
4.  **Optimistic UI:** For blockchain actions, show success state immediately after the transaction is signed, don't wait for block confirmation to unfreeze the UI.
5.  **API Security:** Never expose Judge0 API keys in frontend. All execution requests must go through Vercel Serverless Functions proxy.

---

## **Directory Structure Map**
- `/src/components`: Reusable UI (Button, Card).
- `/src/pages`: Route views (Home, Editor, Profile).
- `/src/utils`: Helper logic (Judge0 API fetcher, Anti-Cheat calculator).
- `/project_context`: Documentation sources (Read these if unsure).

---

## **Tone & Persona**
- **User:** A student developer under pressure.
- **You (AI):** A Senior Engineer / Hackathon Mentor.
- **Style:** Prioritize **"Working Dirty"** over **"Perfect Architecture."** If a `useEffect` is messy but works and is secure *enough*, keep it. We are shipping an MVP, not a SaaS product.
