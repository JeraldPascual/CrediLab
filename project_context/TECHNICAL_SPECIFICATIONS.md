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

### Single Hardcoded Challenge (MVP)
```javascript
// src/data/challenges.js
export const mvpChallenge = {
  id: 'hello-user',
  title: 'Personalized Greeting',
  description: 'Write a Java program that reads a name from input and prints "Hello, [name]!"',
  boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here

    }
}`,
  testCases: [
    { stdin: 'Alice', expectedOutput: 'Hello, Alice!' },
    { stdin: 'Bob', expectedOutput: 'Hello, Bob!' },
    { stdin: 'Charlie', expectedOutput: 'Hello, Charlie!' }
  ],
  languageId: 62 // Java (Judge0 language ID)
};
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

## Blockchain Integration

### Gasless Minting Setup (Thirdweb)
1. Deploy ERC-1155 contract via Thirdweb dashboard
2. Configure Claim Conditions:
   - Max claims per wallet: 1
   - Price: 0 (Free)
   - Enable gasless claiming (Thirdweb relayer)
3. Add contract address to environment variables

### Minting Logic
```javascript
// src/utils/mint.js
import { useContract, useClaimNFT } from '@thirdweb-dev/react';

export function useMintBadge() {
  const { contract } = useContract(process.env.REACT_APP_CONTRACT_ADDRESS);
  const { mutateAsync: claimNFT, isLoading } = useClaimNFT(contract);

  const mintBadge = async (codeHash) => {
    try {
      // Claim token ID 0 with metadata
      await claimNFT({
        tokenId: 0,
        quantity: 1,
        metadata: {
          codeHash,
          timestamp: Date.now(),
          challenge: 'hello-user'
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Minting failed:', error);
      return { success: false, error: error.message };
    }
  };

  return { mintBadge, isLoading };
}
```

## Firebase Firestore Schema

### User Profiles
```javascript
// Collection: users
{
  uid: "firebase-auth-uid",
  email: "user@example.com",
  displayName: "John Doe",
  createdAt: timestamp,
  completedChallenges: ["hello-user"],
  integrityScore: 100, // Decreases with cheat flags
  badges: [
    {
      tokenId: 0,
      challengeId: "hello-user",
      mintedAt: timestamp,
      transactionHash: "0x..."
    }
  ]
}
```

### Integrity Logs
```javascript
// Collection: integrity_logs
{
  uid: "firebase-auth-uid",
  challengeId: "hello-user",
  timestamp: timestamp,
  flags: {
    keystrokeVelocity: true/false,
    focusLoss: 2,
    contextMenuAttempts: 0
  },
  result: "passed" | "failed" | "terminated"
}
```

## Performance Optimization

### Bundle Splitting
- Lazy load blockchain components (Thirdweb SDK) only when user connects wallet
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
3. Verify Thirdweb gasless relayer balance
4. Confirm backup wallets have MATIC
5. Load backup demo video on USB drive

### Live Demo Strategy
- **Primary:** Live demo on laptop with Chrome DevTools mobile view
- **Backup Plan A:** Use pre-recorded video if API fails
- **Backup Plan B:** Show local screenshots with detailed narration
- **Talking Point:** "This is a working prototype built in 3 weeks by 1st-year students"

### Post-Demo Questions Preparation
- **Q: "What if someone bypasses your anti-cheat?"**
  - A: "The blockchain creates an audit trail. We can revoke badges or flag accounts post-event. Our MVP focuses on deterrence."

- **Q: "How do you prevent gas drain?"**
  - A: "Smart contract enforces 1 badge per wallet. Thirdweb's gasless relayer has built-in rate limits. We also monitor minting activity."

- **Q: "Can this scale to thousands of users?"**
  - A: "Yes. We'd self-host Judge0 with horizontal scaling. Firebase and Polygon handle high throughput natively."
