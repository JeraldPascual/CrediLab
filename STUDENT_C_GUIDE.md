# Student C — QA Specialist + Documentation Lead

Welcome! This guide outlines your dual role: ensuring quality through testing and keeping documentation accurate.

---

##  Your Responsibilities

### 1. Quality Assurance (Testing)
- **Manual Testing** — Test all features on desktop and mobile
- **Bug Reporting** — Document bugs clearly with steps to reproduce
- **Regression Testing** — Verify bug fixes don't break other features
- **User Flow Testing** — Ensure smooth end-to-end experience
- **Cross-Browser Testing** — Chrome, Firefox, Safari, mobile browsers
(Optional man)

### 2. Documentation Maintenance
- **Keep Documentation Current** — Update docs as features change
- **Review Commit Messages** — Ensure team follows conventions
- **Maintain Testing Logs** — Track test results and coverage
- **Write User Guides** — Create end-user documentation (if time allows)

---

##  Your Folders

### Primary: `/project_context`
All 11 documentation files:
- `LLM_WORKFLOW_CONTEXT.md` — AI workflow guidance
- `TECH_STACK.md` — Technology choices
- `TEAM_ROLES.md` — Role assignments
- `ONBOARDING_GUIDE.md` — Getting started
- `MVP_ROADMAP.md` — Development timeline
- `TECHNICAL_SPECIFICATIONS.md` — Feature specs

This files is not created but your job to update:

- `TESTING_STRATEGY.md` — Your testing plan
- `README_PROJECT_CONTEXT.md` — Folder overview
- `01_CORE_MVP_SPECS.md` — Core feature specs
- `02_TESTING_QA_DOCS.md` — Testing documentation
- `03_TEAM_WORKFLOW.md` — Team processes

### Secondary: Testing Logs (Create These)
```
tests/
├── manual/
│   ├── test-cases.md          # List of test scenarios
│   ├── bug-reports.md         # Bug tracking
│   └── regression-tests.md    # Regression checklist
└── results/
    └── test-results-log.md    # Test execution results
```

---

##  Getting Started (Day 1)

### 1. Read the Documentation (Priority Order)
1. `/project_context/ONBOARDING_GUIDE.md` — Section 3 (your role)
2. `/project_context/TESTING_STRATEGY.md` — Your testing plan (not created)
3. `/project_context/02_TESTING_QA_DOCS.md` — QA docs (not created)
4. `/project_context/TEAM_ROLES.md` — Your task list
5. `CONTRIBUTING.md` — Git workflow (so you can review commits and do installation for testing)

### 2. Set Up Your Environment
```bash
# Clone the repo
git clone https://github.com/JeraldPascual/CrediLab.git
cd CrediLab

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

**You'll need:**
- Judge0 API key (ask Student A)
- Firebase credentials (ask Student A)

### 3. Run the App Locally
```bash
npm run dev
```

Open http://localhost:5173 — you should see the CrediLab scaffold.

---

##  Your Testing Checklist

### Phase 1: Basic Functionality
Test as Student A builds features:

- [ ] **Home Page**
  - [ ] Logo loads correctly
  - [ ] Navigation links work
  - [ ] Responsive on mobile (iPhone, Android)

- [ ] **Authentication (Firebase)**
  - [ ] Sign up with email/password
  - [ ] Log in with existing account
  - [ ] Log out successfully
  - [ ] Error messages display correctly
  - [ ] Password reset flow works

- [ ] **Code Editor (CodeMirror)**
  - [ ] Editor loads and displays code
  - [ ] Java syntax highlighting works
  - [ ] Line numbers visible
  - [ ] Can type code without lag
  - [ ] Copy/paste works
  - [ ] Undo/redo works

### Phase 2: Core Features
- [ ] **Challenge Loading**
  - [ ] Challenge 1 (greeting-program) loads
  - [ ] Challenge 2 (grade-calculator) loads
  - [ ] Instructions display correctly
  - [ ] Input/output examples are clear

- [ ] **Code Execution (Judge0)**
  - [ ] Submit code button works
  - [ ] Loading state displays while running
  - [ ] Correct output displays (pass)
  - [ ] Error messages display (fail)
  - [ ] Compilation errors display correctly
  - [ ] Runtime errors display correctly

- [ ] **Anti-Cheat System**
  - [ ] Keystroke tracker works (console logs)
  - [ ] Copy/paste detection works
  - [ ] Focus tracker works (tab switches)
  - [ ] Integrity checks pass

- [ ] **Wallet Integration (Student B)**
  - [ ] MetaMask connection works (desktop)
  - [ ] WalletConnect works (mobile QR code)
  - [ ] Wallet address displays correctly
  - [ ] Wallet disconnect works
  - [ ] Switching wallets resets state

- [ ] **Credit System**
  - [ ] Credits awarded on test pass
  - [ ] Speed bonus applied correctly (<5 min = +20%)
  - [ ] Daily limit enforced (5 credits max)
  - [ ] Firestore updates correctly

- [ ] **Leaderboard**
  - [ ] Displays top users by credits
  - [ ] Updates in real-time
  - [ ] Tie-break by timestamp works
  - [ ] Current user highlighted

### Phase 3: Polish (Week 3)
- [ ] **Mobile Responsiveness**
  - [ ] All pages work on iPhone
  - [ ] All pages work on Android
  - [ ] Touch interactions work smoothly
  - [ ] No horizontal scrolling

- [ ] **Cross-Browser Testing**
  - [ ] Chrome (desktop + mobile)
  - [ ] Firefox (desktop)
  - [ ] Safari (desktop + iOS)
  - [ ] Edge (desktop)

- [ ] **Performance**
  - [ ] Page load time <3 seconds
  - [ ] No console errors
  - [ ] No memory leaks (long session test)

---

##  Bug Reporting Template

When you find a bug, document it clearly:

```markdown
## Bug Report #[number]

**Title:** [Short description]

**Severity:** [Critical/High/Medium/Low]

**Steps to Reproduce:**
1. Go to [page]
2. Click [button]
3. Enter [data]
4. Observe [unexpected behavior]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- Browser: [Chrome 120, Firefox 115, etc.]
- Device: [Desktop, iPhone 12, etc.]
- OS: [Windows 11, macOS 14, Android 13, etc.]

**Screenshots/Logs:**
[Attach if helpful]

**Assigned To:** [Student A or B]

**Status:** [Open/In Progress/Fixed/Closed]
```

Save bugs in `tests/manual/bug-reports.md`.

---

##  Documentation Maintenance

### Weekly Documentation Tasks

**Every Monday:**
1. Review last week's commits (`git log --oneline --since="1 week ago"`)
2. Check if any documentation needs updating
3. Update `MVP_ROADMAP.md` with progress

**Every Friday:**
1. Review test results from the week
2. Update `TESTING_STRATEGY.md` with new test cases
3. Update `TEAM_ROLES.md` if tasks changed

### Documentation Review Checklist
- [ ] All markdown files have proper headings
- [ ] Code examples are up-to-date
- [ ] Links are not broken
- [ ] Screenshots are current (if any)
- [ ] Commit message conventions followed

### How to Update Documentation
1. Create a branch: `git checkout -b docs/update-tech-stack`
2. Edit the file: `code project_context/TECH_STACK.md`
3. Commit: `git commit -m "docs: update Tailwind CSS version"`
4. Push: `git push origin docs/update-tech-stack`
5. (Optional) Create pull request for review

---

##  Testing Tools & Techniques

### Manual Testing
- **Browser DevTools** — Check console for errors (F12)
- **Network Tab** — Monitor API calls (Firebase, Judge0)
- **Mobile Emulation** — Test responsive design (Chrome DevTools)
- **Real Devices** — Test on your phone (WalletConnect)

### Things to Check
1. **Console Errors** — No red errors in browser console
2. **Network Failures** — API calls succeed (200 status)
3. **Memory Leaks** — Check Performance tab for leaks
4. **Firestore Data** — Verify data saved correctly (Firebase Console)

### Example Test Session
```bash
# 1. Start app
npm run dev

# 2. Open browser DevTools (F12)

# 3. Go through user flow:
# - Sign up → Log in → Load challenge → Write code → Submit → Check credits

# 4. Check console for errors
# 5. Check Network tab for failed requests
# 6. Check Firestore (Firebase Console) for data
```

---

##  Test Results Logging

Create `tests/results/test-results-log.md`:

```markdown
# Test Results Log

## Week 1 (Feb 11-16)

### Test Session 1 — Feb 12, 2025
**Tester:** Student C
**Duration:** 45 minutes
**Features Tested:** Authentication, Home Page

**Results:**
- ✅ Sign up works
- ✅ Log in works
- ❌ BUG #1: Password reset link broken (assigned to Student A)
- ✅ Home page responsive

**Overall:** 3/4 tests passed

---

## Week 2 (Feb 17-23)

### Test Session 2 — Feb 18, 2025
[Fill in as you test]
```

---

##  Collaboration with Team

### With Student A (Frontend/Backend)
- Test features as they're built
- Report bugs clearly with steps to reproduce
- Verify bug fixes work
- Test UI/UX on different screen sizes

### With Student B (Blockchain)
- Test wallet connections (MetaMask, WalletConnect)
- Verify credit system works correctly
- Test leaderboard updates in real-time
- Check wallet swap behavior

### Communication Tips
- Use descriptive bug titles: "MetaMask connection fails on Firefox"
- Attach screenshots when helpful
- Test on your own device first before reporting
- Retest after bug fixes and confirm

---

## Resources

### Testing
- Chrome DevTools Guide: https://developer.chrome.com/docs/devtools/
- Mobile Testing: Use Chrome DevTools Device Mode
- Firebase Console: https://console.firebase.google.com

### Documentation
- Markdown Guide: https://www.markdownguide.org
- VS Code Markdown Preview: Press `Ctrl+Shift+V` (Windows) or `Cmd+Shift+V` (Mac)

### Git
- Git Basics: https://git-scm.com/book/en/v2
- See `CONTRIBUTING.md` for team workflow

---

##  Daily Routine

### Morning (15 minutes)
1. Pull latest changes: `git pull origin main`
2. Install any new dependencies: `npm install`
3. Check team chat for new features to test

### Afternoon (1-2 hours)
1. Test new features from Student A and B
2. Document bugs in `bug-reports.md`
3. Update test results log

### Evening (15 minutes)
1. Review documentation for accuracy
2. Update `MVP_ROADMAP.md` if needed
3. Plan tomorrow's testing focus

---

##  Questions?

- **Testing questions** → Check `/project_context/TESTING_STRATEGY.md`
- **Documentation questions** → Check `/project_context/README_PROJECT_CONTEXT.md`
- **Git workflow** → Check `CONTRIBUTING.md`
- **General questions** → Ask Student A in group chat

You're the quality gatekeeper!
