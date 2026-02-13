import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

export default function LandingPage() {
  const { dark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg">
      {/* ── Header ── */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-gray-100 dark:border-dark-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-green-primary">CrediLab</span>
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-dark-muted">
            Learn to earn.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <main className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="space-y-8">
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary">
              Decentralized Learning Platform
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
              Earn Crypto by{" "}
              <span className="text-green-primary">Solving Code</span>{" "}
              Challenges
            </h1>
            <p className="text-lg text-gray-600 dark:text-dark-muted max-w-lg">
              CrediLab is a decentralized coding assessment platform where
              students earn CLB tokens by completing Java programming
              challenges. Learn, code, and earn — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark transition-colors"
              >
                Start learning now
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-green-primary hover:text-green-primary transition-colors"
              >
                I have an account
              </Link>
            </div>
          </div>

          {/* Right — UI Mockup / Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Mock card stack */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-green-primary/10 rotate-3" />
              <div className="relative bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-auto text-xs text-gray-400 dark:text-dark-muted font-mono">
                    Challenge.java
                  </span>
                </div>
                <pre className="text-sm font-mono text-gray-700 dark:text-dark-text leading-relaxed">
{`public class Challenge {
  public static int solve(int n) {
    if (n <= 1) return n;
    return solve(n - 1)
         + solve(n - 2);
  }
}`}
                </pre>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-dark-muted">
                    Fibonacci Sequence
                  </span>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-green-primary/20 text-green-primary">
                    +50 CLB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Features Strip ── */}
      <section className="border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 grid sm:grid-cols-3 gap-10">
          <FeatureCard
            title="Java Challenges"
            description="Solve curated coding problems assessed automatically using Judge0."
            icon={CodeBracketIcon}
          />
          <FeatureCard
            title="Earn CLB Tokens"
            description="Correct solutions earn you CLB tokens on the Ethereum blockchain."
            icon={CurrencyDollarIcon}
          />
          <FeatureCard
            title="Track Progress"
            description="Leaderboard, credits, and wallet integration — all in your dashboard."
            icon={ChartBarIcon}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-dark-border px-8 md:px-16 py-8 text-center text-sm text-gray-400 dark:text-dark-muted">
        © {new Date().getFullYear()} CrediLab — BulSU Hackathon Project
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="flex gap-5 items-start p-4 rounded-xl">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
