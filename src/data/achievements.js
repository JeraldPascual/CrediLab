/**
 * CrediLab Achievement System
 *
 * Two revenue model pillars:
 *
 * 1. EMPLOYER CREDIBILITY — Tiers & titles prove a student's coding skill level.
 *    Employers can verify rank on the leaderboard. Higher tier = harder challenges solved.
 *
 * 2. CAFETERIA CLAIM — CLB tokens can be redeemed at the school cafeteria.
 *    Each cafeteria tier unlocks a specific meal/snack claim once per term.
 */

// ─── Skill Tiers (Employer Credibility) ─────────────────────────────────────
// Based on total CLB credits earned. Each tier has a display title and color.
export const SKILL_TIERS = [
  {
    id: "novice",
    title: "Novice Coder",
    shortTitle: "Novice",
    minCredits: 0,
    icon: "🌱",
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800/40",
    border: "border-gray-300 dark:border-gray-600",
    description: "Just getting started. Completed first challenge.",
  },
  {
    id: "apprentice",
    title: "Apprentice Developer",
    shortTitle: "Apprentice",
    minCredits: 50,
    icon: "⚙️",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    description: "Solving basic problems with confidence.",
  },
  {
    id: "junior",
    title: "Junior Programmer",
    shortTitle: "Junior",
    minCredits: 130,
    icon: "💻",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    description: "Demonstrates solid foundational skills.",
  },
  {
    id: "intermediate",
    title: "Intermediate Coder",
    shortTitle: "Intermediate",
    minCredits: 280,
    icon: "🔧",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    description: "Tackles algorithms and data structures.",
  },
  {
    id: "advanced",
    title: "Advanced Developer",
    shortTitle: "Advanced",
    minCredits: 480,
    icon: "🚀",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    description: "Consistently solves complex problems.",
  },
  {
    id: "expert",
    title: "Expert Engineer",
    shortTitle: "Expert",
    minCredits: 730,
    icon: "🏆",
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    description: "Top-tier. Employer-verified coding mastery.",
  },
];

// ─── Cafeteria Claim Tiers (Revenue Model 2) ─────────────────────────────────
// Students redeem CLB at the cafeteria counter. Each tier unlocks a meal reward.
// Redemption is manual — student shows their profile to the cashier.
export const CAFETERIA_TIERS = [
  {
    id: "snack",
    label: "Free Snack",
    minCredits: 50,
    icon: "🍪",
    description: "Redeem for a free snack or drink.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "combo",
    label: "Combo Meal",
    minCredits: 130,
    icon: "🍱",
    description: "Redeem for a combo meal (rice + viand).",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
  },
  {
    id: "premium",
    label: "Premium Lunch",
    minCredits: 280,
    icon: "🍽️",
    description: "Redeem for a full premium lunch set.",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
  },
  {
    id: "feast",
    label: "Feast Pack",
    minCredits: 480,
    icon: "👑",
    description: "Redeem for a full feast pack + dessert.",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns the current skill tier object for a given CLB credit amount. */
export function getSkillTier(credits = 0) {
  // Walk tiers in reverse to find the highest one unlocked
  for (let i = SKILL_TIERS.length - 1; i >= 0; i--) {
    if (credits >= SKILL_TIERS[i].minCredits) return SKILL_TIERS[i];
  }
  return SKILL_TIERS[0];
}

/** Returns the next skill tier, or null if already at max. */
export function getNextSkillTier(credits = 0) {
  const current = getSkillTier(credits);
  const idx = SKILL_TIERS.findIndex((t) => t.id === current.id);
  return SKILL_TIERS[idx + 1] || null;
}

/** Returns progress (0–100) toward the next skill tier. */
export function getTierProgress(credits = 0) {
  const current = getSkillTier(credits);
  const next = getNextSkillTier(credits);
  if (!next) return 100;
  const range = next.minCredits - current.minCredits;
  const earned = credits - current.minCredits;
  return Math.min(100, Math.floor((earned / range) * 100));
}

/** Returns all cafeteria tiers the student has unlocked. */
export function getUnlockedCafeteriaTiers(credits = 0) {
  return CAFETERIA_TIERS.filter((t) => credits >= t.minCredits);
}

/** Returns the highest unlocked cafeteria tier, or null. */
export function getHighestCafeteriaTier(credits = 0) {
  const unlocked = getUnlockedCafeteriaTiers(credits);
  return unlocked.length > 0 ? unlocked[unlocked.length - 1] : null;
}

/** Returns the next locked cafeteria tier, or null if all unlocked. */
export function getNextCafeteriaTier(credits = 0) {
  return CAFETERIA_TIERS.find((t) => credits < t.minCredits) || null;
}
