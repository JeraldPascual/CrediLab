import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Anti-cheat hook for the coding portal.
 * - Tracks tab switches (visibilitychange)
 * - Blocks right-click context menu
 * - Monitors copy/paste in the coding area
 * - Returns violation count + warning state
 */
export default function useAntiCheat({ enabled = true, maxViolations = 3 } = {}) {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const violationRef = useRef(0);

  const addViolation = useCallback((reason) => {
    if (!enabled || violationRef.current >= maxViolations) return;
    violationRef.current += 1;
    const count = violationRef.current;
    setViolations(count);
    console.warn(`[AntiCheat] Violation ${count}/${maxViolations}: ${reason}`);

    if (count >= maxViolations) {
      setTerminated(true);
      setShowWarning(true);
    } else {
      setShowWarning(true);
    }
  }, [enabled, maxViolations]);

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
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [enabled, addViolation]);

  // Right-click block
  useEffect(() => {
    if (!enabled) return;

    function handleContextMenu(e) {
      e.preventDefault();
      addViolation("Right-click attempted");
    }

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [enabled, addViolation]);

  return {
    violations,
    maxViolations,
    showWarning,
    terminated,
    dismissWarning,
    addViolation,
  };
}
