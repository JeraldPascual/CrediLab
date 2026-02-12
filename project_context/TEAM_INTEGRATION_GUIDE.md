# CrediLab Integration Roadmap

**Date:** February 12, 2026 — After Student A + Student B discussion
**Deadline:** March 5, 2026 (21 days)
**Branch:** master (web), mobile-app (mobile)

---

## ⚠️ Honest State of Things

**What Student A (Desktop Web App) actually has in code:**
- A React + Vite scaffold that renders "CrediLab. Learn to earn."
- A basic MetaMask connection scaffold in `web3/wallet.js` (connect, listen, get address)
- An empty Judge0 API route that returns 501
- All dependencies installed (ethers.js, Firebase, CodeMirror) but **none wired up**
- No Firebase Auth, no code editor, no challenges, no leaderboard, no credit system — **none of the documented features exist in code yet**

**What Student B (Mobile App) actually has:**
- Kotlin native Android app on `mobile-app` branch (14 commits)
- WalletConnect v2 working (MetaMask, Trust Wallet)
- CLB ERC-20 smart contract deployed on Sepolia (one-time minted 10,000 CLB)
- Balance display, Send/Receive screens, QR code scanner
- Deep-link support (`credilab://`)
- A central/general balance account holding 10,000 CLB displayed in the app

**Bottom line:** Student B's mobile app is functional. Student A's web app is a blank scaffold. The priority is building the web app core features FIRST, then integration.

---

## 🤝 What We Agreed On Today (Feb 12)

### The Architecture (from our discussion + the whiteboard diagram):

```
┌─────────────────────┐         ┌────────────────────┐
│   WEB APP            │         │   MOBILE APP        │
│   (Student A)        │         │   (Student B)       │
│                      │         │                     │
│  Firebase Auth ──┐   │         │   WalletConnect v2  │
│  (Google Sign-In)│   │         │   ↕                 │
│                  ↓   │         │   MetaMask          │
│  Firestore ──────────┼────────→│   (provides wallet  │
│  stores wallet   │   │ reads   │    address, sends,  │
│  address per user│   │         │    receives)        │
│                  │   │         │                     │
│  MetaMask ───────┘   │         │   Firestore SDK     │
│  (on first signup,   │         │   (reads/writes     │
│   provides wallet    │         │    wallet address,  │
│   address to store   │         │    connected to our │
│   in Firestore)      │         │    Firebase)        │
│                      │         │                     │
│  Solidity/Contract ──┼────────→│   CLB balance       │
│  (transfer CLB when  │         │   (from blockchain) │
│   challenge done)    │         │                     │
└─────────────────────┘         └────────────────────┘
              ↕                           ↕
      ┌──────────────────────────────────────┐
      │         Sepolia Blockchain            │
      │  CLB Token Contract (10,000 supply)   │
      │  System Wallet → Student Wallets      │
      └──────────────────────────────────────┘
```

### Key Decisions Made:

1. **No custodial wallet creation.** MetaMask does the heavy lifting — it gives us the wallet address. We just store it.

2. **On first web app signup:** Firebase Auth (Google) + MetaMask integration happens together. MetaMask provides the wallet address, which becomes a field in the user's Firestore record.

3. **Student B connects to our Firebase/Firestore** so auth and data is seamless across web and mobile.

4. **Solidity smart contract** handles the law — when a student finishes a challenge, the contract transfers CLB from the system wallet to the student's wallet address. The 10,000 CLB general balance decrements accordingly.

5. **No wallet address creation or querying on mobile.** Mobile just reads the same MetaMask wallet through WalletConnect. The wallet address already lives in Firestore from the web signup.

6. **The 10,000 CLB is minted once** and lives in a central system wallet. It's a transfer-based system, not a mint-on-demand system. When system wallet hits 0 → no more rewards.

7. **Leaderboard may need two listeners:** One from Solidity/blockchain for transaction tracking, and one from Firestore for accumulated credits and rankings.

---

## 🔄 The Complete User Flow

### Step 1: First Signup on Web App
1. Student visits CrediLab web app
2. Clicks "Sign in with Google" → Firebase Auth creates account
3. **MetaMask popup appears:** "Connect your wallet"
4. MetaMask provides wallet address (0xABC...)
5. Web app stores in Firestore:
   ```
   users/{uid} = {
     email: "student@gmail.com",
     walletAddress: "0xABC...",
     credits: 0,
     completedChallenges: [],
     linkedAt: timestamp
   }
   ```
6. Student is ready to earn CLB tokens

### Step 2: Student Completes a Challenge
1. Student opens Java challenge on desktop (CodeMirror editor)
2. Writes code → Submits → Judge0 executes and validates
3. Challenge passed! Backend triggers token transfer:
   - Read student's `walletAddress` from Firestore → 0xABC...
   - Call smart contract: `transfer(systemWallet, 0xABC..., 50 CLB)`
   - Blockchain executes → 50 CLB moves from system wallet to student
4. Update Firestore:
   - `users/{uid}/credits += 50`
   - `system/credit_pool/remaining -= 50`
   - Log transaction hash
5. Web app dashboard shows:
   - "You earned 50 CLB!"
   - "Global Pool: 9,950 / 10,000 CLB remaining"
   - Leaderboard updates

### Step 3: Student Opens Mobile App
1. Student opens CrediLab mobile app (Student B's app)
2. Connects same MetaMask wallet via WalletConnect → Gets 0xABC...
3. Mobile reads Firestore (connected to our Firebase) → Finds user record
4. Mobile queries blockchain for CLB balance of 0xABC... → Shows 50 CLB
5. Student sees their balance on mobile — **same wallet, same tokens!**

### Step 4: Mobile Send/Receive (Student B's Existing Feature)
1. Student can use "Send" to transfer CLB to another wallet
   - Enter recipient wallet address (or scan QR code)
   - Enter CLB amount
   - MetaMask signs the transaction
2. Student can use "Receive" to show their own QR code wallet address
3. The 10,000 CLB total in circulation doesn't change — just moves between wallets

---

## 💎 The 10,000 CLB Token System

### How It Works:
- Student B minted **10,000 CLB once** at contract deployment
- All 10,000 sit in a **central system wallet**
- Web app displays "10,000 CLB Remaining" on student dashboard
- When challenges are completed → `transfer()` moves tokens out
- **No new tokens are ever created** — fixed supply

### The Math:
| Challenge | Reward | Max Students |
|-----------|--------|-------------|
| Greeting (easy) | 50 CLB | 200 |
| Grade Calculator (hard) | 100 CLB | 100 |
| Both challenges done | 150 CLB | ~66 |

### What Happens When Pool Hits 0:
- Smart contract rejects transfer (insufficient balance)
- Web app shows: "All CLB tokens have been earned!"
- Leaderboard freezes — rankings are final
- Students keep their tokens forever

### The Monthly Reset Idea:
- Per docs: "10,000 CLB per month" was mentioned
- For hackathon demo: Just show ONE cycle (10,000 pool)
- Monthly reset would need redeploying or re-minting (post-hackathon concern)

---

## 🛠️ What Each Person Builds

### Student A (You) — Web App

**Priority 1: Core Features (Feb 12-19) — BUILD THE APP FIRST**

These don't exist in code yet. This is the real work:

| # | Task | What to Build |
|---|------|---------------|
| 1 | Firebase Auth | Google Sign-In, auth state, protected routes |
| 2 | MetaMask Connect | On signup, connect MetaMask, save wallet address to Firestore |
| 3 | Code Editor | CodeMirror 6 with Java syntax, stdin input field |
| 4 | Judge0 Integration | Wire up `api/execute-code.js`, handle submissions |
| 5 | Challenge System | 2 Java challenges, test case validation, completion tracking |
| 6 | Credit Display | Show student credits + global pool (10,000 remaining) |
| 7 | Leaderboard | Firestore query, ranked by credits, real-time |

**Priority 2: Blockchain Integration (Feb 19-26)**

| # | Task | What to Build |
|---|------|---------------|
| 8 | Smart Contract Call | Vercel function that calls `contract.transfer()` on challenge completion |
| 9 | Transaction Logging | Store tx hash, amount, timestamp in Firestore |
| 10 | Pool Balance Sync | Read system wallet balance from blockchain, display on dashboard |

**Priority 3: Anti-cheat (Feb 19-26)**

| # | Task | What to Build |
|---|------|---------------|
| 11 | Keystroke Tracking | Flag if typing >50 chars/sec |
| 12 | Focus Monitoring | 3 tab-switches = terminate session |
| 13 | Right-click Disable | Prevent context menu on editor |

---

### Student B — Mobile App + Smart Contract

**Already Done:** WalletConnect, Send/Receive, QR scanner, CLB contract, balance display

**New Tasks:**

| # | Task | What to Build |
|---|------|---------------|
| 1 | Add Firebase/Firestore SDK | Connect to our Firebase project (Firestore only, no Firebase Auth) |
| 2 | Read User Record | After WalletConnect, query Firestore for user with matching walletAddress |
| 3 | Display Linked Info | Show linked desktop account email, credits earned, challenge history |
| 4 | Global Pool Display | Read `system/credit_pool/remaining` from Firestore → Show on mobile too |

---

### Project Lead — Coordination

| # | Task | Details |
|---|------|---------|
| 1 | Share Firebase credentials | Give Student B the `google-services.json` for Android |
| 2 | Firestore security rules | Allow reads for wallet lookups, writes for wallet linking |
| 3 | Get contract details | Address, ABI, system wallet address + private key from Student B |
| 4 | Store system wallet key | Securely in Vercel environment variables (never in code) |

---

## 📅 Realistic Timeline

### Week 1: Feb 12-18 — Build the Web App Core
- **Student A:** Firebase Auth + MetaMask connect + Code Editor + Judge0
- **Student B:** Add Firestore SDK to mobile, read user records
- **Test:** Can a user sign up, connect MetaMask, and see their wallet in Firestore?

### Week 2: Feb 19-25 — Blockchain + Integration
- **Student A:** Smart contract calls, token transfers, leaderboard, anti-cheat
- **Student B:** Display linked info, global pool on mobile
- **Test:** Complete challenge → Tokens transfer → Mobile shows balance?

### Week 3: Feb 26-Mar 4 — Polish + Demo Prep
- Bug fixes, error handling, edge cases
- Demo video as backup
- Practice presentation
- **Freeze code by Mar 2** — only bug fixes after

### Mar 5 — DEMO DAY 🎉

---

## 🧪 Integration Test Checklist

**Test 1: Signup + Wallet Link**
- [ ] Sign in with Google on web → Account created in Firestore
- [ ] MetaMask popup → Connect → Wallet address saved to Firestore
- [ ] Open mobile → Connect same MetaMask → Finds Firestore record
- [ ] Mobile shows: Email, wallet address, 0 credits

**Test 2: Challenge + Token Transfer**
- [ ] Complete challenge on web → Judge0 validates → Pass
- [ ] Backend calls `contract.transfer(system → student, 50 CLB)`
- [ ] Firestore updates: credits = 50, remaining pool = 9,950
- [ ] Web shows: "50 CLB earned, 9,950 remaining"
- [ ] Mobile shows: 50 CLB balance (from blockchain query)
- [ ] Total: system wallet + all student wallets = 10,000 CLB

**Test 3: Leaderboard**
- [ ] Multiple test accounts complete challenges
- [ ] Leaderboard ranks correctly on web
- [ ] Mobile can read leaderboard from Firestore

**Test 4: Pool Exhaustion**
- [ ] Transfer all 10,000 CLB out of system wallet
- [ ] Next challenge completion → Transfer fails gracefully
- [ ] Web shows: "All tokens have been earned!"
- [ ] Mobile shows: "Pool: 0 / 10,000"

---

## ⚡ Edge Cases to Watch

### 1. MetaMask Not Installed
- **Problem:** Student visits web app without MetaMask browser extension
- **Solution:** Show message "Install MetaMask to connect your wallet" with download link
- **Fallback:** Allow challenge completion, defer wallet linking to later

### 2. Student Changes MetaMask Account
- **Problem:** Student switches accounts in MetaMask after signup
- **Solution:** Listen for `accountsChanged` event (already in `web3/wallet.js`), update Firestore
- **Risk:** If they switch to a DIFFERENT wallet, old wallet still has the tokens

### 3. Transaction Fails Mid-Transfer
- **Problem:** Challenge passed, but blockchain transfer fails (network error, gas issues)
- **Solution:** Save challenge completion to Firestore FIRST, then attempt transfer. If transfer fails, mark as "pending" and retry
- **Critical:** Never lose a student's earned credit

### 4. Same Wallet on Multiple Accounts
- **Problem:** Student connects same MetaMask wallet to two Google accounts
- **Solution:** Check Firestore — if walletAddress already exists on another account, block it
- **Message:** "This wallet is already linked to another account"

### 5. System Wallet Private Key Security
- **Problem:** System wallet private key needed server-side to sign transfers
- **Solution:** Store ONLY in Vercel environment variables. Never in code, never in Firestore
- **Risk:** If leaked, anyone can drain the 10,000 CLB pool

### 6. Sepolia Testnet Gas
- **Problem:** Transfer transactions need Sepolia ETH for gas fees
- **Solution:** Fund system wallet with Sepolia ETH from faucet (free)
- **Watch:** If system wallet runs out of ETH, transfers fail even though CLB tokens remain

### 7. Race Condition on Pool
- **Problem:** Two students complete challenges simultaneously, both try to transfer
- **Solution:** Use Firestore transaction (atomic decrement) BEFORE blockchain transfer
- **Flow:** Lock pool → Decrement → Transfer → Commit. If transfer fails → Rollback

### 8. Firestore vs Blockchain Mismatch
- **Problem:** Firestore says 9,950 remaining but blockchain says 9,900 (someone transferred outside the app)
- **Solution:** Blockchain is source of truth. Periodically sync Firestore pool balance from `balanceOf(systemWallet)`
- **For demo:** Not a concern since only our app transfers

### 9. Two Listeners for Leaderboard
- **From your discussion:** Solidity side for transaction tracking + Firestore side for rankings
- **Recommendation:** Keep it simple for hackathon. Use Firestore ONLY for leaderboard (update credits on challenge completion). Blockchain listening (event logs) is complex and not needed for demo
- **Post-hackathon:** Add blockchain event listener for audit trail

---

## 📋 What Student A Needs from Student B

| Item | Why | Priority |
|------|-----|----------|
| CLB contract address (Sepolia) | To call `transfer()` from web app | 🔴 Critical |
| Contract ABI (JSON) | To interact with contract via ethers.js | 🔴 Critical |
| System wallet address | To check remaining pool balance | 🔴 Critical |
| System wallet private key | To sign transfer transactions server-side | 🔴 Critical |
| Confirm: Standard ERC-20 `transfer()` function? | To know which method to call | 🟡 Important |
| Confirm: 18 decimals? | To format amounts correctly | 🟡 Important |
| `google-services.json` acceptance | Student B needs our Firebase config | 🟡 Important |

---

## 🚨 If Things Go Wrong

**Plan A (Full demo):** Web signup → MetaMask → Challenge → CLB transfer → Mobile shows balance
**Plan B (Partial):** Web works with challenges + MetaMask. Mobile shows wallet balance separately. Explain integration during presentation
**Plan C (Emergency):** Web shows challenge completion + mock CLB counter. Mobile app demo separately. Show architecture diagram

**Rule:** Never fake a blockchain transaction. Either it works or we explain it's in progress.

---

## 💬 Daily Check-in Format

```
What I did:
What I'm doing today:
Blocked by:
```

Discord: @peppamensity (Student A), @bivid (Student B)
