import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("credilab-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [liteMode, setLiteMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("credilab-lite") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (dark) {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
    localStorage.setItem("credilab-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const body = document.body;
    if (liteMode) {
      body.classList.add("lite-mode");
    } else {
      body.classList.remove("lite-mode");
    }
    localStorage.setItem("credilab-lite", liteMode.toString());
  }, [liteMode]);

  function toggleDark() {
    setDark((prev) => !prev);
  }

  function toggleLiteMode() {
    setLiteMode((prev) => !prev);
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, liteMode, toggleLiteMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
