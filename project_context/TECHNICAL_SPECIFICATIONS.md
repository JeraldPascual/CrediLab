# Technical Specifications: CrediLab MVP

## User Interface Design

### Code Editor Layout
```
+-----------------------------------+
|  [Lite Mode Toggle]   [Run Code]  |
+-----------------------------------+
| Code Editor (CodeMirror 6)        |
| - Java syntax highlighting        |
| - Line numbers                    |
| - Auto-closing brackets           |
+-----------------------------------+
| Input (stdin)                     |
| [Textbox for Scanner input]       |
+-----------------------------------+
| Output                            |
| stdout: [success output]          |
| stderr: [error messages]          |
| Status: ✓ Passed / ✗ Failed       |
+-----------------------------------+
```

### Lite Mode Specifications
- **Detection:** Auto-enable if `navigator.hardwareConcurrency <= 2` OR manual toggle
- **Changes:**
  - Disable CodeMirror syntax highlighting (plain monospace text)
  - Remove gradient backgrounds (solid colors only)
  - Use system fonts instead of custom web fonts
  - Disable animations and transitions
  - High contrast: Black text on white background
- **Performance Impact:**
  - Bundle size: 40% reduction (from ~500KB to ~300KB)
  - Memory usage: ~200MB less RAM consumption
  - Initial load: 30% faster on 3G networks

## API Integration Architecture

### Vercel Serverless Functions (Judge0 Proxy)
```javascript
// api/execute-code.js
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin (for auth verification)
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}

// Simple in-memory rate limiter (per-deployment)
const rateLimitMap = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify Firebase Auth token
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    // Rate limiting check (10 seconds between requests)
    const lastRequest = rateLimitMap.get(userId) || 0;
    if (Date.now() - lastRequest < 10000) {
      return res.status(429).json({ error: 'Please wait 10 seconds between requests' });
    }

    // Call Judge0 API
    const { code, languageId, stdin } = req.body;
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin
      })
    });

    // Update rate limit timestamp
    rateLimitMap.set(userId, Date.now());

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Execution error:', error);
    return res.status(500).json({ error: 'Failed to execute code' });
  }
}
```

### Frontend API Call
```javascript
// src/utils/judge0.js
import { getAuth } from 'firebase/auth';

export async function executeCode(code, languageId, stdin) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('You must be logged in to run code');
  }

  // Get Firebase ID token
  const token = await user.getIdToken();

  try {
    const response = await fetch('/api/execute-code', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, languageId, stdin })
    });

    if (response.status === 429) {
      throw new Error('Please wait 10 seconds between code executions');
    }

    if (!response.ok) {
      throw new Error('Failed to execute code');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Failed to execute code. Please try again.');
  }
}
```

## Test Case Implementation

### Two Professor-Style Java Problems (MVP)
```javascript
// src/data/challenges.js
export const challenges = [
  {
    id: 'greeting-program',
    title: 'Personalized Greeting',
    description: 'Write a Java program that reads a name from input and prints "Hello, [name]! Welcome to CrediLab."',
    credits: 50,
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here

    }
}`,
    testCases: [
      { stdin: 'Alice', expectedOutput: 'Hello, Alice! Welcome to CrediLab.' },
      { stdin: 'Bob', expectedOutput: 'Hello, Bob! Welcome to CrediLab.' },
      { stdin: 'Charlie', expectedOutput: 'Hello, Charlie! Welcome to CrediLab.' }
    ],
    languageId: 62 // Java (Judge0 language ID)
  },
  {
    id: 'grade-calculator',
    title: 'Student Grade Calculator',
    description: 'Write a Java program that reads a student name and 3 exam scores from input, calculates the average, and prints the name, average, and letter grade (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: below 60).',
    credits: 100,
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name, then 3 scores
        // Calculate average
        // Determine letter grade
        // Print: "[name]: Average = [avg], Grade = [letter]"

    }
}`,
    testCases: [
      { stdin: 'Juan\n85\n90\n95', expectedOutput: 'Juan: Average = 90.0, Grade = A' },
      { stdin: 'Maria\n70\n75\n80', expectedOutput: 'Maria: Average = 75.0, Grade = C' },
      { stdin: 'Pedro\n50\n55\n45', expectedOutput: 'Pedro: Average = 50.0, Grade = F' }
    ],
    languageId: 62
  }
];
```

### Verification Logic
```javascript
// src/utils/verifier.js
export function verifyOutput(actualOutput, expectedOutput) {
  // Trim whitespace and compare
  const actual = actualOutput.trim();
  const expected = expectedOutput.trim();
  return actual === expected;
}

export function verifyAllTestCases(results, challenge) {
  const passed = challenge.testCases.every((testCase, index) => {
    return verifyOutput(results[index].stdout, testCase.expectedOutput);
  });

  return {
    passed,
    totalTests: challenge.testCases.length,
    passedTests: results.filter((r, i) =>
      verifyOutput(r.stdout, challenge.testCases[i].expectedOutput)
    ).length
  };
}
```

## Anti-Cheat Implementation

### Keystroke Velocity Tracker
```javascript
// src/hooks/useKeystrokeTracker.js
export function useKeystrokeTracker() {
  const [suspicious, setSuspicious] = useState(false);
  const lastCharCount = useRef(0);
  const lastTimestamp = useRef(Date.now());

  const trackKeystroke = (currentCharCount) => {
    const now = Date.now();
    const timeDelta = (now - lastTimestamp.current) / 1000; // seconds
    const charDelta = currentCharCount - lastCharCount.current;

    if (timeDelta > 0) {
      const velocity = charDelta / timeDelta;

      // Flag if typing faster than 50 chars/sec
      if (velocity > 50 && charDelta > 10) {
        setSuspicious(true);
      }
    }

    lastCharCount.current = currentCharCount;
    lastTimestamp.current = now;
  };

  return { suspicious, trackKeystroke };
}
```

### Focus Loss Tracker
```javascript
// src/hooks/useFocusTracker.js
export function useFocusTracker(maxViolations = 3) {
  const [violations, setViolations] = useState(0);
  const [terminated, setTerminated] = useState(false);

  useEffect(() => {
    const handleBlur = () => {
      setViolations(v => {
        const newCount = v + 1;
        if (newCount >= maxViolations) {
          setTerminated(true);
        }
        return newCount;
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [maxViolations]);

  return { violations, terminated };
}
```

## Credit & Reward System

### Global Credit Pool
```javascript
// src/utils/credits.js
import { doc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const CREDIT_POOL_DOC = doc(db, 'system', 'credit_pool');

// Get remaining credits in the global pool
export async function getRemainingCredits() {
  const snap = await getDoc(CREDIT_POOL_DOC);
  return snap.exists() ? snap.data().remaining : 0;
}

// Award credits to a user after completing a challenge
export async function awardCredits(userId, challengeId, baseCredits, completionTimeMs) {
  // Speed bonus: under 5 minutes = +20% bonus
  const FIVE_MINUTES = 5 * 60 * 1000;
  const speedBonus = completionTimeMs < FIVE_MINUTES ? Math.floor(baseCredits * 0.2) : 0;
  const totalCredits = baseCredits + speedBonus;

  // Check if user already completed this challenge
  const userDoc = await getDoc(doc(db, 'users', userId));
  const completedChallenges = userDoc.data()?.completedChallenges || [];
  if (completedChallenges.includes(challengeId)) {
    throw new Error('Challenge already completed');
  }

  // Deduct from global pool
  await updateDoc(CREDIT_POOL_DOC, {
    remaining: increment(-totalCredits)
  });

  // Add to user's balance
  await updateDoc(doc(db, 'users', userId), {
    credits: increment(totalCredits),
    completedChallenges: [...completedChallenges, challengeId],
    lastCompletedAt: serverTimestamp()
  });

  return { awarded: totalCredits, speedBonus };
}
```

### Leaderboard
```javascript
// src/utils/leaderboard.js
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export function subscribeToLeaderboard(callback, maxResults = 20) {
  const q = query(
    collection(db, 'users'),
    orderBy('credits', 'desc'),
    limit(maxResults)
  );

  return onSnapshot(q, (snapshot) => {
    const leaderboard = snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      displayName: doc.data().displayName,
      credits: doc.data().credits || 0,
      challengesCompleted: doc.data().completedChallenges?.length || 0
    }));
    callback(leaderboard);
  });
}
```

### Wallet Integration (No Paid SDKs)
```javascript
// src/utils/wallet.js
// MetaMask connection (Desktop - Student A)
export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  return accounts[0];
}

// Listen for wallet address changes
export function onWalletChange(callback) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
}
```

## Firebase Firestore Schema

### System Configuration
```javascript
// Collection: system, Document: credit_pool
{
  totalCredits: 10000,       // Fixed total (= ₱10,000 PHP)
  remaining: 10000,          // Decreases as students earn credits
  createdAt: timestamp
}
```

### User Profiles
```javascript
// Collection: users
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "John Doe",
  walletAddress: "0x...",     // Linked MetaMask or WalletConnect address
  createdAt: timestamp,
  credits: 150,               // Total credits earned
  completedChallenges: ["greeting-program", "grade-calculator"],
  integrityScore: 100,        // Decreases with cheat flags
  lastCompletedAt: timestamp
}
```

### Integrity Logs
```javascript
// Collection: integrity_logs
{
  uid: "firebase-auth-uid",
  challengeId: "greeting-program",
  timestamp: timestamp,
  codeHash: "sha256-hash-of-submitted-code",
  flags: {
    keystrokeVelocity: true/false,
    focusLoss: 2,
    contextMenuAttempts: 0
  },
  result: "passed" | "failed" | "terminated",
  creditsAwarded: 50,
  completionTimeMs: 180000    // 3 minutes
}
```

## Performance Optimization

### Bundle Splitting
- Lazy load wallet components only when user connects wallet
- Code-split CodeMirror language modes (load Java syntax only when needed)
- Use dynamic imports for Lite Mode components

### Caching Strategy
- Cache Judge0 responses for identical code submissions (24-hour TTL)
- Use React Query for API state management
- Service Worker for offline challenge descriptions

## Error Handling Strategy

### User-Facing Messages
- **Judge0 429 Error:** "Our code compiler is busy. Please wait 30 seconds and try again."
- **Judge0 Timeout:** "Your code took too long to run. Check for infinite loops."
- **Network Error:** "Connection lost. Please check your internet and retry."
- **Compilation Error:** Show stderr with line numbers highlighted in editor

### Logging
- Log all errors to Firestore `error_logs` collection with user context
- Track API failure rates to monitor Judge0 uptime
- Alert team if error rate exceeds 10% over 5 minutes

## Demo Contingency Plan

### Pre-Demo Checklist (Morning of Mar 5)
1. Test full user flow on staging environment
2. Check Judge0 API status (https://rapidapi.com/judge0-official/api/judge0-ce)
3. Verify Firebase Firestore credit pool is initialized (10,000 credits)
4. Confirm MetaMask and WalletConnect work on demo devices
5. Load backup demo video on USB drive

### Live Demo Strategy
- **Primary:** Live demo on laptop with Chrome DevTools mobile view
- **Backup Plan A:** Use pre-recorded video if API fails
- **Backup Plan B:** Show local screenshots with detailed narration
- **Talking Point:** "This is a working prototype built in 3 weeks by 1st-year students"

### Post-Demo Questions Preparation
- **Q: "What if someone bypasses your anti-cheat?"**
  - A: "The system creates an audit trail in Firestore with code hashes. We can revoke credits or flag accounts post-event. Our MVP focuses on deterrence."

- **Q: "How does the credit system work?"**
  - A: "We have a fixed pool of 10,000 credits visible to all students. They earn credits by completing challenges correctly and quickly. It creates urgency and motivates speed. The leaderboard adds friendly competition."

- **Q: "Can this scale to thousands of users?"**
  - A: "Yes. We'd self-host Judge0 with horizontal scaling. Firebase handles high throughput natively. The credit pool can be reset or expanded as needed."
