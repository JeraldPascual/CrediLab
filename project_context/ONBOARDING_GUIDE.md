# CrediLab Team Onboarding Guide: Build Sustainable Upgrades Hackathon

**Welcome to Team CrediLab.** We are on a mission to win the BSU Hackathon by building a tool that truly matters.

---

## 1. The Big Picture: What is CrediLab?

Think of **CrediLab** as a **"Digital Notary for Skills."**

Imagine a student in a remote area who learns to code on a cheap phone but has no college degree. How do they prove they can code?
1.  **They write code** in our app (like taking a test).
2.  **Our App (The Witness)** verifies the code runs correctly.
3.  **The Wallet (The Notary)** stamps a permanent credential linked to your wallet address that says, *"This student proved this skill on this date."*

This credential is digital proof they can show to employers, and because it's linked to their wallet with a code hash, **no one can fake it.**

---

## 2. To Member B: The Blockchain Specialist (The Trust Architect)

You are the guardian of the **"Truth."** Without your part, CrediLab is just another quiz app. Your job is to make sure the credentials we issue are trustworthy and the credit system motivates students.

### Your Strategy: "Ethereum + Credit System"
We are 1st-year students building a **credit-based reward system** with Ethereum Sepolia testnet integration (zero gas costs). You'll explore how to use Ethereum for credential verification without real money costs.
*   **Think of Ethereum Sepolia** as the "global truth ledger" for testing. You can store credential proofs on-chain or use smart contracts for the credit system without spending real ETH.
*   **Flexibility:** You have the freedom to decide the best approach — whether that's storing hashes on-chain, using a simple smart contract, or hybrid (Firestore + Ethereum Sepolia).

### Key Concept: The Credit Pool + Ethereum Credentials
*   **What is it?** A fixed pool of 10,000 credits displayed to all students (= ₱10,000 PHP for understanding).
*   **Why Ethereum Sepolia?** Sepolia testnet provides immutable proof for testing. Credentials stored on-chain can't be faked or deleted, and it costs zero real money (testnet only).
*   **Leaderboard:** Ranks students by credits earned. No material benefits, just bragging rights.

### Your Zero-to-Hero Checklist (Week 1)
1.  [ ] **Set Up MetaMask:** Install MetaMask browser extension and create a wallet.
2.  [ ] **Learn WalletConnect:** Your responsibility is integrating WalletConnect for mobile wallet connection.
3.  [ ] **Explore Ethereum Sepolia:** Research simple smart contracts (Solidity basics) or on-chain data storage on Sepolia testnet. Decide what makes sense for our MVP (zero gas costs, testnet only).
4.  [ ] **Understand Firestore:** The credit pool and leaderboard live in Firebase Firestore. Learn basic Firestore read/write.
5.  [ ] **Test Wallet Flow:** Practice connecting a wallet on mobile using WalletConnect QR code.

---

## 3. To Member C: The Docs & QA Specialist (The Narrative Strategist)

You are our **"Secret Weapon."**
Most hackathon teams write amazing code but lose because their presentation is messy or they forget to explain *why* their app matters. You own **40% of the total score** (SDG Relevance + Presentation).

### Your Role: The "Security Auditor"
You aren't just "testing" buttons. You are **auditing** the experience.
*   **The "Lite Mode" Test:** Your job is to open our app on the oldest, slowest phone you can find. Does it lag? Is the text readable? If yes, report it. This proves our "Digital Inclusion" promise.
*   **The SDG Check:** Every time we add a feature, ask: *"Does this help a student get a job (SDG 4)?"* Keep us honest.

### Your Project PDF Checklist
The judges need a PDF. Start drafting these sections now:
1.  **The Problem:** "Students on low-end devices are excluded from tech careers."
2.  **The Solution:** "A lightweight, blockchain-verified skill platform."
3.  **SDG Impact:** "Directly supports SDG 4.4 (Technical Skills for Employment)."
4.  **How it Works:** Simple flow: *Take Test -> Pass -> Earn Credits -> Get Verified Credential.*

---

## 4. The Security Mindset (Red Team Awareness)

We are building a certification platform. If it's easy to cheat, our badges are worthless.
*   **Trust is our Product:** We don't just sell code; we sell *proof* of skill.
*   **The "Anti-Cheat" Layer:** We track typing speed and tab switching. This isn't to be mean; it's to protect the value of the credits for the honest students.
*   **The Wallet Rule:** One person, one wallet, one set of credentials. We link wallet addresses to completion proofs so credentials can't be faked.

## 5. Team Synergy: How We Handshake

We work like a relay team. Here is the baton pass:

1.  **Student A (Frontend/Logic):** Builds the **"Classroom."**
    *   *Desktop Action:* User writes code in CodeMirror editor, enters test input in stdin box.
    *   *System:* Checks keystroke velocity & focus. Sends code to Vercel serverless function → Judge0 API. If all test cases PASS → Generates a "Pass Signal."
    *   *Mobile Action:* Shows "You earned credits!" banner with leaderboard rank for students who completed the challenge on desktop.

2.  **Student B (Blockchain/Wallet):** Runs the **"Reward Engine."**
    *   *Action:* Takes the "Pass Signal" from Student A's logic.
    *   *Desktop:* User connects MetaMask wallet (Student A's integration).
    *   *Mobile:* User connects via WalletConnect (Student B's integration).
    *   *System:* Awards credits from the global pool. Updates leaderboard. Stores code hash + wallet address in Firestore as credential proof.

3.  **Student C (Docs/QA):** Writes the **"History Book."**
    *   *Action:* Tries to cheat the system (Red Team) on both desktop and mobile.
    *   *Output:* Takes screenshots of the leaderboard and credit system. Writes the story: *"See? We used a credit system + wallet-linked credentials to verify skills for $0 cost!"* Puts it in the slides.
    *   *Backup:* Records a demo video of the full flow as contingency.

---

## 6. MVP Scope (What We're Actually Building)

**IN SCOPE:**
- Student coding experience (desktop-optimized)
- Credit earning + leaderboard (mobile-optimized view)
- TWO professor-style Java challenges with user input
- Basic anti-cheat (keystroke velocity + focus tracking)
- Lite Mode for low-end devices
- Wallet-linked credentials (MetaMask desktop + WalletConnect mobile)
- Global credit pool (10,000 credits = ₱10,000 PHP)

**NOT IN SCOPE (Phase 2):**
- Professor dashboard
- Large challenge library
- Advanced anti-cheat (proctoring)
- Real-time collaboration
- Paid blockchain transactions or subscriptions
