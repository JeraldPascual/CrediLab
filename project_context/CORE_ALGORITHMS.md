# Core Algorithms & Logic

## 1. Assessment Verification Engine (Remote Execution)
*Goal: Verify code securely and support multiple languages (Java, Python, C#).*
- **Process:**
- **Method:** **Judge0 API** via **Vercel Serverless Proxy** (Standard Input Injection).
  1. **Template Injection:** System auto-loads mandatory boilerplate (e.g., `public class Main`) into the editor so users focus only on logic.
  2. **User Input:** Student enters stdin values in a dedicated input textbox below the editor (for `Scanner` and similar input methods).
  3. Frontend sends code + stdin to **Vercel API Route** (`/api/execute-code`) which securely proxies to **Judge0 API**.
  4. Judge0 executes in Docker sandbox and returns Stdout/Stderr.
  5. Frontend compares `Stdout` vs `Expected Output` for each test case.
  6. If all test cases match -> `Verified = True`.

## 2. Anti-Cheat Heuristics (The "Red Team" Patches)
*Goal: Prevent sophisticated cheating while maintaining privacy.*
- **Keystroke Velocity Check:**
  - Logic: `Velocity = (CurrentCharCount - LastCharCount) / TimeDelta`
  - Trigger: If `Velocity > 50 chars/sec` -> Flag as "Suspicious Paste/Macro".
- **Focus & Visibility Tracking:**
  - Logic: Monitor `window.onblur` (Clicking outside) AND `document.visibilityState` (Tab switching).
  - Trigger: `LossOfFocusCount > 3` -> Terminate Assessment.
- **Context Menu Block:**
  - Logic: `document.addEventListener('contextmenu', event => event.preventDefault());`

## 3. Credit Reward System
*Goal: Motivate students through a shared credit pool that encourages speed and completion.*
- **Global Credit Pool:**
  - Fixed pool: 10,000 credits (displayed globally to all users).
  - Conversion: 1 credit = ₱1 PHP (for student understanding only, not real money).
  - Pool depletes as students earn credits, creating urgency.
- **Credit Earning Logic:**
  `IF (TestCases == 100% AND CheatFlag == False AND ChallengeNotAlreadyCompleted) THEN AwardCredits(amount).`
  - Amount per challenge: Determined by difficulty (e.g., 50 credits for easy, 100 for medium).
  - Speed Bonus: Faster completion = bonus credits (e.g., under 5 min = +20% bonus).
- **Wallet State Guard (The "Swap" Fix):**
  - Logic: `ON (WalletAddressChange) -> FORCE RESET (TestResults = NULL, IsVerified = False).`
  - *Why:* Prevents a user from passing with Wallet A, switching to Wallet B, and claiming credits.
- **Hash Verification (Anti-Spoofing):**
  - Before awarding credits, generate `SHA256(UserCode + Timestamp)`.
  - Store this Hash + Score in Firestore linked to wallet address.
  - *Defense:* "If the score is fake, the hash proves the code was garbage."
- **Duplicate Protection:**
  - Check Firestore: Has this user (by wallet or Google UID) already completed this challenge?
  - If yes, disable credit earning for that challenge.

## 4. Leaderboard
*Goal: Public ranking to motivate students (no material benefits).*
- **Logic:**
  - Rank all users by total credits earned (descending).
  - Display: Rank, Display Name, Credits Earned, Challenges Completed.
  - No prizes or benefits — purely for bragging rights and motivation.
  - Updated in real-time via Firestore listener.
  - Tie-breaking: Earlier completion timestamp wins.

## 5. "Lite Mode" Toggle
*Goal: Support low-end devices (SDG 4).*
- **Logic:**
  `IF (LiteMode == True) THEN Disable SyntaxHighlighting, Remove Images, Use High-Contrast CSS.`
- **Auto-Detection:**
  `IF (navigator.hardwareConcurrency <= 2) THEN Auto-Enable LiteMode.`
