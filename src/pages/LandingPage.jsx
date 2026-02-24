import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

export default function LandingPage() {
  const { dark, toggleDark } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg">
      {/* ── Header ── */}
      <header className="w-full border-b border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-5 flex items-center justify-between">
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
        </div>
      </header>

      {/* ── Hero Section ── */}
      <HeroSpotlight />

      {/* ── Features Strip ── */}
      <section className="border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need to <span className="text-green-primary">Learn & Earn</span>
            </h2>
            <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
              CrediLab combines coding education, blockchain rewards, and community-driven learning into one seamless platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Java Challenges"
              description="21 curated problems across Easy, Medium, and Hard tiers — auto-assessed in real-time using Judge0."
              icon={CodeBracketIcon}
            />
            <FeatureCard
              title="Earn CLB Tokens"
              description="Correct solutions earn CLB tokens transferred directly to your MetaMask wallet on the Sepolia testnet."
              icon={CurrencyDollarIcon}
            />
            <FeatureCard
              title="Leaderboard & Rankings"
              description="Compete with peers on the live leaderboard. Climb tiers from Bronze to Diamond based on your CLB earnings."
              icon={ChartBarIcon}
            />
            <FeatureCard
              title="Community Voting"
              description="Submit weekly SDG tasks and get community-validated through Reddit-style upvotes. Top posts earn bonus CLB."
              icon={UserGroupIcon}
            />
            <FeatureCard
              title="Wallet Integration"
              description="Connect MetaMask on desktop or mobile. View your on-chain balance, transaction history, and token status."
              icon={ShieldCheckIcon}
            />
            <FeatureCard
              title="Achievement System"
              description="Unlock skill-based achievements as you progress. Track your growth from beginner to expert coder."
              icon={SparklesIcon}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="border-t border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-lg mx-auto">
              From sign-up to earning tokens — it's simple, transparent, and decentralized.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create an Account", desc: "Sign up with your email and set up your student profile in seconds." },
              { step: "02", title: "Connect Wallet", desc: "Install MetaMask and link your wallet to receive CLB tokens on-chain." },
              { step: "03", title: "Solve Challenges", desc: "Pick a Java problem, write your solution, and submit it for auto-grading." },
              { step: "04", title: "Earn & Track", desc: "Correct solutions earn CLB. Track rewards, rank up, and compete on the leaderboard." },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-green-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-primary">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multi-Platform Endorsement ── */}
      <section className="border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent">
                Multi-Platform
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Available on <span className="text-green-primary">Web</span> &{" "}
                <span className="text-green-primary">Mobile</span>
              </h2>
              <p className="text-gray-600 dark:text-dark-muted leading-relaxed">
                CrediLab delivers a seamless experience across platforms. Use the full-featured
                web application for coding challenges and in-depth analytics, or switch to the
                mobile companion app for on-the-go wallet management, quick SDG task submissions,
                and community engagement.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-green-primary/10 flex items-center justify-center shrink-0">
                    <ComputerDesktopIcon className="w-4 h-4 text-green-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Web Application</p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                      Full IDE, code editor with syntax highlighting, leaderboard, achievements, and complete dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-green-primary/10 flex items-center justify-center shrink-0">
                    <DevicePhoneMobileIcon className="w-4 h-4 text-green-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Mobile App (Android)</p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                      Built with Kotlin — manage your wallet, submit weekly SDG tasks with photos, and track CLB on the go.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-green-primary/10 flex items-center justify-center shrink-0">
                    <GlobeAltIcon className="w-4 h-4 text-green-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Shared Blockchain Layer</p>
                    <p className="text-xs text-gray-500 dark:text-dark-muted">
                      Both platforms connect to the same Sepolia smart contract — your CLB balance syncs everywhere.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                {/* Desktop mockup */}
                <div className="w-72 h-48 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-4 shadow-lg">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="ml-auto text-[10px] text-gray-400 font-mono">credilab.vercel.app</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-green-primary/20 rounded" />
                    <div className="h-2 w-full bg-gray-100 dark:bg-dark-surface rounded" />
                    <div className="h-2 w-4/5 bg-gray-100 dark:bg-dark-surface rounded" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-6 w-16 bg-green-primary/30 rounded text-[8px] font-bold text-green-primary flex items-center justify-center">+50 CLB</div>
                      <div className="h-6 w-16 bg-gray-100 dark:bg-dark-surface rounded" />
                    </div>
                  </div>
                </div>
                {/* Mobile mockup overlapping */}
                <div className="absolute -bottom-6 -right-6 w-28 h-48 rounded-2xl bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border p-2 shadow-xl">
                  <div className="w-8 h-1 bg-gray-300 dark:bg-dark-border rounded-full mx-auto mb-2" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-12 bg-green-primary/20 rounded" />
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-dark-surface rounded" />
                    <div className="h-1.5 w-3/4 bg-gray-100 dark:bg-dark-surface rounded" />
                    <div className="h-8 w-full bg-green-primary/10 rounded-lg mt-2 flex items-center justify-center">
                      <span className="text-[7px] font-bold text-green-primary">250 CLB</span>
                    </div>
                    <div className="h-6 w-full bg-gray-50 dark:bg-dark-surface rounded" />
                    <div className="h-6 w-full bg-gray-50 dark:bg-dark-surface rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SDG Alignment ── */}
      <section className="border-t border-gray-100 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 text-center">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent mb-4">
            UN Sustainable Development Goals
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Learning with <span className="text-green-primary">Purpose</span>
          </h2>
          <p className="text-gray-500 dark:text-dark-muted max-w-2xl mx-auto mb-10">
            CrediLab integrates weekly SDG-aligned tasks that encourage students to take
            real-world action — from tree planting to community clean-ups — validated by
            peer voting and rewarded with CLB tokens.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: "🌳", label: "SDG 15", desc: "Life on Land" },
              { icon: "🎓", label: "SDG 4", desc: "Quality Education" },
              { icon: "💡", label: "SDG 9", desc: "Innovation" },
              { icon: "🤝", label: "SDG 17", desc: "Partnerships" },
            ].map((sdg) => (
              <div key={sdg.label} className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card p-4 space-y-1">
                <span className="text-2xl">{sdg.icon}</span>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{sdg.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-dark-muted">{sdg.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-gray-100 dark:border-dark-border bg-emerald-50/60 dark:bg-green-primary/5">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Ready to Start Earning?
          </h2>
          <p className="text-gray-500 dark:text-dark-muted max-w-lg mx-auto">
            Join CrediLab today, solve your first Java challenge, and earn CLB tokens
            on the blockchain. It&apos;s free to start.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark transition-colors"
          >
            Create Free Account
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-dark-border px-8 md:px-16 py-8 text-center text-sm text-gray-400 dark:text-dark-muted">
        © {new Date().getFullYear()} CrediLab — BulSU Hackathon Project
      </footer>
    </div>
  );
}

function HeroSpotlight() {
  const containerRef = useRef(null);
  const spotlightRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !spotlightRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(0,230,130,0.12), transparent 60%)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = "transparent";
    }
  }, []);

  return (
    <main
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex-1 flex items-center overflow-hidden"
    >
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-100"
      />

      {/* Grid pattern — light mode (black lines) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgb(0 0 0) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Grid pattern — dark mode (white lines) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 dark:opacity-[0.08] hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-16 grid md:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div className="space-y-7">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent">
            Decentralized Learning Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Earn Crypto by{" "}
            <span className="text-green-primary">Solving Code</span>{" "}
            Challenges
          </h1>
          <p className="text-lg text-gray-600 dark:text-dark-muted max-w-lg">
            A blockchain-powered coding platform where students solve Java
            challenges, earn CLB tokens on the Ethereum Sepolia testnet, and
            build real-world programming skills — bridging education with
            Web3 technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
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

        {/* Right — Code card */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl bg-emerald-100 dark:bg-green-primary/10 rotate-3" />
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
                <span className="px-2 py-1 text-xs font-semibold rounded bg-emerald-100 dark:bg-green-primary/20 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent">
                  +50 CLB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="flex gap-4 items-start p-5 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-green-primary/30 transition-colors">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 dark:bg-green-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-primary" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-dark-muted leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
