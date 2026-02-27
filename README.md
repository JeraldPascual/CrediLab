# CrediLab

**Verified Programming Assessment Ledger**
BulSU Hackathon 2026 — SDG 4: Quality Education

---

## Overview

CrediLab is a decentralized coding assessment platform where students solve Java programming challenges, earn CLB tokens (ERC-20 on the Ethereum Sepolia testnet), and build verifiable on-chain credentials. The platform is built around three principles: academic integrity through behavioral anti-cheat monitoring, community-driven peer validation via weekly SDG tasks, and transparent skill verification through blockchain-linked credentials.

Traditional certifications are expensive, static, and easy to falsify. CrediLab replaces paper credentials with tamper-proof, wallet-linked proof of competence — accessible on any device, verifiable by anyone, and earned through actual code execution rather than self-declaration.

---

## SDG Alignment

**Primary: SDG 4 — Quality Education**
Target 4.4 specifically: increase the number of youth with relevant technical and vocational skills for employment and entrepreneurship. CrediLab provides free, accessible skill verification for students on low-end devices optimized for 3G networks.

**Secondary: SDG 17 — Partnerships for the Goals**
The community feed, peer voting, and weekly SDG-themed tasks embed cross-SDG awareness directly into the learning experience. Students do not just code — they engage with real-world sustainability challenges (SDG 13, 15, 9, 4) as part of their weekly coursework.

---

## Architecture

| Layer | Stack |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, CodeMirror 6 |
| Authentication | Firebase Auth (Google Sign-In and Email/Password) |
| Backend | Vercel Serverless Functions, Firebase Admin SDK |
| Database | Cloud Firestore |
| Blockchain | CLB ERC-20 token on Sepolia testnet, ethers.js 6, MetaMask |
| Code Execution | Piston API (sandboxed remote judge, Docker-isolated) |
| Mobile | Android companion app (Kotlin), shared Firebase backend |

---

## Features

- Java challenges across Easy, Medium, and Hard tiers with graduated CLB rewards
- Anti-cheat system with focus-loss tracking, copy-paste detection, and automatic session termination
- 20 achievement badges across 5 rarity tiers with animated skill-tier frames (Novice through Expert Engineer)
- CLB token economy — on-chain minting, wallet-linked credentials, and blockchain-verifiable certificates
- Weekly SDG community tasks with Reddit-style upvote/downvote validation and an automated weekly winner selection
- Hall of Fame tab showing past weekly winners with their tier frames and vote scores
- Real-time leaderboard with hover profile cards, badge display, and tier progression
- Downloadable PDF certificates with SHA-256 verification hashes
- Responsive dark/light theme, optimized for mobile and low-bandwidth connections

---

## Quick Start

```bash
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab
cp .env.example .env
npm install
npm run dev
```

Local development uses the Piston API directly from the browser. No Vercel deployment is required for local testing. See [DEV-SETUP.md](DEV-SETUP.md) for full environment setup instructions.

---

## API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/execute-code` | POST | Run user code via Piston (production proxy) |
| `/api/reward-student` | POST | Award CLB credits for challenge completion |
| `/api/claim-tokens` | POST | Transfer Firestore credits to on-chain CLB |
| `/api/claim-pending-clb` | POST | Sync all pending CLB transfers to the blockchain |
| `/api/weekly-tasks` | GET / POST | Fetch or seed the current week's SDG task |
| `/api/award-weekly-winner` | POST | Select and reward the top-voted community submission |
| `/api/replenish-pool` | POST | Admin endpoint to top up the shared CLB credit pool |

The weekly winner endpoint is also triggered automatically each Sunday at 18:00 UTC via a Vercel cron job. It selects the highest-netScore community-approved submission for the current ISO week and transfers CLB on-chain if a wallet is connected. The operation is idempotent — running it twice on the same week will not double-award.

---

## Project Structure

```
CrediLab/
├── src/
│   ├── components/     # Reusable UI: Sidebar, TierFrame, UserProfileCard, ProtectedRoute
│   ├── pages/          # Route views: Dashboard, CodingPortal, CommunityFeed, Leaderboard
│   ├── context/        # React context: AuthContext, ThemeContext
│   ├── hooks/          # Custom hooks: useAntiCheat
│   ├── data/           # Challenges, badges, weekly tasks, codec utilities
│   ├── lib/            # Firebase client configuration
│   └── utils/          # Code execution helpers
├── api/                # Vercel serverless functions
├── web3/               # Blockchain integration: MetaMask, WalletConnect, helpers
├── public/             # Static assets
└── project_context/    # Hackathon documentation and rules
```

---

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_FIREBASE_*` | Firebase client config (API key, project ID, etc.) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin SDK credentials (JSON stringified) |
| `ADMIN_SECRET` | Auth token for manual admin API calls |
| `CRON_SECRET` | Auth token used by Vercel cron for the weekly winner job |
| `SYSTEM_WALLET_PRIVATE_KEY` | Platform wallet private key for on-chain CLB transfers |
| `VITE_CLB_CONTRACT_ADDRESS` | Deployed CLB ERC-20 contract address on Sepolia |
| `VITE_SEPOLIA_RPC_URL` | Sepolia RPC endpoint |

See `.env.example` for the full list with descriptions.

---

## Documentation

| Document | Description |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Git workflow, code conventions, and contribution process |
| [DEV-SETUP.md](DEV-SETUP.md) | Local vs production environment setup details |
| [project_context/HACKATHON_RULES.md](project_context/HACKATHON_RULES.md) | BSU Hackathon 2026 scoring rubric, timeline, and code of conduct |

---

## Competitive Context

The following projects are competing in the same BSU Hackathon 2026. This section clarifies where CrediLab differs and why those differences are relevant to the judging rubric.

**NEXUS — Integrated SDG Impact and Policy Coherence Platform**
NEXUS targets policy analysts and institutional stakeholders — it maps and monitors SDG alignment at the governance level. CrediLab operates at the individual student level, producing the skilled workforce that policies like NEXUS are trying to cultivate. They are not competing for the same user or solving the same problem; they exist at different layers of the same system. Where NEXUS tracks whether a nation is meeting SDG 4, CrediLab is a tool for actually meeting it.

**Traba-WHERE**
Traba-WHERE appears to be a job discovery or LinkedIn-style professional network. Job platforms depend on self-reported credentials — users declare their own skills. CrediLab is what makes those declarations trustworthy. A developer profile on Traba-WHERE that links to a CrediLab certificate carries verifiable, blockchain-anchored proof. CrediLab is not a competitor to job platforms; it is the verification layer they are missing.

**BrailleVision, UniWell, OnQueue, B.A.L.I.K., AlertBarangay, From Confusion to Clarity**
These address SDGs 3, 10, 11, and 16 — health, accessibility, public safety, and special needs. They are valuable but operate in entirely different SDG lanes. There is no functional or conceptual overlap with CrediLab's domain of skill certification and education.

**HabiTap, BayBAYAN**
Habit tracking and cultural literacy tools. Both involve gamification, but neither produces a credential that exists outside the platform or has any value to an employer or institution. The distinction between gamified engagement and verifiable certification is the core differentiator.

**Veritascan, Community Digital Reporting System**
Target misinformation and civic reporting — SDG 16 domain. No overlap.

**Where CrediLab has a clear edge across the full field:**
No other project in this competition produces a credential that is independently verifiable outside the platform itself. A certificate from most systems is only meaningful if the issuing platform is trusted and operational. A CrediLab certificate has a SHA-256 hash stored in Firestore and a CLB token on a public blockchain — it is verifiable by anyone, against an immutable record, regardless of whether CrediLab's servers are running. That property — independently auditable proof of competence — is unique in this field and directly addresses SDG 4's target of recognized, transferable skills.

---

## Naming Disclosure

This project was independently developed for the BSU Hackathon 2026. The name "CrediLab" was chosen by this team to reflect credential-based learning and was selected without knowledge of any prior use.

It has since come to our attention that an unrelated organization in Malaysia operates under the same name in a different domain (financial services and credit accessibility). This team has no affiliation with, knowledge of, or derived work from that entity. The name was independently conceived, and the concept, architecture, codebase, and application domain are entirely original.

This disclosure is made voluntarily in accordance with Sections VIII and XIV of the BSU Hackathon rules, which require originality, transparency about pre-existing resources, and avoidance of plagiarism. The name overlap is coincidental. Should the organizers require it, this team is prepared to rename the project for any post-hackathon continuation without affecting the substance of the submission.

---

## License

Built for the BulSU Hackathon 2026. See [HACKATHON_RULES.md](project_context/HACKATHON_RULES.md) for contest terms and code of conduct.
Copyright 2026 — Jerald Pascual and contributors.
