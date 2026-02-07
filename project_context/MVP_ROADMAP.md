# MVP Roadmap: CrediLab (BulSU x  Hackathon)

**Official Dev Period:** Feb 1 - Mar 5, 2026
**Current Date:** Feb 6, 2026

## Phase 1: Setup & Core Logic (Now - Feb 16)
*Goal: Have a working skeleton for Checkpoint 1.*
- [ ] **Initialize Project:** Git, React (Vite), Firebase Config, ESLint.
- [ ] **UI/UX Skeleton:** Landing Page, Code Editor Page, Output Panel (Responsive).
- [ ] **Authentication:** Firebase Login (Google only for MVP—faster than email/password).
- [ ] **Vercel Setup:** Create `/api` folder with serverless function for Judge0 proxy (no credit card needed).
- [ ] **Code Editor:** Integrate CodeMirror 6 with Java syntax highlighting.
- [ ] **Input/Output UI:** Add stdin textbox and stdout/stderr display panel.
- [ ] **Basic Execution:** Wire "Run Code" button → Vercel API Route → Judge0 → Display output.
- [ ] **Error Handling:** Show user-friendly messages for API failures ("Compiler busy, please retry").
- [ ] **Checkpoint 1 Prep:** Demo code editor + successful Java "Hello World" execution.

## Phase 2: Assessment & Blockchain (Feb 17 - Feb 23)
*Goal: Functional integration for Checkpoint 2.*
- [ ] **Test Cases:** Implement ONE hardcoded coding challenge with 3 test cases (input/expected output pairs).
- [ ] **Verification Logic:** Compare Judge0 stdout with expected output, show pass/fail.
- [ ] **Lite Mode Toggle:** Add visible UI toggle with auto-detection (hardwareConcurrency <= 2).
- [ ] **Lite Mode Implementation:** Disable syntax highlighting, use monospace plain text, high-contrast colors.
- [ ] **Smart Contract:** Deploy ERC-1155 to Polygon Amoy via Thirdweb ("Edition Drop" template).
- [ ] **Claim Conditions:** Set "Max 1 per Wallet" + Configure Thirdweb gasless relayer (free tier).
- [ ] **Wallet Integration:** Add Thirdweb Connect Wallet button with MetaMask/WalletConnect support.
- [ ] **Minting Flow:** Check wallet balance → If 0 badges AND test passed → Enable "Mint Badge" button.
- [ ] **Basic Anti-Cheat:** Add keystroke velocity tracking (flag if >50 chars/sec) + focus loss counter.
- [ ] **Checkpoint 2 Prep:** Demo complete flow: Login → Code → Pass Test → Mint Badge → Show on PolygonScan.

## Phase 3: Polish & Documentation (Feb 24 - Feb 26)
*Goal: Submission Ready.*
- [ ] **Bug Fixes:** Test on Chrome, Firefox, mobile Safari. Fix layout issues.
- [ ] **Error Messages:** Ensure all error states have clear user feedback.
- [ ] **Loading States:** Add spinners for all async operations (Run Code, Mint Badge).
- [ ] **Gas Cost Strategy:** Document that Thirdweb gasless relayer sponsors minting for MVP.
- [ ] **Project PDF:** Write Problem, Solution (with architecture diagram), SDG 4 Impact, Tech Stack, Demo screenshots.
- [ ] **Presentation Deck:** 10 slides max—Problem, Solution Demo, Tech Stack, Security, SDG Impact, Roadmap.
- [ ] **Code Comments:** Add inline documentation for complex logic (anti-cheat, verification).
- [ ] **Feb 26:** Submit all deliverables before deadline.

## Phase 4: Demo Prep (Feb 27 - Mar 5)
*Goal: Winning Pitch.*
- [ ] **Backup Demo Video:** Record 3-minute video of full user flow as contingency.
- [ ] **Backup Wallets:** Set up 5 wallets with pre-funded MATIC for demo minting.
- [ ] **Morning Test:** Run full demo flow on presentation day morning to verify API availability.
- [ ] **Pitch Rehearsal:** Practice 5-minute pitch focusing on: Problem → Solution → SDG Impact → Live Demo.
- [ ] **Demo Setup:** Laptop with Chrome DevTools mobile view (Pixel 5), backup hotspot, video ready.
- [ ] **Talking Points:** Memorize key stats (40% smaller bundle in Lite Mode, gasless minting, SBT prevents credential fraud).
- [ ] **Mar 5:** Present with confidence. Lead with live demo, fall back to video if needed.
