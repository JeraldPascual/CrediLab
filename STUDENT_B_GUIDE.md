# Student B — Blockchain Specialist Guide

Welcome! This guide is specifically for you. You own the `/web3` folder and all blockchain-related features.

---

##  Your Responsibilities

1. **MetaMask Integration (Desktop)** — Wallet connection for desktop users
2. **WalletConnect Integration (Mobile)** — QR code wallet connection for mobile
3. **Credit System Backend** — Firestore logic for awarding credits
4. **Leaderboard** — Real-time ranking by credits earned
5. **Credential Verification** — Store code hash + wallet address + timestamp


and so on as depends on you.

---

##  Your Folder: `/web3`

```
web3/
├── wallet/
│   ├── metamask.js       # MetaMask connection (already started)
│   └── walletconnect.js  # WalletConnect (TODO by you)
├── utils/
│   └── helpers.js        # sha256, shortenAddress, etc. (started)
├── contracts/            # Solidity contracts (optional)
└── README.md             # Your decision notes
```

**You have full autonomy** over this folder. Reorganize, rename, or restructure as you see fit.

---

##  Getting Started (Day 1)

### 1. Read the Documentation
Start here (in order):
1. `/project_context/ONBOARDING_GUIDE.md` — Section 2 (your role)
2. `/project_context/TECH_STACK.md` — Wallet Integration section
3. `/project_context/TEAM_ROLES.md` — Your task list
4. `/web3/README.md` — Your folder's README

### 2. Set Up Your Environment
```bash
# Clone the repo (if you haven't)
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 3. Get WalletConnect Project ID (Free)
1. Go to https://cloud.walletconnect.com
2. Sign up (free, no credit card)
3. Create a new project
4. Copy the Project ID
5. Add to `.env.local`:
   ```
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### 4. Test MetaMask Connection
```bash
npm run dev
```

Open http://localhost:5173 and open your browser console (F12).

Try the existing MetaMask stub:
```javascript
// In browser console
import { connectMetaMask } from './web3/wallet/metamask.js';
const address = await connectMetaMask();
console.log('Connected:', address);
```

---

## Key Decisions You Need to Make



### Decision 1: Ethereum Integration Approach
You need to choose:

**Option A: Hybrid (Recommended for MVP)**
- Store credits + leaderboard in **Firestore** (fast, free, real-time)
- Store completion proofs (code hash + wallet) in **Firestore**
- Use Ethereum **only for wallet identity** (no on-chain transactions)
-  Pro: Simple, zero gas costs, fast
-  Con: Not fully on-chain (but judges will understand it's MVP)

**Option B: On-Chain Storage**
- Deploy a Solidity contract to Sepolia testnet
- Store completion hashes on-chain
-  Pro: Fully decentralized, impressive for judges
-  Con: Requires Solidity knowledge, testnet gas (free but faucet needed)

**Option C: Full Smart Contract**
- Build a credit system smart contract
- Store everything on-chain
-  Pro: Most impressive technically
-  Con: High complexity, risky for 19-day timeline

**My Recommendation:** Start with **Option A** (hybrid). If you finish early and want to impress judges, add Option B (store hashes on-chain as extra proof).

### Decision 2: WalletConnect Library
You need to choose a library:

**Option A: @web3modal/ethers (Recommended)**
- Official WalletConnect modal
- Works with ethers.js (already installed)
- Good docs: https://docs.walletconnect.com/web3modal/react/about

**Option B: @walletconnect/modal**
- Lower-level, more control
- More setup required


---


##  Integration with Student A

Student A will call your functions from their UI. Coordinate on these interfaces:

### MetaMask (Desktop)
```javascript
// Student A's usage in their Editor page:
import { connectMetaMask, onWalletChange } from '../../web3/wallet/metamask';

const handleConnect = async () => {
  const address = await connectMetaMask();
  setWalletAddress(address);
};

// Listen for wallet changes
onWalletChange((newAddress) => {
  if (!newAddress) {
    // User disconnected — reset state
    setIsPassed(false);
  }
});
```

### Credit System
```javascript
// Student A's usage after test passes:
import { awardCredits } from '../../web3/utils/credits'; // You'll create this

const handleTestPass = async () => {
  const { awarded, speedBonus } = await awardCredits(
    userId,
    challengeId,
    baseCredits,
    completionTimeMs
  );
  console.log(`Earned ${awarded} credits (bonus: ${speedBonus})`);
};
```

### Leaderboard
```javascript
// Student A's usage in Leaderboard page:
import { subscribeToLeaderboard } from '../../web3/utils/leaderboard'; // You'll create this

useEffect(() => {
  const unsubscribe = subscribeToLeaderboard((leaders) => {
    setLeaderboard(leaders);
  });
  return unsubscribe;
}, []);
```

**Coordinate:** Agree on function signatures before coding. Document them in `/web3/README.md`.

---

## 🧪 Testing Your Code

### Manual Testing
```bash
npm run dev
```

1. Open browser console (F12)
2. Test MetaMask connection
3. Check Firestore for data (Firebase Console)
4. Verify leaderboard updates in real-time

### QA with Student C
Student C will test:
- Wallet connection on desktop (Chrome, Firefox)
- WalletConnect on mobile (real phone)
- Credit earning flow end-to-end
- Leaderboard updates
- Wallet swap behavior

Report any bugs they find back to you.

---

## 📚 Resources

### WalletConnect
- Docs: https://docs.walletconnect.com
- Project Dashboard: https://cloud.walletconnect.com

### Ethers.js (Ethereum)
- Docs: https://docs.ethers.org/v6/
- Already installed: `npm list ethers`

### Firebase Firestore
- Docs: https://firebase.google.com/docs/firestore
- Console: https://console.firebase.google.com

### Sepolia Testnet
- Faucet (free ETH): https://sepoliafaucet.com
- Explorer: https://sepolia.etherscan.io

---

## ❓ Questions?

- **Wallet issues** → Check `/web3/README.md` or ask in group chat
- **Firestore issues** → Check Firebase docs or coordinate with Student A
- **General questions** → Ask Student A or check `/project_context/`

You've got this! 🚀
