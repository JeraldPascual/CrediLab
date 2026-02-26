/**
 * TierFrame — animated decorative ring around avatars based on skill tier.
 *
 * Design philosophy: Each tier should be INSTANTLY distinguishable at a glance.
 * Instead of similar conic-gradient rings, each tier uses a unique visual motif:
 *
 *   novice       → thin dashed border, no animation (clean, minimal)
 *   apprentice   → solid ring with a slow breathing glow
 *   junior       → double-ring with rotating chase light
 *   intermediate → segmented arc ring with pulsing segments
 *   advanced     → triple layered glow with orbiting energy sparks
 *   expert       → gold fire ring with sparkle corona + crown jewel
 *
 * Sizes: "xs" | "sm" | "md" | "lg"
 */

const SIZE_MAP = {
  xs: { outer: "w-10 h-10",  ring: 2,   avatar: 32, spark: 4  },
  sm: { outer: "w-12 h-12",  ring: 2.5, avatar: 40, spark: 5  },
  md: { outer: "w-14 h-14",  ring: 3,   avatar: 48, spark: 6  },
  lg: { outer: "w-24 h-24",  ring: 4,   avatar: 80, spark: 8  },
};

/* ── Tier visual configs ─────────────────────────────────────────────────── */
const TIERS = {
  novice: {
    colors: ["#9ca3af", "#d1d5db"],
    shadow: "0 0 0 transparent",
    label: "Novice",
  },
  apprentice: {
    colors: ["#60a5fa", "#38bdf8", "#3b82f6"],
    shadow: "0 0 10px rgba(96,165,250,0.35)",
    label: "Apprentice",
  },
  junior: {
    colors: ["#818cf8", "#a78bfa", "#6366f1"],
    shadow: "0 0 14px rgba(129,140,248,0.4)",
    label: "Junior",
  },
  intermediate: {
    colors: ["#c084fc", "#e879f9", "#a855f7"],
    shadow: "0 0 16px rgba(192,132,252,0.45)",
    label: "Intermediate",
  },
  advanced: {
    colors: ["#34d399", "#5eead4", "#22c55e"],
    shadow: "0 0 20px rgba(52,211,153,0.5)",
    label: "Advanced",
  },
  expert: {
    colors: ["#fbbf24", "#fde68a", "#f97316", "#fbbf24"],
    shadow: "0 0 28px rgba(251,191,36,0.6)",
    label: "Expert",
  },
};

export default function TierFrame({ tier, size = "sm", children, className = "" }) {
  const tierId = typeof tier === "string" ? tier : tier?.id || "novice";
  const config = TIERS[tierId] || TIERS.novice;
  const dim = SIZE_MAP[size] || SIZE_MAP.sm;
  const isDetailed = size === "lg" || size === "md";
  const outerPx = parseInt(dim.outer.match(/\d+/)?.[0] || 48) * 4;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${dim.outer} ${className}`}
      style={{ minWidth: outerPx / 4, minHeight: outerPx / 4 }}
    >
      {/* SVG ring layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`tg-${tierId}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            {config.colors.map((c, i) => (
              <stop key={i} offset={`${(i / (config.colors.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </linearGradient>

          {/* Animated rotating gradient for advanced+ */}
          {(tierId === "advanced" || tierId === "expert") && (
            <linearGradient id={`tg-rot-${tierId}`} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              {config.colors.map((c, i) => (
                <stop key={i} offset={`${(i / (config.colors.length - 1)) * 100}%`} stopColor={c} stopOpacity="0.3" />
              ))}
            </linearGradient>
          )}
        </defs>

        {/* ── NOVICE: thin dashed ring ── */}
        {tierId === "novice" && (
          <circle
            cx="50" cy="50" r="46"
            stroke={config.colors[0]}
            strokeWidth={dim.ring}
            strokeDasharray="4 3"
            opacity="0.6"
          />
        )}

        {/* ── APPRENTICE: solid ring with breathing glow ── */}
        {tierId === "apprentice" && (
          <>
            <circle cx="50" cy="50" r="46" stroke={config.colors[0]} strokeWidth={dim.ring} opacity="0.2" />
            <circle
              cx="50" cy="50" r="46"
              stroke={`url(#tg-${tierId})`}
              strokeWidth={dim.ring}
              className="animate-[tier-breathe_3s_ease-in-out_infinite]"
            />
          </>
        )}

        {/* ── JUNIOR: double ring with rotating chase light ── */}
        {tierId === "junior" && (
          <>
            <circle cx="50" cy="50" r="46" stroke={config.colors[2]} strokeWidth={dim.ring * 0.5} opacity="0.15" />
            <circle cx="50" cy="50" r="46" stroke={`url(#tg-${tierId})`} strokeWidth={dim.ring} />
            <circle cx="50" cy="50" r="42" stroke={config.colors[1]} strokeWidth={dim.ring * 0.4} opacity="0.25" />
            {/* Chase light arc */}
            <circle
              cx="50" cy="50" r="46"
              stroke={config.colors[1]}
              strokeWidth={dim.ring * 1.2}
              strokeDasharray="30 259"
              strokeLinecap="round"
              opacity="0.6"
              className="animate-[tier-chase_3s_linear_infinite] origin-center"
            />
          </>
        )}

        {/* ── INTERMEDIATE: segmented arcs with pulsing glow ── */}
        {tierId === "intermediate" && (
          <>
            <circle cx="50" cy="50" r="46" stroke={config.colors[2]} strokeWidth={dim.ring * 0.4} opacity="0.1" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx="50" cy="50" r="46"
                stroke={config.colors[i % config.colors.length]}
                strokeWidth={dim.ring}
                strokeDasharray="40 248"
                strokeDashoffset={-angle * (289 / 360)}
                strokeLinecap="round"
                className="animate-[tier-segment-pulse_2.5s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.4}s` }}
              />
            ))}
          </>
        )}

        {/* ── ADVANCED: triple glow layers + orbiting sparks ── */}
        {tierId === "advanced" && (
          <>
            <circle cx="50" cy="50" r="47" stroke={config.colors[0]} strokeWidth={dim.ring * 2} opacity="0.08"
              className="animate-[tier-breathe_2s_ease-in-out_infinite]" />
            <circle cx="50" cy="50" r="46" stroke={`url(#tg-${tierId})`} strokeWidth={dim.ring} />
            <circle cx="50" cy="50" r="44" stroke={config.colors[1]} strokeWidth={dim.ring * 0.5} opacity="0.3" />
            {/* Rotating arc overlay */}
            <circle cx="50" cy="50" r="46"
              stroke={config.colors[1]} strokeWidth={dim.ring * 0.8}
              strokeDasharray="20 269" strokeLinecap="round" opacity="0.5"
              className="animate-[tier-chase_2.5s_linear_infinite] origin-center" />
            {/* Orbiting sparks */}
            {isDetailed && [0, 90, 180, 270].map((angle, i) => (
              <circle key={i} r={dim.spark / 4}
                fill={config.colors[i % config.colors.length]}
                className="animate-[tier-orbit_3s_linear_infinite] origin-center"
                style={{ animationDelay: `${i * 0.75}s`, offsetPath: "path('M50,4 A46,46 0 1,1 49.99,4')", offsetDistance: `${angle / 3.6}%` }}
              >
                <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.375}s`} />
              </circle>
            ))}
          </>
        )}

        {/* ── EXPERT: gold fire ring with sparkle corona ── */}
        {tierId === "expert" && (
          <>
            {/* Outer fire glow */}
            <circle cx="50" cy="50" r="48" stroke={config.colors[1]} strokeWidth={dim.ring * 3} opacity="0.06"
              className="animate-[tier-breathe_1.5s_ease-in-out_infinite]" />
            <circle cx="50" cy="50" r="47" stroke={config.colors[0]} strokeWidth={dim.ring * 1.5} opacity="0.12"
              className="animate-[tier-breathe_2s_ease-in-out_infinite]" />
            {/* Main ring */}
            <circle cx="50" cy="50" r="46" stroke={`url(#tg-${tierId})`} strokeWidth={dim.ring * 1.2} />
            {/* Inner accent */}
            <circle cx="50" cy="50" r="43" stroke={config.colors[1]} strokeWidth={dim.ring * 0.3} opacity="0.25" />
            {/* Two counter-rotating chase arcs */}
            <circle cx="50" cy="50" r="46"
              stroke={config.colors[1]} strokeWidth={dim.ring}
              strokeDasharray="25 264" strokeLinecap="round" opacity="0.7"
              className="animate-[tier-chase_2s_linear_infinite] origin-center" />
            <circle cx="50" cy="50" r="46"
              stroke={config.colors[2]} strokeWidth={dim.ring * 0.6}
              strokeDasharray="15 274" strokeLinecap="round" opacity="0.5"
              className="animate-[tier-chase-reverse_3s_linear_infinite] origin-center" />
            {/* Sparkle corona */}
            {isDetailed && [0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const r = 46;
              const cx = 50 + r * Math.cos(rad);
              const cy = 50 + r * Math.sin(rad);
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={dim.spark / 3.5}
                    fill={config.colors[i % config.colors.length]}
                    className="animate-[tier-sparkle_1.8s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.225}s` }} />
                </g>
              );
            })}
          </>
        )}
      </svg>

      {/* Ambient glow (non-novice) */}
      {tierId !== "novice" && (
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: config.shadow }}
        />
      )}

      {/* Content (avatar) */}
      <div className="relative z-10 rounded-full bg-white dark:bg-dark-bg">
        {children}
      </div>

      {/* Expert crown */}
      {tierId === "expert" && isDetailed && (
        <span
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 animate-[tier-sparkle_2s_ease-in-out_infinite]"
          style={{ fontSize: size === "lg" ? "14px" : "10px" }}
        >
          👑
        </span>
      )}
    </div>
  );
}
