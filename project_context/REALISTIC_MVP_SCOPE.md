# Realistic MVP Scope: What We WILL and WON'T Build

**Current Date:** Feb 7, 2026
**Deadline:** Feb 26, 2026 (19 days)
**Team:** 3 first-year BSIT students

---

## WHAT WE WILL BUILD (Core MVP)

### 1. Student Coding Experience (Desktop-Optimized)
**User Flow:**
1. Student visits app on desktop/laptop
2. Logs in with Google (Firebase Auth)
3. Sees TWO professor-style Java challenges with user input
4. Writes code in CodeMirror editor
5. Enters test input in stdin box
6. Clicks "Run Code" → sees output
7. If all test cases pass → credits are awarded from the global pool
8. Student sees updated credit balance and leaderboard position
9. Student clicks "Connect Wallet" (MetaMask on desktop) to link credentials
10. Completion proof (code hash + timestamp) stored in Firestore linked to wallet

**Desktop Features:**
- Full CodeMirror editor with syntax highlighting
- Keyboard shortcuts (Ctrl+Enter to run)
- Multi-line input support for stdin
- Detailed error messages with line numbers
- Anti-cheat: keystroke velocity + focus tracking
- Lite Mode toggle (for low-end laptops)
- Global credit pool display (remaining credits out of 10,000)
- Live leaderboard

### 2. Mobile Credit & Credential View (Mobile-Optimized)
**User Flow:**
1. Student completes challenge on desktop
2. Student opens app on mobile phone
3. Logs in with same Google account
4. Sees "You earned [X] credits!" banner and leaderboard position
5. Clicks "Connect Wallet" → WalletConnect
6. Wallet address linked to credentials in Firestore
7. Shareable achievement on social media

**Mobile Features:**
- Simplified UI (no code editor)
- Large touch-friendly buttons
- QR code for easy wallet connect (WalletConnect)
- Success screen with credits earned + leaderboard rank
- "Share on Twitter" button with pre-filled text

### 3. Two Professor-Style Java Challenges
**Challenge 1: Personalized Greeting**
- **Description:** Read a name from input, print "Hello, [name]! Welcome to CrediLab."
- **Language:** Java (boilerplate provided)
- **Test Cases:** 3 inputs with expected outputs
- **Credits:** 50 credits
- **Difficulty:** Beginner

**Challenge 2: Student Grade Calculator**
- **Description:** Read a name and 3 exam scores, calculate average, print name + average + letter grade.
- **Language:** Java (boilerplate provided)
- **Test Cases:** 3 inputs with expected outputs
- **Credits:** 100 credits
- **Difficulty:** Intermediate

**Why Two Challenges?**
- Proves the concept works with user input/interaction
- Shows Judge0 + CodeMirror integration with Scanner
- Both are professor-style problems students actually face in class
- Demonstrates the credit system with different reward amounts

### 4. Anti-Cheat (Basic Deterrence)
- Keystroke velocity tracker (flags >50 chars/sec)
- Focus loss counter (warns after 3 violations)
- Right-click disabled in editor
- Logged to Firestore for audit trail

**Important:** We acknowledge this is deterrence, not security. Production would need proctoring.

### 5. Credit Reward System & Leaderboard
- Fixed pool of 10,000 credits (= ₱10,000 PHP for student understanding)
- Credits earned by completing challenges correctly and quickly
- Speed bonus: Under 5 minutes = +20% bonus credits
- Global credit pool displayed to all users (creates urgency)
- Leaderboard: Ranked by most credits earned (no material benefits)
- Completion proof stored in Firestore with code hash + wallet address
- Wallet integration: MetaMask (desktop) + WalletConnect (mobile)

### 6. Lite Mode (SDG Accessibility)
- Auto-detects low-end devices (CPU cores <= 2)
- Manual toggle available
- Disables syntax highlighting
- Uses system fonts, high-contrast colors
- 40% smaller bundle size

---

##  WHAT WE WON'T BUILD (Post-MVP)

### 1. Professor Dashboard
**NOT INCLUDED:**
- Challenge creation interface
- Student submission tracking
- Grading system
- Class management
- Assignment scheduling

**Why Not?**
- Requires 5-7 extra days of development
- Needs complex role-based auth
- Not essential for proving the concept
- Can be shown as "future work" in presentation

**Pitch Strategy:**
- Show architecture diagram with "Professor Portal (Phase 2)"
- Explain: "Firebase role-based auth makes this straightforward to add"
- Emphasize: "Our MVP focuses on proving the student experience works"

### 2. Large Challenge Library
**NOT INCLUDED:**
- Challenge creation interface
- Difficulty levels beyond easy/intermediate
- Multiple programming languages (only Java for MVP)
- Custom test case creation by professors

**Why Not?**
- TWO working challenges prove the system works
- More challenges increase testing complexity
- Risk of bugs during demo

**Pitch Strategy:**
- Say: "We included two professor-style challenges to demonstrate the full user input flow"
- Show code snippet proving how easy it is to add more challenges
- Explain: "It's just a JSON array—scaling is trivial"

### 3. Advanced Anti-Cheat
**NOT INCLUDED:**
- Webcam proctoring
- AI-based code plagiarism detection
- Network traffic monitoring
- Screenshot prevention

**Why Not?**
- Requires specialized SDKs (invasive, slow)
- May violate privacy (bad for SDG pitch)
- Our heuristics are enough for MVP

**Pitch Strategy:**
- Be honest: "Client-side security is deterrence, not Fort Knox"
- Emphasize: "Blockchain creates audit trail for post-event review"
- Explain: "Production would integrate professional proctoring APIs"

### 4. Real-Time Collaboration
**NOT INCLUDED:**
- Pair programming
- Code sharing
- Live chat

**Why Not?**
- Requires WebSocket infrastructure
- Increases complexity significantly
- Not core to the value proposition

### 5. Analytics Dashboard
**NOT INCLUDED:**
- Code execution statistics
- User progress tracking
- Performance metrics
- A/B testing

**Why Not?**
- Not essential for demo
- Easy to add later with Firebase Analytics

---

##  DEMO FLOW (What Judges Will See)

### Desktop Demo (3 minutes)
1. **Login:** Google sign-in (pre-setup account)
2. **Challenge Screen:** Show the two challenge options
3. **Code:** Type solution in editor (pre-practiced)
4. **Execute:** Run code, show output passing all tests
5. **Credits:** Show credits awarded + speed bonus
6. **Leaderboard:** Show updated leaderboard position
7. **Wallet:** Connect MetaMask, show wallet-linked credentials
8. **Result:** Show completion proof in Firestore

### Mobile Demo (1 minute)
1. **Login:** Same Google account on phone
2. **Credit Screen:** Show "You earned [X] credits!" and leaderboard rank
3. **Wallet:** Connect via WalletConnect
4. **Credentials:** Show wallet-linked completion proof
5. **Share:** Show Twitter share button

### Backup Plan
- Pre-recorded video of above flow
- Static screenshots if API fails
- Narration with technical depth

---

## 📊 Feasibility Score

| Feature | Days Needed | Confidence | Risk Level |
|---------|-------------|------------|------------|
| Firebase Auth | 1 day | ✅ High | Low |
| Code Editor (CodeMirror) | 2 days | ✅ High | Low |
| Vercel API (Judge0 proxy) | 2 days | ⚠️ Medium | Medium |
| Test Verification | 1 day | ✅ High | Low |
| Lite Mode | 1 day | ✅ High | Low |
| Credit System + Leaderboard | 2 days | ✅ High | Low |
| Wallet Integration (MetaMask + WalletConnect) | 2 days | ⚠️ Medium | Medium |
| Mobile Credit/Credential View | 2 days | ⚠️ Medium | Medium |
| Anti-Cheat Hooks | 2 days | ✅ High | Low |
| Documentation | 3 days | ✅ High | Low |
| Testing & Polish | 3 days | ✅ High | Low |
| **TOTAL** | **19 days** | **Doable** | **Manageable** |

**Buffer:** 0 days (tight but achievable if no one gets sick)

---

##  Critical Success Factors

### Must-Haves for Checkpoint 1 (Feb 16)
- [ ] Firebase login works
- [ ] Code editor shows and accepts input
- [ ] "Run Code" button calls Vercel API
- [ ] Output displays on screen
- [ ] Responsive layout on desktop

### Must-Haves for Checkpoint 2 (Feb 23)
- [ ] Test case verification works for both challenges
- [ ] Credit earning flow completes end-to-end
- [ ] Leaderboard displays and updates
- [ ] Wallet connect works (MetaMask desktop, WalletConnect mobile)
- [ ] Anti-cheat hooks log to Firestore
- [ ] Mobile credit/credential view functional

### Must-Haves for Final Submission (Feb 26)
- [ ] All bugs fixed
- [ ] Project PDF complete
- [ ] Presentation deck finalized
- [ ] Backup demo video recorded
- [ ] Code commented and clean

---

##  Presentation Strategy

### Opening (30 seconds)
"Imagine a student in a remote area who learns to code on a cheap phone but has no college degree. How do they prove they can code? That's the problem CrediLab solves."

### Problem Statement (45 seconds)
- Traditional certifications cost hundreds of dollars
- Resumes can be faked
- Most coding platforms require high-end devices
- **SDG 4:** We need to democratize access to skill verification

### Solution Demo (3 minutes)
- Live demo of student flow (desktop coding, credit earning, leaderboard)
- Highlight wallet-linked credentials and completion proofs
- Show Lite Mode toggle for low-end devices

### Technical Depth (1 minute)
- Explain Vercel serverless proxy securing API
- Show anti-cheat heuristics
- Explain credit system encouraging learning speed
- Show wallet-linked credential verification

### Impact & Roadmap (45 seconds)
- **Impact:** Free, accessible, gamified skill verification for students
- **Roadmap:** Professor dashboard, more challenges, proctoring integration
- **Ask:** "We believe every student deserves a fair chance to prove their skills. Thank you."

---

## 🎓 What Judges Will Value

1. **Working Demo** (40%) - Does it actually work?
2. **SDG Alignment** (30%) - Clear connection to Quality Education
3. **Technical Innovation** (20%) - Credit system + wallet credentials + serverless architecture
4. **Feasibility** (10%) - Can this scale? Is it sustainable?

**Your Strengths:**
- ✅ Fully functional student experience
- ✅ Clear SDG 4 story (digital inclusion)
- ✅ Modern, zero-cost tech stack (no paid subscriptions or real money needed)
- ✅ Honest about limitations (deterrence vs security)

**Weaknesses to Address:**
- ⚠️ No professor dashboard (explain as "Phase 2")
- ⚠️ Only two challenges (explain as "professor-style proof of concept")
- ⚠️ Anti-cheat is basic (explain as "heuristic deterrence")

---

## Final Verdict: **GO FOR IT** ✅

This scope is **realistic, doable, and winnable** for your timeline and skill level. Focus on shipping a polished student experience, be honest about what's missing, and emphasize your vision for the future. Good luck!
