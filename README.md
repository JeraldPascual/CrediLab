# CrediLab

**Verified Programming Assessment Ledger**
SDG 4: Quality Education — BSU Hackathon 2025

---

## Overview

CrediLab is a gamified coding assessment platform where users solve Java programming challenges, earn CLB tokens (ERC-20 on Sepolia), and build verifiable on-chain credentials. The platform enforces academic integrity through anti-cheat mechanisms, fosters community participation with weekly SDG-themed tasks, and maintains a real-time leaderboard.

## Architecture

| Layer | Stack |
| --- | --- |
| **Frontend** | React 19 · Vite 7 · Tailwind CSS 4 · CodeMirror 6 |
| **Auth** | Firebase Auth (Google Sign-In + Email/Password) |
| **Backend** | Vercel Serverless Functions · Firebase Admin SDK |
| **Database** | Cloud Firestore (users, challenge sessions, weekly tasks) |
| **Blockchain** | CLB ERC-20 token on Sepolia · ethers.js 6 · MetaMask |
| **Code Execution** | Piston API (Judge0-compatible remote judge) |

## Features

- **40 Java Challenges** across Easy, Medium, and Hard tiers with graduated CLB rewards
- **Anti-Cheat System** — focus-loss tracking, copy-paste detection, automatic session termination
- **20 Achievement Badges** with tiered frames (Novice → Expert) and animated effects
- **CLB Token Economy** — on-chain minting & credential verification via ERC-20
- **Weekly Community Tasks** — SDG-themed prompts with voting and winner awards
- **Real-Time Leaderboard** with activity feed and student profiles
- **Category & Difficulty Filters** for challenge discovery
- **Dark/Light Theme** with responsive design

## Quick Start

```bash
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab
cp .env.example .env          # Fill in Firebase + Piston + contract keys
npm install
npm run dev                   # http://localhost:5173
```

> **Note:** Local development calls the Piston API directly from the browser — no Vercel deployment required. See [DEV-SETUP.md](DEV-SETUP.md) for details.

## API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/execute-code` | POST | Run user code via Piston (production only) |
| `/api/reward-student` | POST | Award credits + CLB for challenge completion |
| `/api/claim-tokens` | POST | Cash out credits to on-chain CLB |
| `/api/claim-pending-clb` | POST | Sync all pending CLB to the blockchain |
| `/api/weekly-tasks` | GET | Fetch the current week's SDG task |
| `/api/award-weekly-winner` | POST | Select and reward the weekly community winner |

## Project Structure

```
CrediLab/
├── src/
│   ├── components/     # Reusable UI (Sidebar, TierFrame, ProtectedRoute)
│   ├── pages/          # Route views (Dashboard, CodingPortal, Leaderboard)
│   ├── context/        # React context (Auth, Theme)
│   ├── hooks/          # Custom hooks (useAntiCheat)
│   ├── data/           # Challenges, badges, codec utilities
│   ├── lib/            # Firebase configuration
│   └── utils/          # Code execution helpers
├── api/                # Vercel serverless functions
├── web3/               # Blockchain integration (MetaMask, WalletConnect)
├── public/             # Static assets
└── project_context/    # Hackathon documentation
```

## Documentation

| Document | Description |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute — setup, git workflow, conventions |
| [DEV-SETUP.md](DEV-SETUP.md) | Development vs production environment details |
| [project_context/PROJECT_OVERVIEW.md](project_context/PROJECT_OVERVIEW.md) | Hackathon context and SDG alignment |
| [project_context/HACKATHON_RULES.md](project_context/HACKATHON_RULES.md) | Scoring rubric and deadlines |
| `.env.example` | All required environment variables |

## License

This project was built for the BSU Hackathon 2025. See [HACKATHON_RULES.md](project_context/HACKATHON_RULES.md) for usage terms.
