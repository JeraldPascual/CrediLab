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

## 3. Minting Eligibility & Security
*Goal: Ensure integrity and prevent gas exhaustion.*
- **Logic:**
  `IF (TestCases == 100% AND CheatFlag == False AND WalletHasBadge == False) THEN Enable "Mint Badge" Button.`
- **Wallet State Guard (The "Swap" Fix):**
  - Logic: `ON (WalletAddressChange) -> FORCE RESET (TestResults = NULL, IsVerified = False).`
  - *Why:* Prevents a user from passing with Wallet A, switching to Wallet B, and minting.
- **Hash Verification (Anti-Spoofing):**
  - Before minting, generate `SHA256(UserCode + Timestamp)`.
  - Store this Hash + Score on-chain.
  - *Judge's Defense:* "If the score is fake, the hash proves the code was garbage."
- **Gas Protection:**
  - Check `balanceOf(UserAddress)` on the SBT contract.
  - If `> 0`, disable minting (enforced by Smart Contract Claim Conditions).

## 4. "Lite Mode" Toggle
*Goal: Support low-end devices (SDG 4).*
- **Logic:**
  `IF (LiteMode == True) THEN Disable SyntaxHighlighting, Remove Images, Use High-Contrast CSS.`
- **Auto-Detection:**
  `IF (navigator.hardwareConcurrency <= 2) THEN Auto-Enable LiteMode.`
