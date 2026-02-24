# CrediLab

**Verified Programming Assessment Ledger**
SDG 4: Quality Education — BSU Hackathon 2026

## What Is CrediLab?

A gamified coding assessment platform where students solve programming challenges, earn CLB tokens (ERC-20 on Sepolia), and build verifiable on-chain credentials. Anti-cheat enforcement, weekly community tasks, and a real-time leaderboard keep the ecosystem fair and engaging.

## Architecture

| Layer | Stack |
|---|---|
| **Frontend** | React 19 · Vite 7 · Tailwind CSS 4 · CodeMirror 6 |
| **Auth** | Firebase Auth (Google Sign-In) |
| **Backend** | Vercel Serverless Functions · Firebase Admin SDK |
| **Database** | Cloud Firestore (users, challenges, events, weekly tasks) |
| **Blockchain** | CLB ERC-20 token on Sepolia · ethers.js 6 · MetaMask |
| **Code Execution** | Piston API (self-hosted judge) |
| **Mobile** | Kotlin Android (separate repo/branch — Student B) |

## Features

- 20 programming challenges (Java) with graduated difficulty & credit rewards
- Anti-cheat system: focus-loss tracking, copy-paste detection, auto-termination
- CLB token minting & on-chain credential verification
- Weekly SDG-themed community tasks with voting & winner awards
- Real-time leaderboard, activity feed, student profiles
- Mobile quiz integration (easy/medium/hard) via REST API
- Dark/light theme with responsive design

## Quick Start

```bash
cp .env.example .env          # fill in Firebase + Piston + contract keys
npm install
npm run dev                   # http://localhost:5173
```

## API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/execute-code` | POST | Run student code via Piston |
| `/api/reward-student` | POST | Award credits + CLB for challenge/quiz completion |
| `/api/claim-tokens` | POST | Cash-out credits to on-chain CLB (user-specified amount) |
| `/api/claim-pending-clb` | POST | Sync all pending CLB to chain (profile page) |
| `/api/weekly-tasks` | GET | Fetch current week's SDG task |
| `/api/award-weekly-winner` | POST | Pick & reward the weekly community winner |

## Key Docs

- `project_context/PROJECT_OVERVIEW.md` — Hackathon context & SDG alignment
- `project_context/HACKATHON_RULES.md` — Scoring rubric & deadlines
- `CONTRIBUTING.md` — Git workflow & branch conventions
- `.env.example` — All required environment variables
