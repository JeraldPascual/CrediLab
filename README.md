# CrediLab

**Decentralized Coding Assessment Platform**
SDG 4: Quality Education — BulSU Hackathon 2026

## Architecture (Simplified - Feb 12, 2026)

**Desktop Web App:**
- React + Vite
- Firebase Auth (Google Sign-In)
- MetaMask integration (wallet address stored in Firestore)
- CodeMirror 6 code editor
- Judge0 API for code execution
- Vercel serverless functions for blockchain interaction

**Mobile App:**
- Kotlin native Android (separate `mobile-app` branch)
- WalletConnect v2 (MetaMask, Trust Wallet)
- Firestore SDK (reads user records by wallet address)
- CLB token balance display, Send/Receive

**Smart Contract:**
- CLB ERC-20 token on Sepolia
- 10,000 fixed supply
- Transfer-based reward system (system wallet → student wallets)

## Key Docs

- **TEAM_INTEGRATION_GUIDE.md** — Complete integration roadmap (Feb 12, 2026)
- **PROJECT_OVERVIEW.md** — Hackathon context and mission
- **TEAM_ROLES.md** — Who does what
- **TECH_STACK.md** — Technologies used

## Quick Start

```bash
npm install
npm run dev
```

**Note:** Core features not yet implemented. See TEAM_INTEGRATION_GUIDE.md for build plan.
