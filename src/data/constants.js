/**
 * CrediLab Constants — Single Source of Truth
 *
 * All difficulty tiers, reward ranges, time limits, and scalable config
 * live here. Every component and API should reference these instead of
 * hardcoding values.
 */

// ─── Difficulty → Reward Ranges (CLB) ────────────────────────────────
export const REWARD_TIERS = {
  Easy:   { min: 15, max: 20 },
  Medium: { min: 50, max: 60 },
  Hard:   { min: 75, max: 90 },
};

// ─── Difficulty → Time Limits (minutes) ──────────────────────────────
export const TIME_LIMITS = {
  Easy:   30,
  Medium: 60,
  Hard:   90,
};

// ─── Difficulty → Time Limit (milliseconds, for CodingPortal) ────────
export const TIME_LIMITS_MS = {
  Easy:   30 * 60 * 1000,
  Medium: 60 * 60 * 1000,
  Hard:   90 * 60 * 1000,
};

// ─── Difficulty → Time Limit Labels ──────────────────────────────────
export const TIME_LIMIT_LABELS = {
  Easy:   "30 min",
  Medium: "60 min",
  Hard:   "90 min",
};

// ─── Difficulty → Short Labels (for compact UI) ──────────────────────
export const TIME_LIMIT_SHORT = {
  Easy:   "30m",
  Medium: "60m",
  Hard:   "90m",
};

// ─── Difficulty → Minimum Expected Solve Time (seconds, anti-cheat) ──
export const MIN_SOLVE_TIME_SEC = {
  Easy:   120,
  Medium: 300,
  Hard:   600,
};

// ─── Difficulty → Badge Colors (Tailwind classes) ────────────────────
export const DIFF_COLORS = {
  Easy:   "bg-green-primary/10 text-green-primary",
  Medium: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  Hard:   "bg-red-100 dark:bg-red-900/20 text-red-500",
};

// ─── Server-Side Reward Cap ──────────────────────────────────────────
// Maximum CLB a single challenge can ever award (matches Hard tier max)
export const MAX_REWARD_PER_CHALLENGE = 100;

// ─── Credit Pool ─────────────────────────────────────────────────────
export const CREDIT_POOL_TOTAL = 10000;

// ─── Challenge Categories ────────────────────────────────────────────
export const CATEGORIES = [
  "Basics",
  "Control Flow",
  "Strings",
  "Arrays",
  "Recursion",
  "Sorting",
  "Methods",
  "OOP",
  "File I/O",
  "Data Structures",
  "Math & Logic",
  "SDG Environment",
];

// ─── Challenge Types ─────────────────────────────────────────────────
export const CHALLENGE_TYPES = {
  CODING:  "coding",       // Standard coding challenge (static, in challenges.js)
  WEEKLY:  "weekly",       // Weekly SDG task (Firestore-driven)
};

// ─── Weekly Task Config ──────────────────────────────────────────────
// Scalable limits — change these to adjust weekly task behavior
export const WEEKLY_TASK_CONFIG = {
  maxTasksPerWeek:        3,       // Max weekly tasks a student can complete per week
  defaultReward:          25,      // Default CLB reward for a weekly task
  maxReward:              50,      // Max CLB a single weekly task can award
  cooldownHours:          0,       // Hours between weekly task completions (0 = no cooldown)
  requiresWallet:         false,   // Whether wallet must be connected to complete
};

// ─── Helper: get time limit for a difficulty ─────────────────────────
export function getTimeLimitMs(difficulty) {
  return TIME_LIMITS_MS[difficulty] || TIME_LIMITS_MS.Easy;
}

export function getTimeLimitLabel(difficulty) {
  return TIME_LIMIT_LABELS[difficulty] || TIME_LIMIT_LABELS.Easy;
}

export function getMinSolveTime(difficulty) {
  return MIN_SOLVE_TIME_SEC[difficulty] || MIN_SOLVE_TIME_SEC.Easy;
}
