import { useState } from "react";
import { TrophyIcon, StarIcon, CheckCircleIcon, ArrowDownTrayIcon, LinkIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import {
  getSkillTier,
  getNextSkillTier,
  getTierProgress,
  SKILL_TIERS,
} from "../data/achievements";
import { BADGES, getEarnedBadges, RARITY_COLORS } from "../data/badges";
import { generateCertificate } from "../utils/generateCertificate";
import TierFrame from "../components/TierFrame";

export default function AchievementsPage() {
  const { userData, user } = useAuth();
  // Rank uses totalCLBEarned (lifetime) — never affected by cafeteria spending
  const totalEarned = userData?.totalCLBEarned ?? userData?.credits ?? 0;
  const spendableBalance = userData?.credits ?? 0;
  const completedCount = userData?.completedChallenges?.length || 0;
  const displayName = userData?.displayName || user?.displayName || "Student";

  const tier = getSkillTier(totalEarned);
  const nextTier = getNextSkillTier(totalEarned);
  const progress = getTierProgress(totalEarned);

  const [generating, setGenerating] = useState(false);
  const [certHash, setCertHash] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("credentials"); // "credentials" | "badges" | "certificate"
  const [hoverBadge, setHoverBadge] = useState(null); // for badge hover card
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const canDownload = totalEarned >= 50;

  const existingHash = userData?.certHash || null;
  const baseUrl = window.location.origin;
  const verifyUrl = (certHash || existingHash)
    ? `${baseUrl}/verify/${certHash || existingHash}`
    : null;

  async function generateHash(data) {
    const text = JSON.stringify(data);
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async function handleDownload() {
    if (!canDownload || generating) return;
    setGenerating(true);
    try {
      const issueDate = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      });

      const hash = await generateHash({
        uid: user.uid,
        studentName: displayName,
        tierTitle: tier.title,
        totalEarned,
        completedCount,
        issuedAt: Date.now(),
      });

      const certData = {
        studentName: displayName,
        tierTitle: tier.title,
        credits: totalEarned,
        completedCount,
        issueDate,
        issuedAt: Date.now(),
        uid: user.uid,
      };

      // Save to Firestore so /verify/:hash can read it
      await setDoc(doc(db, "certificates", hash), certData);

      // Also store latest hash on the user's profile for quick re-linking
      await setDoc(doc(db, "users", user.uid), { certHash: hash }, { merge: true });

      setCertHash(hash);

      const url = `${baseUrl}/verify/${hash}`;
      await generateCertificate({
        studentName: displayName,
        tierTitle: tier.title,
        credits: totalEarned,
        completedCount,
        issueDate,
        verifyUrl: url,
      });
    } finally {
      setGenerating(false);
    }
  }

  function handleCopyLink() {
    if (!verifyUrl) return;
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">

      {/* ── DEV: Badge Icon Gallery (remove when done testing) ── */}
      <div className="rounded-xl border-2 border-dashed border-yellow-400/50 bg-yellow-50/50 dark:bg-yellow-900/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400 mb-4">
          🧪 Dev Preview — Badge Icons (from badges.json)
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {BADGES.map((badge) => (
            <div key={badge.id} className="flex flex-col items-center gap-2">
              {/* Large icon in its accent colour */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${badge.bg} ${badge.border} border`}>
                <badge.Icon className={`w-9 h-9 ${badge.color}`} />
              </div>
              {/* Small icon — as it appears in pill badges */}
              <div className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.border} border ${badge.color}`}>
                <badge.Icon className="w-3 h-3" />
                {badge.title}
              </div>
              <span className={`text-[9px] font-semibold ${RARITY_COLORS[badge.rarity]}`}>
                {badge.rarity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DEV: TierFrame Preview (remove when done testing) ── */}
      <div className="rounded-xl border-2 border-dashed border-cyan-400/50 bg-cyan-50/50 dark:bg-cyan-900/10 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mb-4">
          🎨 Dev Preview — Tier Frames (animated progression)
        </p>
        <div className="flex flex-wrap gap-6 items-end justify-center">
          {SKILL_TIERS.map((t) => (
            <div key={t.id} className="flex flex-col items-center gap-2">
              <TierFrame tier={t.id} size="lg">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl ${t.bg}`}>
                  {t.icon}
                </div>
              </TierFrame>
              <span className="text-xs font-bold text-gray-700 dark:text-dark-text capitalize">
                {t.id}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-dark-muted">
                {t.minCredits}+ CLB
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrophyIcon className="w-7 h-7 text-yellow-500" />
          Achievements &amp; Credentials
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Your skill rank and employer credentials based on total CLB earned.
        </p>
      </div>

      {/* ── Current Rank Card ── */}
      <div className={`rounded-xl border p-6 ${tier.bg} ${tier.border}`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{tier.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-dark-muted mb-1">
                Current Rank
              </p>
              <p className={`text-2xl font-bold ${tier.color}`}>{tier.title}</p>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">{tier.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-primary">{totalEarned}</p>
            <p className="text-xs text-gray-400 dark:text-dark-muted">CLB earned (lifetime)</p>
            <p className="text-sm font-semibold text-gray-600 dark:text-dark-text mt-1">
              {completedCount} challenge{completedCount !== 1 ? "s" : ""} solved
            </p>
            {spendableBalance !== totalEarned && (
              <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">
                {spendableBalance} CLB spendable
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {nextTier ? (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-dark-muted">
                Progress to <span className={`font-semibold ${nextTier.color}`}>{nextTier.icon} {nextTier.shortTitle}</span>
              </span>
              <span className="font-semibold text-gray-700 dark:text-dark-text">{totalEarned} / {nextTier.minCredits} CLB</span>
            </div>
            <div className="h-3 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  tier.id === "novice"       ? "bg-gray-400" :
                  tier.id === "apprentice"   ? "bg-blue-500" :
                  tier.id === "junior"       ? "bg-indigo-500" :
                  tier.id === "intermediate" ? "bg-violet-500" :
                  tier.id === "advanced"     ? "bg-green-500" : "bg-yellow-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 dark:text-dark-muted">
              {nextTier.minCredits - totalEarned} CLB to reach <strong>{nextTier.title}</strong>
            </p>
          </div>
        ) : (
          <div className="mt-5 flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-400/20">
            <StarIcon className="w-5 h-5 text-yellow-500" />
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
              Maximum rank achieved — Employer-verified mastery!
            </p>
          </div>
        )}

        {/* Earned badges summary */}
        {(() => {
          const earned = getEarnedBadges(userData);
          return earned.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {earned.map((b) => (
                <span
                  key={b.id}
                  title={b.criteria}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${b.bg} ${b.border} border ${b.color}`}
                >
                  <b.Icon className="w-3 h-3" /> {b.title}
                </span>
              ))}
            </div>
          ) : null;
        })()}

        <div className="mt-5 pt-5 border-t border-black/10 dark:border-white/10">
          <p className="text-sm text-gray-500 dark:text-dark-muted">
            💼 <span className="font-semibold text-gray-700 dark:text-dark-text">Employer Credential:</span>{" "}
            Your rank is publicly visible on the CrediLab leaderboard.
            Employers can verify your coding level by searching your name.
          </p>
        </div>
      </div>

      {/* ── CLB Spending Note ── */}
      <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          💳 Spending CLB
        </h2>
        <p className="text-sm text-gray-500 dark:text-dark-muted">
          Send CLB tokens directly to the cafeteria wallet via MetaMask.
          Your <span className="font-semibold text-gray-700 dark:text-dark-text">rank is never affected</span> —
          it is based on your lifetime earned total, not your current balance.
        </p>
        <p className="mt-2 text-xs text-gray-400 dark:text-dark-muted">
          Current spendable balance: <span className="font-semibold text-green-primary">{spendableBalance} CLB</span>
        </p>
      </div>

      {/* ── Credentials / Badges / Certificate tabs ── */}
      <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-6">
        {/* Tab switcher */}
        <div className="flex gap-1 mb-5 p-1 rounded-lg bg-gray-100 dark:bg-dark-surface w-fit">
          {[
            { id: "credentials", label: "Skill Tiers" },
            { id: "badges",      label: "Badges" },
            { id: "certificate", label: "Certificate" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-white dark:bg-dark-card text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Credentials tab — Skill Tier Roadmap ── */}
        {activeTab === "credentials" && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 dark:text-dark-muted mb-3">
              Your rank is based on <span className="font-semibold text-gray-700 dark:text-dark-text">lifetime CLB earned</span> — spending CLB at the cafeteria never affects your tier.
            </p>
            {SKILL_TIERS.map((t) => {
              const unlocked = totalEarned >= t.minCredits;
              const isCurrent = t.id === tier.id;
              return (
                <div
                  key={t.id}
                  className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
                    isCurrent
                      ? `${t.bg} ${t.border} ring-2 ring-offset-1 ring-offset-transparent ${t.border}`
                      : unlocked
                      ? `${t.bg} ${t.border} opacity-70`
                      : "bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-dark-border opacity-40"
                  }`}
                >
                  <span className="text-2xl w-8 text-center">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${unlocked ? t.color : "text-gray-400 dark:text-dark-muted"}`}>
                        {t.title}
                      </p>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-black/20 text-gray-600 dark:text-gray-300">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 dark:text-dark-muted">{t.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${unlocked ? t.color : "text-gray-400"}`}>
                      {t.minCredits} CLB
                    </p>
                    {unlocked && <CheckCircleIcon className={`w-4 h-4 ml-auto mt-0.5 ${t.color}`} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Badges tab ── */}
        {activeTab === "badges" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                Earn badges through creative achievements. They appear on your profile card across the platform.
              </p>
              <span className="text-xs font-semibold text-gray-400 dark:text-dark-muted shrink-0 ml-3">
                {getEarnedBadges(userData).length}/{BADGES.length} earned
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 relative">
              {BADGES.map((badge) => {
                const earned = badge.check(userData);
                return (
                  <div
                    key={badge.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all cursor-pointer hover:shadow-lg ${
                      earned
                        ? `${badge.bg} ${badge.border} badge-glow-${badge.rarity}`
                        : "bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-dark-border opacity-50"
                    }`}
                    onMouseEnter={(e) => {
                      if (earned) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoverBadge(badge);
                        setHoverPos({ x: rect.right + 10, y: rect.top });
                      }
                    }}
                    onMouseLeave={() => setHoverBadge(null)}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      earned ? badge.bg : "bg-gray-100 dark:bg-dark-border"
                    }`}>
                      {earned
                        ? <badge.Icon className={`w-5 h-5 ${badge.color}`} />
                        : <LockClosedIcon className="w-4 h-4 text-gray-400 dark:text-dark-muted" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${earned ? badge.color : "text-gray-400 dark:text-dark-muted"}`}>
                          {badge.title}
                        </p>
                        {earned && <CheckCircleIcon className={`w-3.5 h-3.5 shrink-0 ${badge.color}`} />}
                      </div>
                      <p className="text-[11px] text-gray-400 dark:text-dark-muted truncate">
                        {earned ? badge.description : badge.criteria}
                      </p>
                      <p className={`text-[10px] font-semibold mt-0.5 ${RARITY_COLORS[badge.rarity]}`}>
                        {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* ── Badge Hover Card ── */}
              {hoverBadge && (
                <div
                  className="fixed z-50 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-2xl p-6 w-64 pointer-events-none"
                  style={{
                    left: `${Math.min(hoverPos.x, window.innerWidth - 280)}px`,
                    top: `${Math.max(50, Math.min(hoverPos.y, window.innerHeight - 300))}px`,
                  }}
                >
                  {/* Shining Icon */}
                  <div className={`flex justify-center mb-4 relative`}>
                    <div className={`w-20 h-20 rounded-xl flex items-center justify-center ${hoverBadge.bg} ${hoverBadge.border} border relative overflow-hidden badge-glow-${hoverBadge.rarity}`}
                      style={{ animation: `badge-glow-${hoverBadge.rarity} 1.2s ease-in-out infinite` }}
                    >
                      <hoverBadge.Icon className={`w-12 h-12 ${hoverBadge.color} relative z-10`} />
                      {/* Moving shimmer sweep */}
                      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/25 to-transparent animate-shimmer pointer-events-none" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-bold text-center ${hoverBadge.color} mb-1`}>
                    {hoverBadge.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-dark-muted text-center mb-3">
                    {hoverBadge.description}
                  </p>

                  {/* Rarity badge */}
                  <div className="flex justify-center mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${hoverBadge.bg} ${hoverBadge.border} border ${hoverBadge.color}`}>
                      {hoverBadge.rarity.charAt(0).toUpperCase() + hoverBadge.rarity.slice(1)}
                    </span>
                  </div>

                  {/* Earned date (placeholder for now) */}
                  <p className="text-[11px] text-gray-500 dark:text-dark-muted text-center">
                    ✓ Earned
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Certificate tab ── */}
        {activeTab === "certificate" && (
          <>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  🎓 Downloadable Certificate
                </h2>
                <p className="text-sm text-gray-500 dark:text-dark-muted mt-1">
                  Generate a signed PNG certificate showing your rank and credentials.
                  Share it on LinkedIn, attach it to your CV, or show it to your employer.
                </p>
              </div>

              {canDownload ? (
                <button
                  onClick={handleDownload}
                  disabled={generating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-primary text-dark-bg font-semibold hover:bg-green-dark transition-colors disabled:opacity-60 shrink-0"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {generating ? "Generating…" : "Download Certificate"}
                </button>
              ) : (
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400 dark:text-dark-muted">Requires 50 CLB earned to unlock</p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-dark-text mt-0.5">{50 - totalEarned} CLB away</p>
                </div>
              )}
            </div>

            {/* Certificate preview card */}
            <div className={`mt-5 rounded-lg border-2 border-dashed p-6 text-center transition-all ${
              canDownload
                ? "border-green-primary/30 bg-green-primary/5"
                : "border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface opacity-50"
            }`}>
              <div className="inline-flex flex-col items-center gap-2">
                <span className="text-4xl">{tier.icon}</span>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{displayName}</p>
                <p className={`text-sm font-semibold ${tier.color}`}>{tier.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400 dark:text-dark-muted">
                  <span>{totalEarned} CLB Earned (Lifetime)</span>
                  <span>·</span>
                  <span>{completedCount} Challenge{completedCount !== 1 ? "s" : ""} Solved</span>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-dark-muted mt-1">Issued by CrediLab Platform</p>
              </div>
            </div>

            {!canDownload && (
              <p className="mt-3 text-xs text-center text-gray-400 dark:text-dark-muted">
                Complete your first challenge to earn 50 CLB and unlock the certificate.
              </p>
            )}

            {/* Verify link */}
            {verifyUrl && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-dark-text flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-green-primary" />
                  Verification Link
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={verifyUrl}
                    className="flex-1 text-xs font-mono px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border text-gray-500 dark:text-dark-muted truncate outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 rounded-lg bg-green-primary/10 text-green-primary text-xs font-semibold hover:bg-green-primary/20 transition-colors shrink-0"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 dark:text-dark-muted">
                  Share this link so anyone can verify your certificate without logging in.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
