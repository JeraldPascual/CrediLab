import { useRef, useCallback } from "react";
import { Link, Navigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { useScroll, useTransform, motion, useInView } from "motion/react";
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
import { useAuth } from "../context/AuthContext";
import { StickyScroll } from "../components/ui/StickyScrollReveal";
import { CanvasText } from "../components/ui/CanvasText";

export default function LandingPage() {
  const { dark, toggleDark } = useTheme();
  const { user, loading } = useAuth();

  /* ── Refs for smooth scroll targets ── */
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Parallax: hero fades / scales as user scrolls into features ── */
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.8], [1, 0.96]);
  const heroBlur = useTransform(heroProgress, [0, 0.8], [0, 8]);
  const heroFilter = useTransform(heroBlur, (v) => `blur(${v}px)`);

  // Redirect logged-in users to dashboard (after all hooks)
  if (!loading && user) {
    return <Navigate to="/student" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg">
      {/* ── Header — pill floating nav (Unflustered-style) ── */}
      <header className="sticky top-0 z-50 w-full flex justify-center pt-4 pb-2 px-4">
        {/* Pill container */}
        <div className="w-full max-w-4xl flex items-center justify-between gap-6 px-7 py-3.5 rounded-full bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-gray-200 dark:border-dark-border shadow-sm shadow-gray-200/60 dark:shadow-black/30 transition-colors">

          {/* ── Brand + slogan ── */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={scrollToTop}
              className="text-lg font-bold tracking-tight text-green-primary hover:opacity-80 transition-opacity"
            >
              CrediLab.
            </button>
            <span className="hidden md:inline text-[11px] font-medium text-gray-400 dark:text-dark-muted border-l border-gray-200 dark:border-dark-border pl-2">
              Learn to Earn
            </span>
          </div>

          {/* ── Centre nav ── */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={scrollToFeatures}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            >
              Everything You Need
            </button>
            <button
              onClick={scrollToHowItWorks}
              className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            >
              How it works
            </button>
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-1.5 rounded-full text-gray-500 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
            </button>

            {/* Log in */}
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-dark-text hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
            >
              Log in
            </Link>

            {/* Get started — matches existing landing page CTA button style */}
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark shadow-[2px_2px_0px_0px] shadow-green-dark/60 hover:shadow-[1px_1px_0px_0px] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all duration-150"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (parallax: fades + scales on scroll) ── */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, filter: heroFilter }}
        className="relative"
      >
        <HeroSpotlight />
      </motion.div>

      {/* ── Features ── */}
      <section ref={featuresRef} className="relative z-10 bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <FadeUp className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need to <span className="text-green-primary">Learn & Earn</span>
            </h2>
            <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-xl mx-auto">
              CrediLab combines coding education, blockchain-verified rewards, and SDG-driven community action into one seamless platform.
            </p>
          </FadeUp>

          {/* Desktop: sticky scroll reveal */}
          <div className="hidden md:block">
            <StickyScroll
              content={[
                {
                  title: "Java Challenges",
                  description:
                    "Curated problems across Easy, Medium, and Hard tiers — auto-assessed in real-time using Judge0. Write, submit, and get instant feedback in a professional code editor.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <CodeBracketIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">Code Editor</p>
                        <p className="text-sm opacity-80">40 Problems · 3 Tiers</p>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Earn CLB Tokens",
                  description:
                    "A transcript says you passed. CLB tokens prove you wrote the code. Every verified solution earns tamper-proof on-chain credentials sent to your MetaMask wallet.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <CurrencyDollarIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">CLB Tokens</p>
                        <p className="text-sm opacity-80">On-Chain Rewards</p>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Leaderboard & Rankings",
                  description:
                    "Compete with peers on the live leaderboard. Climb tiers from Bronze to Diamond based on your CLB earnings.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <ChartBarIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">Leaderboard</p>
                        <p className="text-sm opacity-80">Bronze → Diamond</p>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Community Voting",
                  description:
                    "Submit weekly SDG tasks and get community-validated through Reddit-style upvotes. Top posts earn bonus CLB.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <UserGroupIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">Community</p>
                        <p className="text-sm opacity-80">Peer Validation</p>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Anti-Cheat Verified",
                  description:
                    "Focus-loss detection, DevTools blocking, and Firestore-synced violation tracking ensure every token earned is legitimate. No shortcuts — your credentials mean something.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <ShieldCheckIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">Anti-Cheat</p>
                        <p className="text-sm opacity-80">Integrity First</p>
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Achievement System",
                  description:
                    "Unlock skill-based achievements as you progress. Track your growth from beginner to expert coder.",
                  content: (
                    <div className="h-full w-full flex items-center justify-center text-white p-6">
                      <div className="text-center space-y-2">
                        <SparklesIcon className="w-10 h-10 mx-auto" />
                        <p className="font-bold text-lg">Achievements</p>
                        <p className="text-sm opacity-80">Skill Growth</p>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/* Mobile fallback: standard grid */}
          <div className="md:hidden grid gap-6">
            <FeatureCard title="Java Challenges" description="40 curated problems across Easy, Medium, and Hard tiers — auto-assessed in real-time using Judge0." icon={CodeBracketIcon} />
            <FeatureCard title="Earn CLB Tokens" description="CLB tokens prove you wrote the code. Every verified solution mints tamper-proof on-chain credentials to your MetaMask wallet." icon={CurrencyDollarIcon} />
            <FeatureCard title="Leaderboard & Rankings" description="Compete with peers on the live leaderboard. Climb tiers from Bronze to Diamond based on your CLB earnings." icon={ChartBarIcon} />
            <FeatureCard title="Community Voting" description="Submit weekly SDG tasks and get community-validated through Reddit-style upvotes. Top posts earn bonus CLB." icon={UserGroupIcon} />
            <FeatureCard title="Anti-Cheat Verified" description="Focus-loss detection, DevTools blocking, and Firestore-synced violation tracking ensure every token earned is legitimate. No shortcuts — your credentials mean something." icon={ShieldCheckIcon} />
            <FeatureCard title="Achievement System" description="Unlock skill-based achievements as you progress. Track your growth from beginner to expert coder." icon={SparklesIcon} />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section ref={howItWorksRef} id="how-it-works" className="bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <FadeUp className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-3 text-gray-500 dark:text-dark-muted max-w-lg mx-auto">
              From sign-up to earning tokens — it's simple, transparent, and verifiable on the blockchain.
            </p>
          </FadeUp>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Create an Account", desc: "Sign up with your email and set up your student profile in seconds." },
              { step: "02", title: "Connect Wallet", desc: "Install MetaMask and link your wallet to receive CLB tokens on-chain." },
              { step: "03", title: "Solve Challenges", desc: "Pick a Java problem, write your solution, and submit it for auto-grading." },
              { step: "04", title: "Earn & Track", desc: "Correct solutions earn CLB. Track rewards, rank up, and compete on the leaderboard." },
            ].map((item, i) => (
              <FadeUp key={item.step} delay={i * 0.1} className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-green-primary">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-dark-muted">{item.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Multi-Platform ── */}
      <section className="bg-slate-50 dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — text + platform list */}
            <FadeUp>
              <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary border border-green-primary/20 mb-4">
                Multi-Platform
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Available on <span className="text-green-primary">Web</span> &{" "}
                <span className="text-green-primary">Mobile</span>
              </h2>
              <p className="text-gray-500 dark:text-dark-muted mb-8">
                CrediLab delivers a seamless experience across platforms. Use the full-featured web application for coding challenges and in-depth analytics, or switch to the mobile companion app for on-the-go wallet management, quick SDG task submissions, and community engagement.
              </p>
              <div className="space-y-5">
                {[
                  { icon: ComputerDesktopIcon, title: "Web Application", desc: "Full IDE, code editor with syntax highlighting, leaderboard, achievements, and complete dashboard." },
                  { icon: DevicePhoneMobileIcon, title: "Mobile App (Android)", desc: "Built with Kotlin — manage your wallet, submit weekly SDG tasks with photos, and track CLB on the go." },
                  { icon: GlobeAltIcon, title: "Shared Blockchain Layer", desc: "Both platforms connect to the same Sepolia smart contract — your CLB balance syncs everywhere." },
                ].map((item, i) => (
                  <FadeUp key={item.title} delay={i * 0.12} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-green-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-5 h-5 text-green-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-dark-muted">{item.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </FadeUp>

            {/* Right — app mockup */}
            <FadeUp delay={0.15} className="hidden md:flex justify-center items-center">
              <div className="relative pr-24 pb-4">
                {/* Web mockup */}
                <div className="w-72 bg-dark-card border border-dark-border rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-auto text-[10px] text-dark-muted font-mono">credilab.vercel.app</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded bg-green-primary/30" />
                    <div className="h-2 w-full rounded bg-dark-border" />
                    <div className="h-2 w-3/4 rounded bg-dark-border" />
                    <div className="mt-3 inline-block px-3 py-1 text-[10px] font-bold rounded bg-green-primary/20 text-green-primary">+50 CLB</div>
                  </div>
                </div>
                {/* Mobile mockup (phone-shaped, overlapping) */}
                <div className="absolute -right-16 -top-6 w-36 h-64 bg-dark-card border-2 border-dark-border rounded-[2rem] p-2.5 shadow-xl flex flex-col">
                  {/* Dynamic island / notch */}
                  <div className="mx-auto w-10 h-2 rounded-full bg-dark-border mb-2.5" />
                  {/* Screen content — fills remaining height */}
                  <div className="bg-dark-bg rounded-2xl p-3 flex flex-col flex-1 gap-2">
                    <div className="h-2 w-20 rounded bg-green-primary/30" />
                    <div className="flex justify-center my-1">
                      <span className="px-3 py-1.5 text-[9px] font-bold rounded-xl bg-green-primary/20 text-green-primary">250 CLB</span>
                    </div>
                    <div className="h-1.5 w-full rounded bg-dark-border" />
                    <div className="h-1.5 w-5/6 rounded bg-dark-border" />
                    <div className="h-1.5 w-4/6 rounded bg-dark-border" />
                    <div className="flex-1" />
                    <div className="h-1.5 w-full rounded bg-dark-border/50" />
                    <div className="h-1.5 w-3/4 rounded bg-dark-border/50" />
                  </div>
                  {/* Home indicator */}
                  <div className="mx-auto w-12 h-1 rounded-full bg-dark-border mt-2.5" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── SDG Alignment ── */}
      <section className="bg-white dark:bg-dark-surface">
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 text-center">
          <FadeUp>
            <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary border border-green-primary/20 mb-4">
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
          </FadeUp>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: "🌳", label: "SDG 15", desc: "Life on Land", accent: "border-green-400" },
              { icon: "🎓", label: "SDG 4", desc: "Quality Education", accent: "border-purple-400" },
              { icon: "💡", label: "SDG 9", desc: "Innovation", accent: "border-yellow-400" },
              { icon: "🤝", label: "SDG 17", desc: "Partnerships", accent: "border-orange-400" },
            ].map((sdg, i) => (
              <FadeUp key={sdg.label} delay={i * 0.1} className={`rounded-xl border-2 ${sdg.accent} bg-gray-50 dark:bg-dark-card p-4 space-y-1 hover:scale-105 transition-transform`}>
                <span className="text-2xl">{sdg.icon}</span>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{sdg.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-dark-muted">{sdg.desc}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-slate-50 dark:bg-dark-bg">
        <FadeUp className="max-w-7xl mx-auto px-8 md:px-16 py-16 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Ready to{" "}
            <CanvasText
              text="Start Earning?"
              className="text-3xl md:text-5xl font-bold"
              backgroundClassName="bg-slate-50 dark:bg-dark-bg"
              colors={[
                "#00e89f",
                "#00c987",
                "#10b981",
                "#059669",
                "#06b6d4",
                "#4ecdc4",
              ]}
              animationDuration={6}
            />
          </h2>
          <p className="text-gray-500 dark:text-dark-muted max-w-lg mx-auto">
            Join CrediLab today, solve your first Java challenge, and earn verifiable
            CLB tokens on the blockchain. It&apos;s free to start.
          </p>
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark shadow-[3px_3px_0px_0px] shadow-green-dark/60 dark:shadow-green-dark/40 hover:shadow-[1px_1px_0px_0px] hover:shadow-green-dark/60 hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
          >
            Create Free Account
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </FadeUp>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white dark:bg-dark-surface px-8 md:px-16 py-8 text-center text-sm text-gray-400 dark:text-dark-muted">
        © {new Date().getFullYear()} CrediLab — BulSU Hackathon Project
      </footer>
    </div>
  );
}

/* ── Hero with spotlight + grid background ── */
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
      className="relative flex-1 flex items-center overflow-hidden -mt-20 pt-20"
    >
      {/* Spotlight overlay */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 z-0 transition-[background] duration-100"
      />

      {/* Grid pattern — light mode (with bottom fade) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.06] dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgb(0 0 0) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />
      {/* Grid pattern — dark mode (with bottom fade) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 dark:opacity-[0.08] hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 py-12 md:py-16 grid md:grid-cols-2 gap-16 items-center">
        {/* Left — Text */}
        <div className="space-y-7">
          <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-primary/10 text-green-primary border border-green-primary/20">
            Decentralized Learning Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Learn Code,{" "}
            <span className="text-green-primary">Earn Rewards</span>,{" "}
            Make Impact
          </h1>
          <p className="text-lg text-gray-600 dark:text-dark-muted max-w-lg">
            CrediLab is an SDG-aligned coding platform where students solve
            Java challenges, earn CLB tokens on the blockchain, and take
            real-world action for sustainable development — turning education
            into verifiable, on-chain credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg bg-green-primary text-dark-bg hover:bg-green-dark shadow-[3px_3px_0px_0px] shadow-green-dark/60 dark:shadow-green-dark/40 hover:shadow-[1px_1px_0px_0px] hover:shadow-green-dark/60 hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
            >
              Start learning now
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold rounded-lg border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-green-primary hover:text-green-primary shadow-[3px_3px_0px_0px] shadow-gray-300 dark:shadow-dark-border hover:shadow-green-primary/40 hover:shadow-[1px_1px_0px_0px] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-150"
            >
              I have an account
            </Link>
          </div>
        </div>

        {/* Right — Code card */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-full max-w-md">
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
    // Can you figure out the
    // pattern? 0, 1, 1, 2, 3, 5...
    // Your solution goes here
  }
}`}
              </pre>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 dark:text-dark-muted">
                  Fibonacci Sequence
                </span>
                <span className="px-2 py-1 text-xs font-semibold rounded bg-green-primary/10 text-green-primary border border-green-primary/20">
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

/* ── Feature Card (mobile fallback) ── */
/* ── Scroll-triggered fade-up wrapper ── */
function FadeUp({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FeatureCard({ title, description, icon: Icon }) {
  return (
    <div className="flex gap-4 items-start p-5 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border hover:border-green-primary/30 transition-colors">
      <div className="shrink-0 w-10 h-10 rounded-lg bg-green-primary/10 flex items-center justify-center">
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
