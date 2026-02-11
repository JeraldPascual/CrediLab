# Web3 / Blockchain — Student B's Domain

##  Ownership
This folder belongs to **Student B (Blockchain Specialist)**. You have full autonomy to reorganize, rename, or restructure anything here.

##  Initial Structure
```
web3/
├── contracts/      # Solidity smart contracts (if deploying to Sepolia)
├── wallet/         # MetaMask + WalletConnect integration logic
├── utils/          # Web3 helpers (ethers.js wrappers, hash utilities)
└── README.md       # This file — your notes & decisions
```

##  Your Responsibilities
1. **WalletConnect** — Mobile wallet connection (QR code flow)
2. **MetaMask** — Desktop wallet connection (works with Student A's UI)
3. **Ethereum Sepolia** — On-chain credential storage OR smart contracts (your call)
4. **Credit System Backend** — Firestore credit pool logic (deduct from pool, award to user)
5. **Leaderboard** — Firestore real-time ranking by credits
6. **Credential Verification** — Store code hash + wallet address + timestamp

##  Key Decisions (TBD by You)
- [ ] **Approach:** On-chain hash storage vs smart contract vs hybrid (Firestore + Sepolia)?
- [ ] **Library:** `ethers.js` vs `web3.js`? (ethers.js is already in package.json as a starting point)
- [ ] **Contract:** Do we need a Solidity contract, or just wallet-based identity?
- [ ] **Folder structure:** Does this layout work for you, or do you want to reorganize?

##  Integration Points
- Student A will call your wallet functions from `/src` (e.g., `connectMetaMask()`, `onWalletChange()`)
- Credit/leaderboard utils may live in `/src/utils/` or here — your call on where the boundary is
- All on-chain interactions use **Sepolia testnet only** (zero gas costs, no real ETH)

##  Dependencies
- `ethers` — Ethereum interaction library (installed)
- `vite-plugin-node-polyfills` — Required for Buffer/crypto support in browser (installed)

##  Getting Started
1. Check `wallet/` for MetaMask + WalletConnect stubs
2. Check `utils/` for ethers.js helper stubs
3. Decide your approach and update this README
