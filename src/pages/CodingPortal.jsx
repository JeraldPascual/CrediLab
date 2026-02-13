import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { doc, setDoc, arrayUnion, increment } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../lib/firebase";
import { getChallengeById } from "../data/challenges";
import CHALLENGES from "../data/challenges";
import useAntiCheat from "../hooks/useAntiCheat";
import { executeCode } from "../utils/executeCode";

// CodeMirror imports
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { java } from "@codemirror/lang-java";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { oneDark } from "@codemirror/theme-one-dark";

export default function CodingPortal() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { user, userData, refreshUserData } = useAuth();
  const { dark, toggleDark } = useTheme();

  const challenge = getChallengeById(challengeId);
  const isCompleted = userData?.completedChallenges?.includes(challengeId);

  // Editor state
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const [code, setCode] = useState(() => {
    // Load saved code from localStorage, or fall back to starter code
    const saved = localStorage.getItem(`credilab-code-${challengeId}`);
    return saved || challenge?.starterCode || "";
  });
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exitTarget, setExitTarget] = useState("/problem");

  // Execution state
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("testcases"); // testcases | results
  const [customInput, setCustomInput] = useState("");
  const [runOutput, setRunOutput] = useState(null);

  // Auto-save code to localStorage
  useEffect(() => {
    if (code && challengeId) {
      localStorage.setItem(`credilab-code-${challengeId}`, code);
    }
  }, [code, challengeId]);

  // Reset state when challenge changes
  useEffect(() => {
    const saved = localStorage.getItem(`credilab-code-${challengeId}`);
    setCode(saved || challenge?.starterCode || "");
    setResults(null);
    setRunOutput(null);
    setActiveTab("testcases");
    setCustomInput("");
  }, [challengeId, challenge?.starterCode]);

  // Panel resize
  const [leftWidth, setLeftWidth] = useState(30);
  const [rightWidth, setRightWidth] = useState(25);
  const resizingRef = useRef(null);

  // Anti-cheat
  const antiCheat = useAntiCheat({ enabled: true, maxViolations: 3 });

  // Challenge navigation
  const currentIndex = CHALLENGES.findIndex((c) => c.id === challengeId);
  const prevChallenge = currentIndex > 0 ? CHALLENGES[currentIndex - 1] : null;
  const nextChallenge = currentIndex < CHALLENGES.length - 1 ? CHALLENGES[currentIndex + 1] : null;

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || !challenge) return;

    const extensions = [
      lineNumbers(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
      history(),
      bracketMatching(),
      closeBrackets(),
      indentOnInput(),
      java(),
      keymap.of([...defaultKeymap, ...historyKeymap, ...closeBracketsKeymap]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setCode(update.state.doc.toString());
        }
      }),
      EditorView.theme({
        "&": { fontSize: fontSize + "px" },
        ".cm-content": { fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" },
        ".cm-gutters": { fontFamily: "'JetBrains Mono', monospace" },
      }),
    ];

    if (wordWrap) {
      extensions.push(EditorView.lineWrapping);
    }

    // Theme
    if (dark) {
      extensions.push(oneDark);
    } else {
      extensions.push(syntaxHighlighting(defaultHighlightStyle, { fallback: true }));
      extensions.push(EditorView.theme({
        "&": { backgroundColor: "#ffffff" },
        ".cm-gutters": { backgroundColor: "#f8f9fa", color: "#999", borderRight: "1px solid #e5e7eb" },
        ".cm-activeLineGutter": { backgroundColor: "#e8f5e9" },
        ".cm-activeLine": { backgroundColor: "#f0fdf4" },
      }));
    }

    // Block paste (anti-cheat)
    extensions.push(EditorView.domEventHandlers({
      paste(event) {
        antiCheat.addViolation("Paste attempted in code editor");
        event.preventDefault();
        return true;
      },
    }));

    const state = EditorState.create({
      doc: code,
      extensions,
    });

    // Destroy previous view
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // We intentionally only re-create the editor when dark/fontSize/wordWrap changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, dark, fontSize, wordWrap]);

  // Panel resize handlers
  const handleResizeStart = useCallback((panel) => (e) => {
    e.preventDefault();
    resizingRef.current = { panel, startX: e.clientX, startLeft: leftWidth, startRight: rightWidth };

    function handleMove(moveE) {
      if (!resizingRef.current) return;
      const delta = ((moveE.clientX - resizingRef.current.startX) / window.innerWidth) * 100;
      if (resizingRef.current.panel === "left") {
        const newLeft = Math.min(50, Math.max(15, resizingRef.current.startLeft + delta));
        setLeftWidth(newLeft);
      } else {
        const newRight = Math.min(50, Math.max(15, resizingRef.current.startRight - delta));
        setRightWidth(newRight);
      }
    }

    function handleUp() {
      resizingRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [leftWidth, rightWidth]);

  // Run code (single custom input)
  async function handleRun() {
    if (running || antiCheat.terminated) return;
    setRunning(true);
    setActiveTab("results");
    setRunOutput(null);

    try {
      const token = await user.getIdToken();
      const data = await executeCode({
        code,
        languageId: challenge.languageId,
        stdin: customInput || challenge.sampleInput || "",
        firebaseToken: token,
      });
      setRunOutput(data);
    } catch (err) {
      setRunOutput({ error: err.message || "Network error" });
    } finally {
      setRunning(false);
    }
  }

  // Check code (run all test cases)
  async function handleCheck() {
    if (checking || antiCheat.terminated) return;
    setChecking(true);
    setActiveTab("results");
    setResults(null);

    try {
      const token = await user.getIdToken();
      const testResults = [];

      for (const tc of challenge.testCases) {
        const data = await executeCode({
          code,
          languageId: challenge.languageId,
          stdin: tc.input,
          firebaseToken: token,
        });
        const actualOutput = (data.stdout || "").trim();
        const passed = actualOutput === tc.expectedOutput.trim();
        testResults.push({
          input: tc.input,
          expected: tc.expectedOutput,
          actual: actualOutput,
          passed,
          error: data.stderr || data.error || null,
          status: data.status,
        });
      }

      setResults(testResults);

      // If all passed, mark as completed
      const allPassed = testResults.every((r) => r.passed);
      if (allPassed && !isCompleted) {
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(
            docRef,
            {
              completedChallenges: arrayUnion(challengeId),
              credits: increment(challenge.reward),
            },
            { merge: true }
          );
          await refreshUserData();
        } catch (err) {
          console.warn("Failed to save completion (ad blocker?):", err.message);
        }
      }
    } catch (err) {
      setResults([{ error: err.message || "Network error", passed: false }]);
    } finally {
      setChecking(false);
    }
  }

  if (!challenge) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-dark-bg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-dark-muted mb-4">Challenge not found.</p>
          <button onClick={() => navigate("/problem")} className="text-green-primary hover:underline text-sm">
            ← Back to challenges
          </button>
        </div>
      </div>
    );
  }

  const allPassed = results && results.length > 0 && results.every((r) => r.passed);

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-dark-bg select-none">
      {/* ── Top Bar ── */}
      <header className="h-12 flex items-center px-4 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border gap-3 flex-shrink-0">
        <button
          onClick={() => {
            const hasChanges = code !== (challenge?.starterCode || "");
            if (hasChanges) {
              setExitTarget("/problem");
              setShowExitConfirm(true);
            } else {
              navigate("/problem");
            }
          }}
          className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-dark-muted hover:text-green-primary transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        <div className="h-5 w-px bg-gray-300 dark:bg-dark-border" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{challenge.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            challenge.difficulty === "Easy"
              ? "bg-green-primary/10 text-green-primary"
              : challenge.difficulty === "Medium"
              ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
              : "bg-red-100 dark:bg-red-900/20 text-red-500"
          }`}>
            {challenge.difficulty}
          </span>
          <span className="text-xs font-bold text-green-primary">+{challenge.reward} CLB</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Challenge navigation */}
          {prevChallenge && (
            <button
              onClick={() => {
                const hasChanges = code !== (challenge?.starterCode || "");
                if (hasChanges) {
                  setExitTarget(`/problem/${prevChallenge.id}`);
                  setShowExitConfirm(true);
                } else {
                  navigate(`/problem/${prevChallenge.id}`);
                }
              }}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
              title={`Previous: ${prevChallenge.title}`}
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-500 dark:text-dark-muted" />
            </button>
          )}
          <span className="text-xs text-gray-400 dark:text-dark-muted">
            {currentIndex + 1}/{CHALLENGES.length}
          </span>
          {nextChallenge && (
            <button
              onClick={() => {
                const hasChanges = code !== (challenge?.starterCode || "");
                if (hasChanges) {
                  setExitTarget(`/problem/${nextChallenge.id}`);
                  setShowExitConfirm(true);
                } else {
                  navigate(`/problem/${nextChallenge.id}`);
                }
              }}
              className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
              title={`Next: ${nextChallenge.title}`}
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-dark-muted" />
            </button>
          )}

          <div className="h-5 w-px bg-gray-300 dark:bg-dark-border" />

          {/* Anti-cheat indicator */}
          {antiCheat.violations > 0 && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <ExclamationTriangleIcon className="w-3.5 h-3.5" /> {antiCheat.violations}/{antiCheat.maxViolations}
            </span>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={toggleDark}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <SunIcon className="w-4 h-4 text-yellow-400" />
            ) : (
              <MoonIcon className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings((p) => !p)}
            className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-dark-card transition-colors"
            title="Editor settings"
          >
            <Cog6ToothIcon className="w-4 h-4 text-gray-500 dark:text-dark-muted" />
          </button>

          {isCompleted && (
            <span className="text-xs text-green-primary font-semibold flex items-center gap-1">
              <CheckIcon className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>
      </header>

      {/* ── Settings Popover ── */}
      {showSettings && (
        <div className="absolute right-4 top-14 z-50 w-64 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Editor Settings</span>
            <button onClick={() => setShowSettings(false)}>
              <XMarkIcon className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-dark-muted mb-1">Font Size</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 accent-green-primary"
              />
              <span className="text-xs font-mono text-gray-700 dark:text-dark-text w-8 text-right">
                {fontSize}px
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-dark-muted">Word Wrap</span>
            <button
              onClick={() => setWordWrap((p) => !p)}
              className={`w-9 h-5 rounded-full transition-colors ${
                wordWrap ? "bg-green-primary" : "bg-gray-300 dark:bg-dark-border"
              }`}
            >
              <span
                className={`block w-3.5 h-3.5 bg-white rounded-full transition-transform ${
                  wordWrap ? "translate-x-4.5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* ── Exit Confirmation Modal ── */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl p-6 max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave this problem?</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-muted mb-5">
              Your code has been auto-saved and will be here when you come back.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-dark-border text-sm font-medium text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  navigate(exitTarget);
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-green-primary text-dark-bg text-sm font-semibold hover:bg-green-dark transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Anti-cheat Warning Modal ── */}
      {antiCheat.showWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm mx-4 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {antiCheat.terminated ? "Assessment Terminated" : "Warning!"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
                  {antiCheat.terminated
                    ? "You've exceeded the maximum number of violations. Your assessment has been terminated."
                    : `Violation detected! ${antiCheat.violations}/${antiCheat.maxViolations} — switching tabs, right-clicking, or pasting code is not allowed during assessments.`}
                </p>
              </div>
            </div>
            {antiCheat.terminated ? (
              <button
                onClick={() => navigate("/problem")}
                className="w-full py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Return to Challenges
              </button>
            ) : (
              <button
                onClick={antiCheat.dismissWarning}
                className="w-full py-2.5 rounded-lg bg-green-primary text-dark-bg font-semibold hover:bg-green-dark transition-colors"
              >
                I understand, continue
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Main 3-Panel Layout ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Left Panel: Problem Description ── */}
        <div className="flex flex-col overflow-hidden" style={{ width: leftWidth + "%" }}>
          <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
            <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">
              Problem Description
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{challenge.title}</h2>
              <p className="text-xs text-gray-400 dark:text-dark-muted">
                by {challenge.author || "CrediLab"} · {challenge.category}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-1">Description</h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
                {challenge.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-1">Input</h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed whitespace-pre-wrap">
                {challenge.inputDescription || "Refer to the description above."}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-1">Output</h3>
              <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed whitespace-pre-wrap">
                {challenge.outputDescription || "Refer to the description above."}
              </p>
            </div>

            {(challenge.sampleInput || challenge.sampleOutput) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">Sample</h3>
                <div className="grid gap-2">
                  {challenge.sampleInput && (
                    <div className="rounded-lg bg-gray-50 dark:bg-dark-surface p-3 border border-gray-200 dark:border-dark-border">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-muted font-semibold">Input</span>
                      <pre className="text-sm font-mono text-gray-800 dark:text-dark-text mt-1 whitespace-pre-wrap">{challenge.sampleInput}</pre>
                    </div>
                  )}
                  {challenge.sampleOutput && (
                    <div className="rounded-lg bg-gray-50 dark:bg-dark-surface p-3 border border-gray-200 dark:border-dark-border">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-muted font-semibold">Output</span>
                      <pre className="text-sm font-mono text-gray-800 dark:text-dark-text mt-1 whitespace-pre-wrap">{challenge.sampleOutput}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Left Resize Handle ── */}
        <div
          onMouseDown={handleResizeStart("left")}
          className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-dark-border hover:bg-green-primary/40 transition-colors flex-shrink-0"
        />

        {/* ── Center Panel: Code Editor ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border">
              <span className="text-xs font-mono text-gray-700 dark:text-dark-text">Main.java</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-dark-muted ml-auto">
              Java · Judge0 ID {challenge.languageId}
            </span>
          </div>
          <div
            ref={editorRef}
            className="flex-1 overflow-auto min-h-0"
            style={{ fontSize: fontSize + "px" }}
          />

          {/* ── Bottom Action Bar ── */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border flex-shrink-0">
            <div className="text-xs text-gray-400 dark:text-dark-muted">
              {antiCheat.terminated ? (
                <span className="text-red-500 font-medium">Assessment terminated</span>
              ) : (
                `${code.split("\n").length} lines`
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRun}
                disabled={running || antiCheat.terminated}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg border border-green-primary text-green-primary hover:bg-green-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayIcon className="w-4 h-4" />
                {running ? "Running…" : "Run Code"}
              </button>
              <button
                onClick={handleCheck}
                disabled={checking || antiCheat.terminated}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckIcon className="w-4 h-4" />
                {checking ? "Checking…" : "Check Code"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Resize Handle ── */}
        <div
          onMouseDown={handleResizeStart("right")}
          className="w-1.5 cursor-col-resize bg-gray-200 dark:bg-dark-border hover:bg-green-primary/40 transition-colors flex-shrink-0"
        />

        {/* ── Right Panel: Test Cases / Results ── */}
        <div className="flex flex-col overflow-hidden" style={{ width: rightWidth + "%" }}>
          <div className="flex items-center gap-1 px-2 py-2 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
            <button
              onClick={() => setActiveTab("testcases")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === "testcases"
                  ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-dark-muted hover:text-gray-700"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                activeTab === "results"
                  ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-dark-muted hover:text-gray-700"
              }`}
            >
              Results
              {results && (
                <span className={`ml-1.5 text-[10px] font-bold ${allPassed ? "text-green-primary" : "text-red-500"}`}>
                  {allPassed ? "✓ PASS" : "✗ FAIL"}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "testcases" ? (
              <TestCasesPanel challenge={challenge} customInput={customInput} setCustomInput={setCustomInput} />
            ) : (
              <ResultsPanel results={results} runOutput={runOutput} allPassed={allPassed} challenge={challenge} />
            )}
          </div>
        </div>
      </div>

      {/* ── Success Banner ── */}
      {allPassed && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-green-primary text-dark-bg px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckIcon className="w-5 h-5" />
          <span className="font-semibold">All test cases passed! +{challenge.reward} CLB earned</span>
        </div>
      )}
    </div>
  );
}

/* ── Test Cases Panel ── */
function TestCasesPanel({ challenge, customInput, setCustomInput }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-dark-muted mb-1 uppercase tracking-wide">
          Custom Input (for Run Code)
        </label>
        <textarea
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder={challenge.sampleInput || "Enter test input…"}
          rows={3}
          className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-1 focus:ring-green-primary resize-none"
        />
      </div>

      <div className="border-t border-gray-100 dark:border-dark-border pt-3">
        <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">
          Test Cases ({challenge.testCases.length})
        </span>
        <div className="mt-2 space-y-2">
          {challenge.testCases.map((tc, i) => (
            <div key={i} className="rounded-lg bg-gray-50 dark:bg-dark-surface p-3 border border-gray-200 dark:border-dark-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted">
                  Case {i + 1}
                </span>
              </div>
              <div className="text-xs font-mono text-gray-600 dark:text-dark-text space-y-1">
                <div>
                  <span className="text-gray-400 dark:text-dark-muted">Input: </span>
                  <span className="whitespace-pre-wrap">{tc.input}</span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-dark-muted">Expected: </span>
                  <span>{tc.expectedOutput}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Results Panel ── */
function ResultsPanel({ results, runOutput, allPassed }) {
  if (!results && !runOutput) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 dark:text-dark-muted text-sm text-center">
        <div>
          <PlayIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>Run your code or check against test cases to see results here.</p>
        </div>
      </div>
    );
  }

  // Single run output
  if (runOutput && !results) {
    return (
      <div className="space-y-3">
        <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">
          Run Output
        </span>
        {runOutput.error ? (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/10 p-3 border border-red-200 dark:border-red-800">
            <pre className="text-xs font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
              {runOutput.error}
            </pre>
          </div>
        ) : (
          <>
            {runOutput.stdout && (
              <div className="rounded-lg bg-gray-50 dark:bg-dark-surface p-3 border border-gray-200 dark:border-dark-border">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-dark-muted font-semibold">stdout</span>
                <pre className="text-sm font-mono text-gray-800 dark:text-dark-text mt-1 whitespace-pre-wrap">
                  {runOutput.stdout}
                </pre>
              </div>
            )}
            {runOutput.stderr && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/10 p-3 border border-yellow-200 dark:border-yellow-800">
                <span className="text-[10px] uppercase tracking-wider text-yellow-600 font-semibold">stderr</span>
                <pre className="text-xs font-mono text-yellow-700 dark:text-yellow-400 mt-1 whitespace-pre-wrap">
                  {runOutput.stderr}
                </pre>
              </div>
            )}
            {runOutput.status && (
              <div className="text-xs text-gray-400 dark:text-dark-muted">
                Status: {runOutput.status.description || "Unknown"} · Time: {runOutput.time || "—"}s · Memory: {runOutput.memory || "—"} KB
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Test case results
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wide">
          Test Results
        </span>
        <span className={`text-xs font-bold ${allPassed ? "text-green-primary" : "text-red-500"}`}>
          {results.filter((r) => r.passed).length}/{results.length} passed
        </span>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 border ${
              r.passed
                ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted">
                Case {i + 1}
              </span>
              <span className={`text-xs font-bold ${r.passed ? "text-green-primary" : "text-red-500"}`}>
                {r.passed ? "✓ PASS" : "✗ FAIL"}
              </span>
            </div>
            <div className="text-xs font-mono space-y-1">
              {r.input !== undefined && (
                <div className="text-gray-500 dark:text-dark-muted">
                  <span className="opacity-60">Input: </span>
                  <span className="whitespace-pre-wrap">{r.input}</span>
                </div>
              )}
              <div className="text-gray-500 dark:text-dark-muted">
                <span className="opacity-60">Expected: </span>
                <span>{r.expected}</span>
              </div>
              <div className={r.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                <span className="opacity-60">Got: </span>
                <span>{r.actual || "(empty)"}</span>
              </div>
              {r.error && (
                <div className="text-red-500 mt-1 whitespace-pre-wrap">
                  {r.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
