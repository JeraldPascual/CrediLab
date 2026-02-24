import { useState } from "react";
import { XMarkIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function MobileWarningBanner() {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    const dismissed = sessionStorage.getItem("credilab-mobile-dismissed");
    if (dismissed) return false;
    return window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
  });

  function dismiss() {
    setShow(false);
    sessionStorage.setItem("credilab-mobile-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800/40 px-4 py-3">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <ComputerDesktopIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <span className="font-semibold">Best on desktop.</span>{" "}
            CrediLab&apos;s code editor and dashboard are optimized for laptop/desktop screens.
          </p>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 p-1 rounded-md hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
          aria-label="Dismiss"
        >
          <XMarkIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </button>
      </div>
    </div>
  );
}
