# Contributing to CrediLab

Welcome to the team! This guide will help you get set up and start contributing.

---

##  Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab
```

### 2. Install Dependencies
```bash
npm install
```

This installs:
- React + Vite (frontend framework)
- Tailwind CSS (styling)
- Firebase (auth + database)
- CodeMirror 6 (code editor)
- ethers.js (Ethereum/web3)
- React Router (routing)
- Other dependencies (see `package.json`)

### 3. Set Up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials: 
- **Judge0 API Key** (get from RapidAPI or Student A)
- **Firebase Config** (get from Firebase Console or Student A)
- **WalletConnect Project ID** (Student B — get from cloud.walletconnect.com)

** NEVER commit `.env` to Git** (it's already in `.gitignore`).

### 4. Start the Dev Server
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

##  Project Structure

```
CrediLab/
├── src/                # Student A — Frontend
│   ├── components/     # Reusable UI
│   ├── pages/          # Route views
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   └── data/           # Static data (challenges)
├── api/                # Student A — Backend (Vercel serverless)
│   └── execute-code.js # Judge0 proxy
├── web3/               # Student B — Blockchain & Wallet
│   ├── wallet/         # MetaMask + WalletConnect
│   ├── utils/          # Web3 helpers
│   └── contracts/      # Smart contracts (if needed)
└── project_context/    # Documentation
```

---

## Git Workflow

### Daily Workflow (Recommended)
```bash
# 1. Pull latest changes before starting work
git pull origin master

# 2. Make your changes (edit files)

# 3. Check what you changed
git status

# 4. Stage your changes
git add .

# 5. Commit with a clear message
git commit -m "feat: Add MetaMask connection logic"

# 6. Push to GitHub
git push origin master
```

### Commit Message Guidelines
Use clear, descriptive messages:
- ✅ `feat: Add Judge0 API proxy with rate limiting`
- ✅ `chore: Fix wallet disconnect bug on address change`
- ✅ `docs: Update README with setup instructions`
- ❌ `update` (too vague)
- ❌ `asdfasdf` (gibberish)

**Format:** `<action> <what you did>`
- Actions: `Add`, `Fix`, `Update`, `Remove`, `Refactor`, `Docs`

### Before Pushing (Checklist)
- [ ] Code runs without errors (`npm run dev`)
- [ ] No sensitive data in commits (API keys, passwords)
- [ ] Commit message is clear
- [ ] You've tested your changes

---

## 👥 Team Responsibilities

| Team Member | Folder Ownership | What to Work On |
|-------------|------------------|-----------------|
| **Student A (Full Stack)** | `/src`, `/api` | Frontend UI, Judge0 proxy, Firebase integration |
| **Student B (Blockchain)** | `/web3` | MetaMask, WalletConnect, credit system, leaderboard |
| **Student C (QA + Docs)** | `/project_context` | Testing, documentation, presentation materials |

**Rule:** Work primarily in your own folder. If you need to edit someone else's code, **coordinate first** (via group chat or quick call).

---

##  Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies (run once after cloning) |
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run build` | Build for production (creates `/dist` folder) |
| `npm run preview` | Preview production build locally |
| `git status` | Check what files you changed |
| `git add .` | Stage all changes for commit |
| `git commit -m "message"` | Commit changes with a message |
| `git push origin master` | Push commits to GitHub |
| `git pull origin master` | Pull latest changes from GitHub |
| `git log --oneline` | View recent commits |

---

## 🐛 Troubleshooting

### "Module not found" Error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 Already in Use
```bash
# Kill the existing process
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Firebase/Ethereum Errors
- Check `.env` is properly configured
- Verify API keys are correct
- Make sure you ran `npm install`

### Git Merge Conflicts
1. Talk to your teammate who edited the same file
2. Manually resolve conflicts in the file
3. `git add .` → `git commit` → `git push`

---

##  Documentation

All project documentation is in `/project_context/`:
- `PROJECT_OVERVIEW.md` — Mission, problem, solution
- `TECH_STACK.md` — Technologies we're using
- `TEAM_ROLES.md` — Who does what
- `MVP_ROADMAP.md` — Timeline and tasks
- `TECHNICAL_SPECIFICATIONS.md` — API specs, code examples
- `REALISTIC_MVP_SCOPE.md` — What we're building vs not building

**Read these before coding** — they contain all the answers.

---

##  Role-Specific Guides

### Student A (Full Stack)
See `/src` folders for starter code and examples. Focus on:
1. Firebase Auth (Google login)
2. CodeMirror editor integration
3. Judge0 API proxy (`/api/execute-code.js`)
4. UI components (buttons, cards, editor layout)

### Student B (Blockchain)
See `/web3/README.md` for detailed instructions. Focus on:
1. MetaMask wallet connection (desktop)
2. WalletConnect integration (mobile)
3. Credit system backend (Firestore)
4. Leaderboard (real-time)

### Student C (QA + Docs)
See `/project_context/` for all documentation. Focus on:
1. Testing the app (try to break it)
2. Writing the Project PDF
3. Creating the presentation deck
4. Recording demo video

---

##  Questions?

Ask in the group chat or tag the relevant team member:
- **Frontend/Backend issues** → Student A
- **Wallet/Blockchain issues** → Student B
- **Documentation/Testing issues** → Student C

