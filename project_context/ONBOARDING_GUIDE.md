# CrediLab Team Onboarding Guide: Build Sustainable Upgrades Hackathon

**Welcome to Team CrediLab.** We are on a mission to win the BSU Hackathon by building a tool that truly matters.

---

## 1. The Big Picture: What is CrediLab?

Think of **CrediLab** as a **"Digital Notary for Skills."**

Imagine a student in a remote area who learns to code on a cheap phone but has no college degree. How do they prove they can code?
1.  **They write code** in our app (like taking a test).
2.  **Our App (The Witness)** verifies the code runs correctly.
3.  **The Blockchain (The Notary)** stamps a permanent, unchangeable "Seal of Approval" (Badge) that says, *"This student proved this skill on this date."*

This badge is digital proof they can show to employers, and because it's on the blockchain, **no one can fake it.**

---

## 2. To Member B: The Blockchain Specialist (The Trust Architect)

You are the guardian of the **"Truth."** Without your part, CrediLab is just another quiz app. Your job is to make sure the credentials we issue are permanent and trustworthy.

### Your Strategy: "Managed Web3"
We are 1st-year students, so we won't write complex Solidity code from scratch. We will use **Thirdweb**.
*   **Think of Thirdweb** like "Lego for Blockchain." Instead of molding the plastic yourself, you just snap together pre-made blocks (Smart Contracts) to build what we need.

### Key Concept: The Soulbound Token (SBT)
*   **What is an NFT?** A digital item you can sell (like a bored ape picture).
*   **What is an SBT?** A digital item that is **glued to your wallet forever**. You cannot sell it or give it away.
*   **Why we need it:** Academic degrees shouldn't be tradable! You don't want a student selling their "Python Certificate" to someone else. SBTs solve this perfectly.

### Your Zero-to-Hero Checklist (Week 1)
1.  [ ] **Create a Thirdweb Account:** Go to `thirdweb.com` and sign up.
2.  [ ] **Get Test Money:** Set up a "MetaMask" wallet and get free "Amoy MATIC" tokens from a faucet (ask me for the link later).
3.  [ ] **Deploy a Contract:** In Thirdweb, find the "Edition Drop" or "ERC-1155" contract and deploy it to "Polygon Amoy Testnet." This is our credential factory!

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
4.  **How it Works:** Simple flow: *Take Test -> Pass -> Get Verified Badge.*

---

## 4. The Security Mindset (Red Team Awareness)

We are building a certification platform. If it's easy to cheat, our badges are worthless.
*   **Trust is our Product:** We don't just sell code; we sell *proof* of skill.
*   **The "Anti-Cheat" Layer:** We track typing speed and tab switching. This isn't to be mean; it's to protect the value of the badge for the honest students.
*   **The Blockchain Rule:** One person, one wallet, one badge. We strictly enforce "Soulbound" rules so certificates can't be sold.

## 5. Team Synergy: How We Handshake

We work like a relay team. Here is the baton pass:

1.  **Student A (Frontend/Logic):** Builds the **"Classroom."**
    *   *Desktop Action:* User writes code in CodeMirror editor, enters test input in stdin box.
    *   *System:* Checks keystroke velocity & focus. Sends code to Vercel serverless function → Judge0 API. If all test cases PASS → Generates a "Pass Signal."
    *   *Mobile Action:* Shows "You passed! Claim your badge" banner for students who completed the challenge on desktop.

2.  **Student B (Blockchain):** Runs the **"Printing Press."**
    *   *Action:* Takes the "Pass Signal" from Student A's logic.
    *   *Desktop:* User connects MetaMask wallet.
    *   *Mobile:* User connects via WalletConnect or MetaMask mobile.
    *   *System:* Checks for prior claims (balanceOf). Unlocks "Mint Badge" button. User clicks → Thirdweb gasless transaction → Badge appears in wallet.

3.  **Student C (Docs/QA):** Writes the **"History Book."**
    *   *Action:* Tries to cheat the system (Red Team) on both desktop and mobile.
    *   *Output:* Takes screenshots of the Badge on PolygonScan. Writes the story: *"See? We used Polygon to verify skills for $0 cost!"* Puts it in the slides.
    *   *Backup:* Records a demo video of the full flow as contingency.

---

## 6. MVP Scope (What We're Actually Building)

**IN SCOPE:**
- Student coding experience (desktop-optimized)
- Badge claiming (mobile-optimized)
- ONE hardcoded challenge (Java: Personalized Greeting)
- Basic anti-cheat (keystroke velocity + focus tracking)
- Lite Mode for low-end devices
- Blockchain credential (Soulbound Token)

**NOT IN SCOPE (Phase 2):**
- Professor dashboard
- Multiple challenges
- Advanced anti-cheat (proctoring)
- Real-time collaboration
