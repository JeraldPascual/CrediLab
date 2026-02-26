# Contributing to CrediLab

Thank you for your interest in contributing to CrediLab. This guide covers the setup process, project conventions, and git workflow.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab
```

### 2. Install Dependencies

```bash
npm install
```

This installs React 19, Vite 7, Tailwind CSS 4, Firebase, CodeMirror 6, ethers.js, React Router, and all other project dependencies.

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required credentials:

- **Firebase Config** — available from the Firebase Console
- **WalletConnect Project ID** — register at [cloud.walletconnect.com](https://cloud.walletconnect.com)

> **Important:** Never commit `.env` to version control. It is already listed in `.gitignore`.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
CrediLab/
├── src/                # Frontend application
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route views
│   ├── context/        # React context providers (Auth, Theme)
│   ├── hooks/          # Custom React hooks
│   ├── data/           # Challenges, badges, codec utilities
│   ├── lib/            # Firebase configuration
│   └── utils/          # Helper functions
├── api/                # Vercel serverless functions
├── web3/               # Blockchain & wallet integration
│   ├── wallet/         # MetaMask + WalletConnect connectors
│   ├── utils/          # Web3 helpers
│   └── contracts/      # Smart contract ABIs
└── project_context/    # Hackathon documentation
```

---

## Git Workflow

### Daily Workflow

```bash
# 1. Pull the latest changes before starting
git pull origin master

# 2. Make changes

# 3. Review what changed
git status

# 4. Stage changes
git add .

# 5. Commit with a descriptive message
git commit -m "feat: add category filter to challenge list"

# 6. Push to the remote
git push origin master
```

### Commit Message Format

Use clear, descriptive commit messages following this pattern:

```
<type>: <short description>
```

**Types:**
- `feat` — a new feature or enhancement
- `fix` — a bug fix
- `docs` — documentation changes
- `chore` — maintenance, refactoring, dependency updates
- `style` — formatting, whitespace, or visual changes

**Examples:**
- ✅ `feat: add run-length encoding challenge (#035)`
- ✅ `fix: resolve Early Bird badge timing issue`
- ✅ `docs: update README with new challenge count`
- ❌ `update` — too vague
- ❌ `stuff` — not descriptive

### Pre-Push Checklist

Before pushing, verify the following:

- [ ] The dev server starts without errors (`npm run dev`)
- [ ] The production build succeeds (`npm run build`)
- [ ] No sensitive data (API keys, passwords) is included in the commit
- [ ] The commit message clearly describes the change

---

## Common Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install all dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build (`/dist`) |
| `npm run preview` | Preview the production build locally |
| `git status` | Check the current working tree status |
| `git log --oneline` | View recent commit history |

---

## Troubleshooting

### "Module not found" Error

Delete `node_modules` and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 Already in Use

Either free the port or use an alternative:

```bash
npx kill-port 5173
# or
npm run dev -- --port 3000
```

### Firebase or Blockchain Errors

- Verify that `.env` is configured with valid credentials
- Ensure all dependencies are installed (`npm install`)
- Check the browser console for detailed error messages

### Git Merge Conflicts

1. Identify the conflicting file(s) in `git status`
2. Open each file and resolve the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Stage the resolved files: `git add .`
4. Commit the merge resolution: `git commit`

---

## Documentation

| Document | Description |
| --- | --- |
| `README.md` | Architecture, features, and API reference |
| `DEV-SETUP.md` | Development vs production environment details |
| `project_context/PROJECT_OVERVIEW.md` | Hackathon context and SDG alignment |
| `project_context/HACKATHON_RULES.md` | Scoring rubric and deadlines |
| `.env.example` | All required environment variables |

---

## Code of Conduct

Contributors are expected to maintain a respectful, inclusive environment. Focus on constructive feedback and collaborative problem-solving.

