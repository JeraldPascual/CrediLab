# Utility Functions

Helper functions for API calls, verification, credits, and auth.

## Organization
- **judge0.js** — Execute code via Judge0 API
- **firebase.js** — Firebase initialization + auth helpers
- **credits.js** — Credit system (award, check pool)
- **verifier.js** — Test case verification logic

## Example: Judge0 API Call
```javascript
// utils/judge0.js
import { getAuth } from 'firebase/auth';

export async function executeCode(code, languageId, stdin) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error('You must be logged in');

  const token = await user.getIdToken();

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

  return await response.json();
}
```

## Example: Test Verification
```javascript
// utils/verifier.js
export function verifyOutput(actualOutput, expectedOutput) {
  return actualOutput.trim() === expectedOutput.trim();
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

## Student A Task
Create these utility files based on specs in `/project_context/TECHNICAL_SPECIFICATIONS.md`.
