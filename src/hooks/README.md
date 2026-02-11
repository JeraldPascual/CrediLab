# Custom React Hooks

Reusable stateful logic for CrediLab features.

## Examples

### 1. Anti-Cheat: Keystroke Velocity Tracker
```jsx
// hooks/useKeystrokeTracker.js
import { useState, useRef } from 'react';

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
      if (velocity > 50 && charDelta > 10) {
        setSuspicious(true); // Flag paste/macro
      }
    }

    lastCharCount.current = currentCharCount;
    lastTimestamp.current = now;
  };

  return { suspicious, trackKeystroke };
}
```

### 2. Anti-Cheat: Focus Loss Tracker
```jsx
// hooks/useFocusTracker.js
import { useState, useEffect } from 'react';

export function useFocusTracker(maxViolations = 3) {
  const [violations, setViolations] = useState(0);
  const [terminated, setTerminated] = useState(false);

  useEffect(() => {
    const handleBlur = () => {
      setViolations(v => {
        const newCount = v + 1;
        if (newCount >= maxViolations) setTerminated(true);
        return newCount;
      });
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [maxViolations]);

  return { violations, terminated };
}
```

## Usage in Components
```jsx
import { useKeystrokeTracker } from '../hooks/useKeystrokeTracker';

function Editor() {
  const { suspicious, trackKeystroke } = useKeystrokeTracker();

  const handleCodeChange = (code) => {
    trackKeystroke(code.length);
    // ... rest of logic
  };

  return <div>{suspicious && <p>Suspicious activity detected</p>}</div>;
}
```
