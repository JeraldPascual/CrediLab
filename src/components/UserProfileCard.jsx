import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getSkillTier } from "../data/achievements";
import { getEarnedBadges } from "../data/badges";
import TierFrame from "./TierFrame";

/**
 * UserProfileCard — Hoverable popup card showing a student's profile.
 *
 * Usage:
 *   <UserProfileCard uid="abc123" name="John" photoURL="..." />
 *
 * Shows on hover:
 *   - Avatar + display name
 *   - Skill tier badge
 *   - CLB earned (lifetime)
 *   - Earned badges (icons)
 *   - Challenges completed count
 */

// Cache user data with TTL to avoid stale badge renders
const userCache = new Map();
const CACHE_TTL_MS = 30_000; // 30 seconds — short enough to reflect new badges

export default function UserProfileCard({ uid, name, photoURL, children }) {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: "above" });
  const timeoutRef = useRef(null);
  const anchorRef = useRef(null);

  async function fetchProfile() {
    if (!uid) return;
    const cached = userCache.get(uid);
    if (cached && Date.now() - cached._ts < CACHE_TTL_MS) { setProfile(cached); return; }
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data();
        const profileData = {
          displayName: data.displayName
            || `${data.firstName || ""} ${data.lastName || ""}`.trim()
            || name || "Anonymous",
          photoURL: data.photoURL || photoURL || null,
          totalCLBEarned: data.totalCLBEarned ?? data.credits ?? 0,
          completedChallenges: data.completedChallenges?.length || 0,
          tier: getSkillTier(data.totalCLBEarned ?? data.credits ?? 0),
          badges: getEarnedBadges(data),
        };
        profileData._ts = Date.now();
        userCache.set(uid, profileData);
        setProfile(profileData);
      }
    } catch (err) {
      console.warn("[UserProfileCard] Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  function computePos() {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const CARD_WIDTH = 256;
    const CARD_EST_HEIGHT = 260; // generous estimate so we don't clip
    const GAP = 8;

    // Center horizontally, clamped to viewport
    let left = rect.left + rect.width / 2 - CARD_WIDTH / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - CARD_WIDTH - 8));

    // Flip below when there isn't enough room above
    const spaceAbove = rect.top;
    const placement = spaceAbove >= CARD_EST_HEIGHT + GAP ? "above" : "below";

    const top = placement === "above"
      ? rect.top + window.scrollY - GAP          // card sits above; translateY(-100%) moves it up
      : rect.bottom + window.scrollY + GAP;       // card sits below; no transform needed

    setPos({ top, left, placement });
  }

  function handleMouseEnter() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      computePos();
      setShow(true);
      fetchProfile();
    }, 250);
  }

  function handleMouseLeave() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const card = show ? (
    <div
      style={{
        position: "absolute",
        top: pos.top,
        left: pos.left,
        transform: pos.placement === "above" ? "translateY(-100%)" : "translateY(0)",
        width: 256,
        zIndex: 9999,
      }}
      onMouseEnter={() => clearTimeout(timeoutRef.current)}
      onMouseLeave={() => { timeoutRef.current = setTimeout(() => setShow(false), 150); }}
    >
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl shadow-2xl p-4 space-y-3">
        {loading && !profile ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-4 h-4 border-2 border-green-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profile ? (
          <>
            {/* Header: Avatar + Name + Tier */}
            <div className="flex items-center gap-3">
              <TierFrame tier={profile.tier} size="md">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={profile.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-primary/30 to-emerald-400/30 flex items-center justify-center text-lg font-bold text-green-primary">
                    {(profile.displayName || "?")[0].toUpperCase()}
                  </div>
                )}
              </TierFrame>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {profile.displayName}
                </p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${profile.tier.bg} ${profile.tier.color}`}>
                  {profile.tier.icon} {profile.tier.shortTitle}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <p className="text-lg font-bold text-green-primary">{profile.totalCLBEarned}</p>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted">CLB Earned</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{profile.completedChallenges}</p>
                <p className="text-[10px] text-gray-400 dark:text-dark-muted">Challenges</p>
              </div>
            </div>

            {/* Badges — icons only, no label */}
            {profile.badges.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider mb-2">
                  Badges
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.badges.slice(0, 12).map((badge) => (
                    <span
                      key={badge.id}
                      title={`${badge.title} · ${badge.criteria}`}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${badge.bg} ${badge.border} border cursor-default badge-tile-shimmer badge-glow-${badge.rarity}`}
                    >
                      {badge.Icon && <badge.Icon className={`w-5 h-5 ${badge.color}`} />}
                    </span>
                  ))}
                  {profile.badges.length > 12 && (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-surface text-[10px] font-bold text-gray-400 dark:text-dark-muted">
                      +{profile.badges.length - 12}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">Profile unavailable</p>
        )}

        {/* Arrow pointing toward the anchor */}
        {pos.placement === "above" ? (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0"
            style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid" }}
          />
        ) : (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0 h-0"
            style={{ borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderBottom: "8px solid" }}
          />
        )}
      </div>
    </div>
  ) : null;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={anchorRef}
    >
      {children}
      {show && createPortal(card, document.body)}
    </div>
  );
}

/** Invalidate cache for a specific user (call after name/profile changes) */
export function invalidateUserCache(uid) {
  userCache.delete(uid);
}

/** Clear entire user cache */
export function clearUserCache() {
  userCache.clear();
}
