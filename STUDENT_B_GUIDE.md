# Student B — Mobile App + Smart Contract Guide

**Updated:** February 12, 2026
**Your Branch:** `mobile-app` (Kotlin native Android)

---

## ✅ What You've Already Built (Awesome!)

1. **Kotlin Native Android App** — 14 commits, fully functional
2. **WalletConnect v2** — MetaMask, Trust Wallet integration working
3. **CLB Smart Contract** — Deployed on Sepolia, 10,000 supply minted once
4. **Send/Receive Screens** — Transfer CLB between wallets
5. **QR Code Scanner** — Ready for wallet address scanning
6. **Balance Display** — Shows CLB balance from blockchain
7. **Central Balance Account** — 10,000 CLB displayed in app

**Your mobile app is ahead of the web app!** 🎉

---

## 🎯 What You Need to Add (Integration with Desktop)

### Task 1: Add Firebase/Firestore SDK

**Why:** Connect to the same Firebase project as the web app so you can read user records.

**What to do:**
1. Add dependency to `build.gradle`:
   ```gradle
   implementation 'com.google.firebase:firebase-firestore-ktx:24.10.0'
   ```

2. Get `google-services.json` from Student A (project lead will share)

3. Place it in `app/` folder

4. Initialize Firestore in your app:
   ```kotlin
   val db = Firebase.firestore
   ```

**Important:** You only need Firestore SDK, NOT Firebase Auth. WalletConnect handles your authentication.

---

### Task 2: Query Firestore by Wallet Address

**The Flow:**
1. Student connects MetaMask via WalletConnect → You get wallet address `0xABC...`
2. Query Firestore to find which desktop account owns this wallet:
   ```kotlin
   db.collection("users")
     .whereEqualTo("walletAddress", walletAddress)
     .get()
     .addOnSuccessListener { documents ->
       if (!documents.isEmpty) {
         val user = documents.first()
         val email = user.getString("email") ?: "Unknown"
         val credits = user.getLong("credits") ?: 0L

         // Show on screen:
         // "Linked to: email@gmail.com"
         // "Credits Earned: 50 CLB"
       } else {
         // Show: "Link this wallet on desktop first"
       }
     }
   ```

---

### Task 3: Display Linked Desktop Account Info

**Add a section in your app:**
- "Linked Desktop Account: user@gmail.com"
- "Credits Earned: 50 CLB"
- "Challenge History" (read from Firestore `completedChallenges` array)

**Also show:**
- Current blockchain balance (you already do this)
- Global pool remaining: Read `system/credit_pool/remaining` from Firestore

---

### Task 4: Optional — Handle Unlinking

Add a button "Unlink Desktop Account" that removes the wallet address from Firestore (or let web app handle this).

---

## 📦 What Student A Needs from You

| Item | Why |
|------|-----|
| CLB contract address (Sepolia) | To call `transfer()` from web app |
| Contract ABI (JSON file) | To interact with contract via ethers.js |
| System wallet address | The wallet holding all 10,000 CLB |
| System wallet private key | To sign transfer transactions (secure!) |
| Confirm: Standard ERC-20? | Web needs to know if it's standard `transfer()` |
| Confirm: 18 decimals? | To format CLB amounts correctly |

**Share these with Student A ASAP** — they're blocked without them.

---

## 🔄 The Complete Integration Flow

### Desktop (Student A):
1. Student signs in with Google
2. MetaMask connects → Wallet address saved to Firestore
3. Student completes challenge
4. Backend transfers CLB from system wallet to student's wallet
5. Firestore updated: credits earned, pool decremented

### Mobile (You):
1. Student opens your app
2. WalletConnect connects MetaMask (same wallet as desktop)
3. Your app queries Firestore: "Who owns this wallet?"
4. Shows: "Linked to user@gmail.com, 50 CLB earned"
5. Shows: Blockchain balance (already working)

**Same wallet, two platforms, seamless experience!**

---

## 🧪 Testing Checklist

- [ ] Add Firestore SDK, initialize successfully
- [ ] Connect MetaMask via WalletConnect
- [ ] Query Firestore by wallet address
- [ ] Display linked desktop account email
- [ ] Display credits earned from Firestore
- [ ] Display current balance from blockchain (already works)
- [ ] Handle "wallet not linked" case gracefully

---

## 📞 Contact

- Discord: @bivid (you) + @peppamensity (Student A)
- Main doc: `project_context/TEAM_INTEGRATION_GUIDE.md`

**You're doing great!** The mobile app is already functional. This integration is just a few queries to connect it to the web app.
