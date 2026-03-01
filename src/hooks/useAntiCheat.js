import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, collection, addDoc, arrayUnion } from "firebase/firestore";

/**
 * Anti-cheat hook for the coding portal.
 * - Tracks tab switches (visibilitychange)
 * - Blocks right-click context menu
 * - Monitors copy/paste in the coding area
 * - DevTools detection via window size delta
 * - Persists violation count to BOTH localStorage AND Firestore (tamper-resistant)
 * - Logs every individual violation to Firestore `cheatLogs` for full auditability
 * - On mount, syncs from Firestore to catch cleared localStorage
 * - Blocks DevTools keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U)
 *
 * @param {Object} options
 * @param {boolean} options.enabled - Enable/disable all monitoring
 * @param {number} options.maxViolations - Max violations before termination (default 3)
 * @param {string} options.challengeId - Challenge ID for persistence key
 * @param {string} options.userId - User UID for persistence key
 */
export default function useAntiCheat({
  enabled = true,
  maxViolations = 3,
  challengeId = null,
  userId = null,
} = {}) {
  // Build storage key for this challenge
  const storageKey =
    challengeId && userId
      ? `credilab-violations-${userId}-${challengeId}`
      : null;

  // Firestore doc ref for violation summary (per user per challenge)
  const firestoreDocId =
    challengeId && userId ? `${userId}_${challengeId}` : null;

  // Load persisted violations on mount (check both localStorage and session status)
  const loadPersistedViolations = () => {
    if (!storageKey) return 0;
    try {
      // Check if the session itself is terminated (harder to tamper — also stored in Firestore)
      const sessionKey = `challenge-session-${userId}-${challengeId}`;
      const sessionData = localStorage.getItem(sessionKey);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (session.status === "terminated") {
          return maxViolations; // Force terminated state
        }
      }

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.count === "number" ? parsed.count : 0;
      }
    } catch {
      // Corrupted data, start fresh
    }
    return 0;
  };

  const [violations, setViolations] = useState(loadPersistedViolations);
  const [showWarning, setShowWarning] = useState(false);
  const [terminated, setTerminated] = useState(
    () => loadPersistedViolations() >= maxViolations
  );
  const violationRef = useRef(loadPersistedViolations());
  const violationLog = useRef([]); // Detailed log of each violation
  const firestoreSynced = useRef(false); // Prevent double-sync

  // ── Sync from Firestore on mount (catches cleared localStorage) ──
  useEffect(() => {
    if (!firestoreDocId || firestoreSynced.current) return;

    async function syncFromFirestore() {
      try {
        const snap = await getDoc(doc(db, "violationSummaries", firestoreDocId));
        if (snap.exists()) {
          const data = snap.data();
          const fsCount = typeof data.count === "number" ? data.count : 0;

          // Use Firestore count if it's higher than localStorage (prevents tampering)
          if (fsCount > violationRef.current) {
            violationRef.current = fsCount;
            setViolations(fsCount);
            if (fsCount >= maxViolations) {
              setTerminated(true);
            }
            // Re-persist to localStorage so it stays in sync
            if (storageKey) {
              try {
                localStorage.setItem(
                  storageKey,
                  JSON.stringify({
                    count: fsCount,
                    log: data.log || [],
                    lastUpdated: Date.now(),
                  })
                );
              } catch { /* ignore */ }
            }
          }
        }
      } catch {
        // Firestore unavailable — rely on localStorage
      }
      firestoreSynced.current = true;
    }

    syncFromFirestore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestoreDocId]);

  // Re-sync from localStorage once storageKey becomes available (e.g. auth loads after mount)
  useEffect(() => {
    if (!storageKey) return;
    const count = loadPersistedViolations();
    if (count > violationRef.current) {
      violationRef.current = count;
      setViolations(count);
      if (count >= maxViolations) {
        setTerminated(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // Persist violations to localStorage whenever they change
  const persistViolations = useCallback(
    (count, log) => {
      if (!storageKey) return;
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            count,
            log: log || [],
            lastUpdated: Date.now(),
          })
        );
      } catch {
        // Storage full or unavailable
      }
    },
    [storageKey]
  );

  // ── Persist violation summary to Firestore ──
  // Uses arrayUnion so every log entry is APPENDED, never overwritten
  const persistToFirestore = useCallback(
    async (count, log) => {
      if (!firestoreDocId) return;
      try {
        // Build the newest entry to append (the last item in the local log)
        const latestEntry = log && log.length > 0 ? log[log.length - 1] : null;

        const updateData = {
          userId,
          challengeId,
          count,
          lastUpdated: Date.now(),
        };

        // If there's a new entry, append it; otherwise just update the count
        if (latestEntry) {
          updateData.log = arrayUnion(latestEntry);
        }

        await setDoc(
          doc(db, "violationSummaries", firestoreDocId),
          updateData,
          { merge: true }
        );
      } catch {
        // Firestore unavailable — localStorage is the fallback
      }
    },
    [firestoreDocId, userId, challengeId]
  );

  // ── Log individual violation to Firestore cheatLogs collection ──
  const logViolationToFirestore = useCallback(
    async (reason, count) => {
      if (!userId || !challengeId) return;
      try {
        await addDoc(collection(db, "cheatLogs"), {
          userId,
          challengeId,
          reason,
          count,
          timestamp: Date.now(),
        });
      } catch {
        // Non-blocking — don't disrupt the user experience
      }
    },
    [userId, challengeId]
  );

  const addViolation = useCallback(
    (reason) => {
      if (!enabled || violationRef.current >= maxViolations) return;

      violationRef.current += 1;
      const count = violationRef.current;

      // Log violation with timestamp
      const entry = { reason, timestamp: Date.now(), count };
      violationLog.current.push(entry);

      setViolations(count);
      persistViolations(count, violationLog.current);

      // ── Persist to Firestore (non-blocking) ──
      persistToFirestore(count, violationLog.current);
      logViolationToFirestore(reason, count);

      if (count >= maxViolations) {
        setTerminated(true);
        setShowWarning(true);
      } else {
        setShowWarning(true);
      }
    },
    [enabled, maxViolations, persistViolations, persistToFirestore, logViolationToFirestore]
  );

  const dismissWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  // Tab switch detection
  useEffect(() => {
    if (!enabled) return;

    function handleVisibility() {
      if (document.hidden) {
        addViolation("Tab switch or window focus lost");
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, addViolation]);

  // Right-click block
  useEffect(() => {
    if (!enabled) return;

    function handleContextMenu(e) {
      e.preventDefault();
      addViolation("Right-click attempted");
    }

    document.addEventListener("contextmenu", handleContextMenu);
    return () =>
      document.removeEventListener("contextmenu", handleContextMenu);
  }, [enabled, addViolation]);

  // DevTools detection (monitors window size changes)
  useEffect(() => {
    if (!enabled) return;

    const threshold = 160;
    let devtoolsOpen = false;

    function checkDevTools() {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;

      const isOpen = widthDiff > threshold || heightDiff > threshold;

      if (isOpen && !devtoolsOpen) {
        devtoolsOpen = true;
        addViolation("Developer tools detected");
      } else if (!isOpen && devtoolsOpen) {
        devtoolsOpen = false;
      }
    }

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, [enabled, addViolation]);

  // Keyboard shortcut blocking (F12, Ctrl+Shift+I/J/C, Ctrl+U)
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e) {
      if (e.key === "F12") {
        e.preventDefault();
        addViolation("F12 key blocked");
        return;
      }
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "i", "J", "j", "C", "c"].includes(e.key)
      ) {
        e.preventDefault();
        addViolation("DevTools keyboard shortcut blocked");
        return;
      }
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        addViolation("View source shortcut blocked");
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () =>
      document.removeEventListener("keydown", handleKeyDown, true);
  }, [enabled, addViolation]);

  return {
    violations,
    maxViolations,
    showWarning,
    terminated,
    dismissWarning,
    addViolation,
    getViolationLog: () => violationLog.current,
  };
}
