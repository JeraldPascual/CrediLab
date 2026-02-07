# Risk Assessment & Competitive Strategy: CrediLab

## Part 1: Technical & Security Risks (The Red Team Audit)

We have conducted a "Red Team" audit of the architecture. Below are the identified vulnerabilities and our "Hackathon Patches" to defend against them.

### Risk 1: The "Second Device" & Client-Side Bypass
*   **The Vulnerability:** Users can bypass `document.hidden` (tab switching detection) by using a second device (phone) or injecting code via the browser console.
*   **The Hackathon Patch:**
    *   **Keystroke Velocity Check:** Flag users typing >50 chars/sec (impossible for humans).
    *   **Focus Tracking:** Use `window.onblur` to detect if the user clicks a notification or overlay.
    *   **Disable Right Click:** Adds friction for non-technical users.
*   **The Judge's Defense:** *"We recognize that client-side detection is never 100% foolproof without invasive proctoring software. Our MVP focuses on **deterring casual cheating** through heuristics like keystroke velocity and focus tracking. For production or high-stakes assessments, we would integrate professional proctoring software or manual review. The blockchain provides an immutable audit trail for post-event verification."*

### Risk 2: Judge0 API Rate Limiting & Availability
*   **The Vulnerability:** The public Judge0 API may return `429 Too Many Requests` if multiple users test simultaneously, or experience downtime during demo.
*   **The Hackathon Patch:**
    *   **Vercel Serverless Functions:** Route all requests through Vercel API routes to hide API keys, add request queuing, and implement caching.
    *   **Debounce Execution:** Enforce a 10-second cooldown between "Run" clicks.
    *   **Graceful Degradation:** If API fails, show "High Traffic - Retrying..." instead of a blank screen.
    *   **Backup Demo Video:** Pre-record full flow demonstration in case of API failure during live presentation.
*   **The Judge's Defense:** *"For this MVP, we are utilizing public Judge0 infrastructure with Vercel Serverless Functions as a secure proxy layer. This keeps costs zero (no credit card required) while maintaining API security. In production, we would self-host Judge0 Docker containers on cloud infrastructure (AWS/GCP) with load balancing to guarantee throughput and 99.9% uptime."*

### Risk 3: The "Gas Drain" Attack
*   **The Vulnerability:** A malicious user or bug could spam the "Mint" button, draining the team's relayer funds (MATIC) and preventing others from minting.
*   **The Hackathon Patch:**
    *   **Strict Claim Conditions:** Configure Thirdweb contract to allow "Max 1 Claim per Wallet".
    *   **UI State Locking:** Disable the mint button immediately after the first click (`isMinting` flag).
*   **The Judge's Defense:** *"We implement a multi-layered security approach. First, our Smart Contract enforces a strict 'One Badge Per Wallet' policy via Claim Conditions. Second, our frontend application checks the user's on-chain balance before even presenting the mint option, ensuring efficient gas usage."*

### Risk 4: The "God Mode" Injection (Client-Side Trust)
*   **The Vulnerability:** Since we verify code in the browser (Client-Side), a savvy user could use Chrome DevTools to force-enable the "Mint" button without passing the test (`God Mode`).
*   **The Hackathon Patch: "The Badge of Shame" (Audit Log)**
    *   **Strategy:** We do not block the button. Instead, we require the **Code Content** to be part of the Minting Transaction.
    *   **The Trap:** The Smart Contract stores a hash of the code (`SHA256(UserCode)`). If a hacker forces a mint with empty/bad code, their permanent blockchain record will point to "Garbage Code."
    *   **The Defense:** *"We assume the client can be compromised. That is why our system is designed for **Public Accountability**. If a user hacks the UI to mint a badge, they pay gas fees to create an immutable record of their own cheating. The badge is valid, but the metadata proves they are a fraud."*

### Risk 5: The "API Blackout" (Demo Failure)
*   **The Vulnerability:** The public Judge0 API might be down or slow during our 5-minute presentation.
*   **The Hackathon Patch: "Backup Demo Strategy"**
    *   **Primary Strategy:** Pre-record a complete demo video showing the full user flow as fallback.
    *   **Secondary Strategy:** Have 5 backup wallets with pre-funded MATIC for minting demonstrations.
    *   **Demo Setup:** Test the entire flow on presentation day morning to verify API availability.
    *   **Presentation Approach:** Lead with live demo, switch to video if technical issues arise while explaining: "This is a pre-recorded demonstration of our working prototype."

---

## Part 2: Rejected Architectures (Why we chose Client-Side)

### Option A: Direct Frontend to Judge0 Calls
*   **Concept:** Call Judge0 API directly from React frontend without any proxy layer.
*   **Why we rejected it:**
    *   **Security Risk:** API keys exposed in frontend code allow anyone to spam our endpoint.
    *   **No Rate Control:** Cannot implement server-side request queuing or user limits.
    *   **Conclusion:** We use Vercel Serverless Functions (API Routes) as a lightweight serverless proxy. This adds minimal latency (~200-500ms) while securing credentials and enabling request management. No credit card required unlike Firebase Cloud Functions.

### Option B: Self-Hosted Judge0 for MVP
*   **Concept:** Deploy our own Judge0 Docker instance on DigitalOcean/AWS for full control.
*   **Why we rejected it for MVP:**
    *   **Time Constraint:** Setting up Docker, security hardening, and server management takes 2-3 days minimum.
    *   **Complexity:** Requires VPS management, SSL certificates, firewall rules—too much for 1st-year students in 3 weeks.
    *   **Cost:** ~$10-20/month for VPS hosting during development.
    *   **Conclusion:** We document self-hosting as "Production Roadmap" but use public API + Firebase Functions for MVP to ship faster.

---

## Part 3: Execution Risks (Process Survival)

### Risk 6: Mobile Wallet UX Hell (Demo Failure)
*   **The Danger:** Trying to demo on a real phone often fails due to wallet app switching/crashing.
*   **The Workaround: "Desktop-First, Mobile-View Second"**
    *   **Devtools Demo:** Record the demo on a Laptop using Chrome DevTools set to "Pixel 5" dimensions.
    *   **Live Demo:** If live, say: *"We are showing this on a laptop for screen visibility, but the code is optimized for mobile."*

### Risk 7: Amoy Testnet Congestion
*   **The Danger:** Gas spikes or faucet limits prevent transactions during the demo.
*   **The Workaround: "The Faucet Stash"**
    *   **Task:** Claim MATIC daily into 5 different backup wallets. Do not rely on a single wallet.

---

## Part 3: Leveraging Our Strengths (How we win)

### Strength 1: The SBT Narrative (Innovation)
*   **Strategy:** Start the pitch with: *"How do we know a digital certificate wasn't just copy-pasted?"*
*   **Winning Move:** Show the "Metadata" of the SBT on PolygonScan. Point to the "Proof of Effort" hash. This technical depth impresses judges.

### Strength 2: "Lite Mode" (SDG Impact)
*   **Strategy:** Prove support for low-end devices visually.
*   **Winning Move:** In the UI, add a visible **[⚡ Lite Mode]** toggle. When clicked, switch to high-contrast B&W and remove images/syntax highlighting.
*   **Why this wins:** It is interactive proof of your commitment to SDG 4 (Digital Inclusion).

---

## Part 4: Technical Conflict Mitigation (Hidden Bugs)

We have identified critical technical conflicts between our tools. Here are the required patches.

### Conflict 1: The "Vite vs. Web3" Crash
*   **The Issue:** `Uncaught ReferenceError: Buffer is not defined`. Vite (Browser Native) does not support Node.js globals required by the Thirdweb/Ethers SDK.
*   **The Fix:** We **MUST** install and configure `vite-plugin-node-polyfills` in `vite.config.js` immediately upon project initialization.

### Conflict 2: The "Wallet Swap" Logic Exploit
*   **The Exploit:** A user passes the test with Wallet A, disconnects, connects Wallet B, and mints using the stale "Passed" state.
*   **The Fix (Strict Reset Hook):**
    ```javascript
    useEffect(() => {
       // If wallet address changes, instantly REVOKE the pass
       setIsPassed(false);
       setTestResults(null);
    }, [address]);
    ```

### Conflict 3: The "Dual Identity" Confusion
*   **The Issue:** User logs in with Google (Account A) but connects Metamask (Account B). Who gets the badge?
*   **The Policy:** The **Wallet Holder** (Account B) gets the badge. The Google Account (Account A) is only used for saving the "Audit Log" to Firestore. We accept this separation to preserve privacy.

### Conflict 4: CORS & Judge0 API
*   **The Issue:** Browser blocks direct requests to Judge0 API from `localhost` or production domain due to CORS restrictions.
*   **The Fix:** All Judge0 requests go through Vercel Serverless Functions (`/api/execute-code`). Vercel handles server-to-server communication, bypassing CORS entirely. No browser extensions or proxies needed.

---

## Part 5: Is CrediLab Better Than Common Themes?

**Yes.** Here is why CrediLab stands out.

| Common Hackathon Idea | Why it often fails | Why CrediLab is better |
| :--- | :--- | :--- |
| **"Trash Collection App"** | Requires physical logistics (trucks/bins). Hard to demo. | **Purely Digital:** It works instantly. No physical dependencies. |
| **"Donation Crowdfunding"** | Boring. Hundreds exist. Blockchain used only for "payments". | **Novel Use Case:** Uses Blockchain for *Identity & Reputation* (Web3 Identity). |
| **"LMS / Classroom"** | Too big. Teams try to build Moodle and fail. | **Micro-Scope:** We only do *Verification*. Focused, finishable MVP. |
