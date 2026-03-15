/**
 * CrediLab Badge System
 *
 * SVG artwork lives in `src/data/badges.json` — the single source of truth
 * for both web and mobile. Each Icon component here is a thin wrapper that
 * reads its SVG string from that JSON at module initialisation.
 *
 * Each badge has:
 *   id, title, description, Icon (React component), color, bg, border, rarity
 *   criteria — human-readable unlock condition
 *   check(userData) — pure function → boolean
 */
import badgesJson from "./badges.json";
import CHALLENGES from "./challenges";

// ─── Build a difficulty lookup from the CHALLENGES array ──────────────────────
// Maps challengeId → "Easy" | "Medium" | "Hard"
const _DIFFICULTY = Object.fromEntries(CHALLENGES.map((c) => [c.id, c.difficulty]));

// ─── SVG lookup (id → raw svg string from badges.json) ───────────────────────
const _SVG = Object.fromEntries(badgesJson.badges.map((b) => [b.id, b.svg]));

/**
 * Builds a named React icon component from the SVG string stored in badges.json.
 * Injects width/height="100%" so the icon scales to the consumer's className.
 */
function _makeIcon(id, displayName) {
  const raw = _SVG[id] ?? "";
  const svg = raw.replace("<svg ", '<svg width="100%" height="100%" ');
  const Comp = ({ className = "w-6 h-6" }) => (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden="true"
    />
  );
  Comp.displayName = displayName;
  return Comp;
}

// ─── Named icon components (sourced from badges.json) ────────────────────────
const IconFirstBlood     = _makeIcon("first-blood",     "IconFirstBlood");
const IconPentakill      = _makeIcon("five-streak",     "IconPentakill");
const IconDoubleDigits   = _makeIcon("ten-complete",    "IconDoubleDigits");
const IconCompletionist  = _makeIcon("all-clear",       "IconCompletionist");
const IconChainConnected = _makeIcon("wallet-linked",   "IconChainConnected");
const IconCenturyClub    = _makeIcon("century-club",    "IconCenturyClub");
const IconEcoWarrior     = _makeIcon("eco-warrior",     "IconEcoWarrior");
const IconCommunityVoice = _makeIcon("community-voice", "IconCommunityVoice");
const IconSpeedDemon     = _makeIcon("speed-demon",     "IconSpeedDemon");
const IconHardHitter     = _makeIcon("hard-hitter",     "IconHardHitter");
const IconScholar        = _makeIcon("scholar",         "IconScholar");
const IconLegendary      = _makeIcon("expert-coder",    "IconLegendary");
const IconResilience     = _makeIcon("resilience-builds-strength", "IconResilience");
const IconDebugMaster    = _makeIcon("debug-detective", "IconDebugMaster");
const IconStreakWarrior  = _makeIcon("fifteen-streak",  "IconStreakWarrior");
const IconAllRound       = _makeIcon("all-difficulty-master", "IconAllRound");
const IconMentor         = _makeIcon("mentor-guide",    "IconMentor");
const IconEarlyBird      = _makeIcon("early-bird",      "IconEarlyBird");
const IconTripleThread   = _makeIcon("triple-thread",   "IconTripleThread");
const IconCLBHoarder     = _makeIcon("clb-hoarder",     "IconCLBHoarder");

// ─── Badge Definitions ────────────────────────────────────────────────────────

export const BADGES = [
  {
    id: "first-blood",
    title: "First Blood",
    description: "Completed your very first coding challenge. Every journey begins with a single step.",
    Icon: IconFirstBlood,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-900/20",
    border: "border-red-200 dark:border-red-800",
    rarity: "common",
    category: "coding",
    criteria: "Complete 1 challenge",
    check: (u) => (u?.completedChallenges?.length || 0) >= 1,
  },
  {
    id: "five-streak",
    title: "Pentakill",
    description: "Solved 5 challenges without breaking a sweat. You're building serious momentum.",
    Icon: IconPentakill,
    color: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    border: "border-yellow-200 dark:border-yellow-800",
    rarity: "common",
    category: "coding",
    criteria: "Complete 5 challenges",
    check: (u) => (u?.completedChallenges?.length || 0) >= 5,
  },
  {
    id: "ten-complete",
    title: "Double Digits",
    description: "10 challenges solved. You've entered the top percentile of active learners.",
    Icon: IconDoubleDigits,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    rarity: "uncommon",
    category: "coding",
    criteria: "Complete 10 challenges",
    check: (u) => (u?.completedChallenges?.length || 0) >= 10,
  },
  {
    id: "all-clear",
    title: "Completionist",
    description: "Cleared every challenge on the platform. Nothing left to prove — you are the benchmark.",
    Icon: IconCompletionist,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    rarity: "epic",
    category: "milestone",
    criteria: "Complete all 40 challenges",
    check: (u) => (u?.completedChallenges?.length || 0) >= 40,
  },
  {
    id: "wallet-linked",
    title: "Chain Connected",
    description: "Linked a MetaMask wallet to your account. You're officially on-chain and earning real tokens.",
    Icon: IconChainConnected,
    color: "text-indigo-500",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-200 dark:border-indigo-800",
    rarity: "uncommon",
    category: "blockchain",
    criteria: "Connect a MetaMask wallet",
    check: (u) => !!u?.walletAddress,
  },
  {
    id: "century-club",
    title: "Century Club",
    description: "Earned 100 CLB tokens — your hard work is now permanently recorded on the blockchain.",
    Icon: IconCenturyClub,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    rarity: "uncommon",
    category: "blockchain",
    criteria: "Earn 100+ CLB lifetime",
    check: (u) => (u?.totalCLBEarned ?? u?.credits ?? 0) >= 100,
  },
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Submitted a weekly SDG task and contributed to real-world sustainability. Code meets planet.",
    Icon: IconEcoWarrior,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    rarity: "uncommon",
    category: "environmental",
    criteria: "Submit 1 weekly SDG task",
    check: (u) => (u?.weeklyTasksCompleted || 0) >= 1,
  },
  {
    id: "community-voice",
    title: "Community Voice",
    description: "Your submission earned 3+ net upvotes from peers. The community trusts your code.",
    Icon: IconCommunityVoice,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    rarity: "uncommon",
    category: "community",
    criteria: "Get a submission community-approved (3+ net upvotes)",
    check: (u) => (u?.communityApprovals || 0) >= 1,
  },
  {
    id: "speed-demon",
    title: "Speed Demon",
    description: "Solved a challenge in under 2 minutes. Pure instinct, zero hesitation.",
    Icon: IconSpeedDemon,
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-200 dark:border-cyan-800",
    rarity: "rare",
    category: "speed",
    criteria: "Solve any challenge in under 2 minutes",
    check: (u) => (u?.fastestSolveTimeSec ?? Infinity) <= 120,
  },
  {
    id: "hard-hitter",
    title: "Hard Hitter",
    description: "Conquered a Hard difficulty challenge graded by Judge0. Only the brave attempt these.",
    Icon: IconHardHitter,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    rarity: "rare",
    category: "coding",
    criteria: "Complete a Hard difficulty challenge",
    check: (u) => {
      const completed = u?.completedChallenges || [];
      return completed.some((id) => _DIFFICULTY[id] === "Hard");
    },
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Reached Junior Programmer tier at 130 CLB. Your foundational skills are employer-verified.",
    Icon: IconScholar,
    color: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    rarity: "rare",
    category: "milestone",
    criteria: "Reach Junior Programmer tier (130+ CLB)",
    check: (u) => (u?.totalCLBEarned ?? u?.credits ?? 0) >= 130,
  },
  {
    id: "expert-coder",
    title: "Legendary",
    description: "Reached Expert Engineer tier — the highest rank on the platform. You are the benchmark.",
    Icon: IconLegendary,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    rarity: "legendary",
    category: "milestone",
    criteria: "Reach Expert Engineer tier (730+ CLB)",
    check: (u) => (u?.totalCLBEarned ?? u?.credits ?? 0) >= 730,
  },
  {
    id: "resilience-builds-strength",
    title: "Night Owl",
    description: "Submitted a challenge solution between midnight and 5 AM. Dedication knows no bedtime.",
    Icon: IconResilience,
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-900/20",
    border: "border-pink-200 dark:border-pink-800",
    rarity: "uncommon",
    category: "mindset",
    criteria: "Complete a challenge between 12 AM and 5 AM",
    check: (u) => !!u?.nightOwlUnlocked,
  },
  {
    id: "debug-detective",
    title: "Explorer",
    description: "Attempted challenges across 3+ different categories. Curiosity is your superpower.",
    Icon: IconDebugMaster,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    rarity: "common",
    category: "coding",
    criteria: "Complete challenges in 3+ different categories",
    check: (u) => {
      const completed = u?.completedChallenges || [];
      const cats = new Set();
      for (const id of completed) {
        const ch = CHALLENGES.find((c) => c.id === id);
        if (ch) cats.add(ch.category);
      }
      return cats.size >= 3;
    },
  },
  {
    id: "fifteen-streak",
    title: "Streak Warrior",
    description: "Completed 15 challenges total. Your consistency is unmatched.",
    Icon: IconStreakWarrior,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    rarity: "rare",
    category: "milestone",
    criteria: "Complete 15 challenges total",
    check: (u) => (u?.completedChallenges?.length || 0) >= 15,
  },
  {
    id: "all-difficulty-master",
    title: "All-Round Master",
    description: "Solved challenges at Easy, Medium, and Hard levels. You're well-rounded.",
    Icon: IconAllRound,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    border: "border-purple-200 dark:border-purple-800",
    rarity: "rare",
    category: "skill",
    criteria: "Complete 1 Easy, 1 Medium, and 1 Hard challenge",
    check: (u) => {
      const completed = u?.completedChallenges || [];
      let hasEasy = false, hasMedium = false, hasHard = false;
      for (const id of completed) {
        const diff = _DIFFICULTY[id];
        if (diff === "Easy") hasEasy = true;
        else if (diff === "Medium") hasMedium = true;
        else if (diff === "Hard") hasHard = true;
        if (hasEasy && hasMedium && hasHard) return true;
      }
      return false;
    },
  },
  {
    id: "mentor-guide",
    title: "Mentor Spirit",
    description: "Voted to help validate another student's work. Leadership through support.",
    Icon: IconMentor,
    color: "text-cyan-500",
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    border: "border-cyan-200 dark:border-cyan-800",
    rarity: "common",
    category: "community",
    criteria: "Vote on 1 peer community submission",
    check: (u) => (u?.communityVotesGiven || 0) >= 1,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Completed a challenge within 24 hours of account creation. No time to waste!",
    Icon: IconEarlyBird,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    border: "border-orange-200 dark:border-orange-800",
    rarity: "rare",
    category: "speed",
    criteria: "Complete a challenge within 24h of account creation",
    check: (u) => !!u?.earlyBirdUnlocked,
  },
  {
    id: "triple-thread",
    title: "Triple Threat",
    description: "Completed 3 challenges in a single day. A true coding marathon.",
    Icon: IconTripleThread,
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-200 dark:border-rose-800",
    rarity: "rare",
    category: "speed",
    criteria: "Complete 3 challenges in one day",
    check: (u) => !!u?.tripleThreadUnlocked,
  },
  {
    id: "clb-hoarder",
    title: "CLB Hoarder",
    description: "Accumulated 300+ lifetime CLB. Your dedication is paying off — literally.",
    Icon: IconCLBHoarder,
    color: "text-lime-500",
    bg: "bg-lime-50 dark:bg-lime-900/20",
    border: "border-lime-200 dark:border-lime-800",
    rarity: "epic",
    category: "milestone",
    criteria: "Earn 300+ CLB lifetime",
    check: (u) => (u?.totalCLBEarned ?? u?.credits ?? 0) >= 300,
  },
];

// ─── Rarity label helper ──────────────────────────────────────────────────────
export const RARITY_COLORS = {
  common:    "text-gray-400",
  uncommon:  "text-green-500",
  rare:      "text-blue-500",
  epic:      "text-purple-500",
  legendary: "text-amber-500",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns array of badge objects that the user has earned. */
export function getEarnedBadges(userData) {
  return BADGES.filter((b) => b.check(userData));
}

/** Returns array of badge objects that the user has NOT yet earned. */
export function getLockedBadges(userData) {
  return BADGES.filter((b) => !b.check(userData));
}

/** Returns total badge count earned. */
export function getBadgeCount(userData) {
  return BADGES.filter((b) => b.check(userData)).length;
}
