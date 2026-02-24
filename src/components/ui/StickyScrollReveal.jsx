import React, { useRef, useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { useMotionValueEvent, useScroll, motion } from "motion/react";

/**
 * Viewport-scroll-driven sticky reveal.
 * Each content item fades in/out as the user scrolls the page.
 * No internal scrollable container — hooks into the window scroll via `target`.
 */
export function StickyScroll({ content, contentClassName = "" }) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);

  // Track this section's position relative to the viewport
  // offset accounts for sticky header (~72px) so text highlights correctly
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.15", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const linearGradients = useMemo(
    () => [
      "linear-gradient(to bottom right, #00e89f, #10b981)",
      "linear-gradient(to bottom right, #06b6d4, #00e89f)",
      "linear-gradient(to bottom right, #00e89f, #059669)",
    ],
    []
  );

  const backgroundGradient =
    linearGradients[activeCard % linearGradients.length];

  return (
    <div ref={ref} className="relative flex justify-between gap-10">
      {/* Left — text blocks spaced out so scrolling reveals them */}
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20 first:mt-0 scroll-mt-24">
              <motion.h2
                initial={{ opacity: 0.3 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.35 }}
                className="text-2xl font-bold text-gray-900 dark:text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0.3 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.35 }}
                className="text-base mt-6 max-w-sm text-gray-600 dark:text-slate-300 leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-20" />
        </div>
      </div>

      {/* Right — sticky gradient pane (desktop only) */}
      <div
        style={{ background: backgroundGradient }}
        className={`sticky top-24 hidden h-60 w-80 shrink-0 overflow-hidden rounded-xl lg:flex items-center justify-center transition-[background] duration-500 ${contentClassName}`}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </div>
  );
}
