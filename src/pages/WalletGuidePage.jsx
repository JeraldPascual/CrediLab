import { useState } from "react";
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  WalletIcon,
  LinkIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChevronDownIcon,
  TrophyIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  CircleStackIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

/* ── Accordion Item ── */
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 dark:border-dark-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-green-primary transition-colors">
          {title}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 dark:text-dark-muted leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Guide Section Component ── */
function GuideSection({ icon: Icon, title, steps }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Icon className="w-4 h-4 text-green-primary" />
          <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 dark:bg-green-primary/10 text-emerald-700 dark:text-green-primary border border-emerald-200 dark:border-transparent flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {step.title}
              </p>
              <p className="text-sm text-gray-500 dark:text-dark-muted mt-0.5 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Info Card ── */
function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <Icon className="w-4 h-4 text-green-primary" />
          <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
            {title}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3 text-sm text-gray-600 dark:text-dark-muted">
        {children}
      </div>
    </div>
  );
}

export default function WalletGuidePage() {
  const [activeSection, setActiveSection] = useState("wallet");

  const tabs = [
    { id: "wallet",   label: "Wallet Setup",     icon: WalletIcon },
    { id: "platform", label: "Platform Guide",   icon: AcademicCapIcon },
    { id: "faqs",     label: "FAQs & Help",      icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <QuestionMarkCircleIcon className="w-7 h-7 text-green-primary" />
          Help Center
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Everything you need to know about CrediLab — wallet setup, earning CLB, achievements, and more.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-dark-surface">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeSection === tab.id
                ? "bg-white dark:bg-dark-card text-green-primary shadow-sm"
                : "text-gray-500 dark:text-dark-muted hover:text-gray-700 dark:hover:text-dark-text"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ── WALLET SETUP TAB ── */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSection === "wallet" && (
        <div className="space-y-6">
          {/* Quick Overview */}
          <div className="rounded-xl border border-green-200 dark:border-green-800/40 bg-green-50/50 dark:bg-green-900/10 p-4">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">🎯 Quick Overview</p>
            <ul className="text-xs text-green-700 dark:text-green-400 space-y-1 list-disc list-inside">
              <li>CLB tokens are ERC-20 tokens on the <strong>Ethereum Sepolia testnet</strong> (no real money involved)</li>
              <li>You earn CLB by completing Java challenges and community-approved SDG tasks</li>
              <li>MetaMask is used to store your tokens and verify ownership on-chain</li>
              <li>Both the web app and mobile app connect to the same wallet address</li>
            </ul>
          </div>

          {/* ⚠️ Claim CLB Reminder — CRUCIAL */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/10">
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1.5">
              <p className="font-bold text-orange-800 dark:text-orange-300">🔔 Didn't receive your CLB? You may need to claim it manually.</p>
              <p className="text-xs text-orange-700 dark:text-orange-400">
                When you complete a challenge or win a weekly task, CLB is credited to your account but the on-chain transfer isn't always automatic. If your wallet balance didn't update:
              </p>
              <ol className="list-decimal list-inside text-xs text-orange-700 dark:text-orange-400 space-y-0.5 ml-1">
                <li>Click the <strong>user icon (👤)</strong> in the <strong>top-right corner</strong> of the header.</li>
                <li>Select <strong className="text-orange-800 dark:text-orange-300">My Account</strong> from the dropdown.</li>
                <li>Scroll down to the <strong>Wallet Connection</strong> section.</li>
                <li>Click the <strong className="text-orange-800 dark:text-orange-300">Claim CLB</strong> button to trigger the on-chain transfer.</li>
              </ol>
              <p className="text-[11px] text-orange-600 dark:text-orange-500 mt-1">
                Your pending CLB is safely stored in our system — it won't be lost. The button appears whenever there's a transferable balance waiting.
              </p>
            </div>
          </div>

          {/* Safety Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10">
            <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
              <p className="font-semibold">Important safety tips</p>
              <ul className="list-disc list-inside text-xs space-y-0.5 text-yellow-700 dark:text-yellow-400">
                <li>Never share your Secret Recovery Phrase (seed phrase) with anyone.</li>
                <li>CrediLab will <span className="font-bold">never</span> ask for your private key or seed phrase.</li>
                <li>Only download MetaMask from official sources: <span className="font-mono">metamask.io</span></li>
              </ul>
            </div>
          </div>

          {/* Desktop Guide */}
          <GuideSection
            icon={ComputerDesktopIcon}
            title="Desktop / Laptop (Browser Extension)"
            steps={[
              {
                title: "Install MetaMask Extension",
                description: (
                  <>
                    Go to{" "}
                    <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-green-primary underline">
                      metamask.io/download
                    </a>{" "}
                    and click <strong>Install MetaMask for Chrome</strong> (or your browser). Supports Chrome, Firefox, Brave, and Edge.
                  </>
                ),
              },
              {
                title: "Create or Import a Wallet",
                description: "After installation, click the MetaMask fox icon in your browser toolbar. Follow the setup wizard to create a new wallet or import an existing one using your Secret Recovery Phrase.",
              },
              {
                title: "Set a Strong Password",
                description: "Choose a strong password for your MetaMask vault. This password encrypts your wallet data on this device only.",
              },
              {
                title: "Back Up Your Recovery Phrase",
                description: "MetaMask will show you a 12-word Secret Recovery Phrase. Write it down on paper and store it somewhere safe. Never store it digitally or screenshot it.",
              },
              {
                title: "Connect to CrediLab",
                description: (
                  <>
                    In CrediLab, go to{" "}
                    <strong className="text-green-primary">My Account → Connect MetaMask</strong>.
                    MetaMask will pop up asking for permission. Click <strong>Connect</strong>. Your wallet address will appear in your profile.
                  </>
                ),
              },
            ]}
          />

          {/* Mobile Guide */}
          <GuideSection
            icon={DevicePhoneMobileIcon}
            title="Mobile (Android / iOS)"
            steps={[
              {
                title: "Download MetaMask App",
                description: (
                  <>
                    Download from the{" "}
                    <a href="https://play.google.com/store/apps/details?id=io.metamask" target="_blank" rel="noopener noreferrer" className="text-green-primary underline">
                      Google Play Store
                    </a>{" "}
                    or{" "}
                    <a href="https://apps.apple.com/app/metamask/id1438144202" target="_blank" rel="noopener noreferrer" className="text-green-primary underline">
                      Apple App Store
                    </a>. Make sure the developer is "ConsenSys".
                  </>
                ),
              },
              {
                title: "Create or Import Wallet",
                description: "Open the app and choose \"Create a New Wallet\" or \"Import Using Secret Recovery Phrase\" if you already have one from your desktop.",
              },
              {
                title: "Enable Browser in MetaMask",
                description: (
                  <>
                    Tap the <strong>☰ menu</strong> in the MetaMask app, then tap <strong>Browser</strong>. Navigate to the CrediLab URL in the MetaMask built-in browser to connect your wallet.
                  </>
                ),
              },
              {
                title: "Sync with Desktop (Optional)",
                description: "If you already set up on desktop, use the same 12-word Recovery Phrase to import your wallet into the mobile app. Both devices will share the same address.",
              },
            ]}
          />

          {/* How CLB Tokens Work */}
          <InfoCard icon={ShieldCheckIcon} title="How CLB Tokens Work">
            <p><strong className="text-gray-900 dark:text-white">1.</strong> Complete coding challenges or weekly SDG tasks to earn CLB (CrediLab) credits.</p>
            <p><strong className="text-gray-900 dark:text-white">2.</strong> For coding challenges, credits are recorded instantly upon passing all test cases.</p>
            <p><strong className="text-gray-900 dark:text-white">3.</strong> For weekly SDG tasks, your submission must receive ≥3 net upvotes to qualify as Community Approved. CLB is then awarded to the top-voted submission at the end of each week.</p>
            <p><strong className="text-gray-900 dark:text-white">4.</strong> If your MetaMask wallet is connected, CLB tokens are automatically transferred on-chain via the Sepolia testnet.</p>
            <p><strong className="text-gray-900 dark:text-white">5.</strong> If CLB is still showing as "Pending on-chain" in your profile, click the <strong className="text-green-primary">Claim CLB</strong> button to trigger the on-chain transfer.</p>
            <p><strong className="text-gray-900 dark:text-white">6.</strong> To see your CLB balance in MetaMask, add it as a custom token:</p>
            <div className="ml-6 space-y-1 text-xs">
              <p>• Open MetaMask → <strong>Import tokens</strong></p>
              <p>• Network: <strong>Sepolia Testnet</strong></p>
              <p>
                • Contract address:{" "}
                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-surface text-green-primary font-mono text-[11px] break-all select-all">
                  0xBFDB5f0C96aA9E2eECA9303E71a2b28b7C09Aee4
                </code>
              </p>
              <p>• Symbol: <strong>CLB</strong> &nbsp;|&nbsp; Decimals: <strong>18</strong></p>
            </div>
          </InfoCard>

          {/* Add Sepolia Testnet */}
          <InfoCard icon={LinkIcon} title="Add Sepolia Testnet to MetaMask">
            <p>CLB tokens live on the <strong className="text-gray-900 dark:text-white">Sepolia</strong> test network. To view them in MetaMask:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
              <li>Open MetaMask and click the network dropdown (top-center).</li>
              <li>Click <strong>Show test networks</strong> (toggle it on if needed).</li>
              <li>Select <strong>Sepolia</strong> from the list.</li>
              <li>Your CLB balance will appear after importing the token (see above).</li>
            </ol>
            <p className="text-xs text-gray-400 dark:text-dark-muted pt-2 border-t border-gray-100 dark:border-dark-border">
              Sepolia ETH (for gas fees) is free — search "Sepolia faucet" to get test ETH. You don't need gas to <em>receive</em> CLB, only to send it.
            </p>
          </InfoCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ── PLATFORM GUIDE TAB ── */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSection === "platform" && (
        <div className="space-y-6">
          {/* Coding Challenges */}
          <InfoCard icon={CodeBracketIcon} title="Coding Challenges">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">How challenges work</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li>Navigate to <strong className="text-green-primary">Challenges</strong> from the sidebar to browse all available coding problems.</li>
              <li>Each challenge has a <strong>difficulty</strong> (Easy, Medium, Hard) and a <strong>CLB reward</strong> shown on the card.</li>
              <li>Click a challenge to open the coding editor. Write your Java solution in the left panel.</li>
              <li>Click <strong className="text-green-primary">Run Code</strong> to test against sample cases, or <strong className="text-green-primary">Submit</strong> to run against all hidden test cases.</li>
              <li>Pass all test cases to earn the CLB reward. You can only earn CLB once per challenge.</li>
              <li>Use the <strong>Hints</strong> button if you're stuck — there's no penalty for using hints.</li>
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                💡 <strong>Tip:</strong> Start with Easy challenges to build confidence, then progress to Medium and Hard for bigger CLB rewards.
              </p>
            </div>
          </InfoCard>

          {/* Weekly SDG Tasks */}
          <InfoCard icon={UserGroupIcon} title="Weekly SDG Tasks">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Sustainable Development Goal activities</p>
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li>Each week, a new SDG-aligned task is posted (e.g., "Document a local sustainability initiative").</li>
              <li>Go to <strong className="text-green-primary">Activities</strong> to see the current week's task and submit your response.</li>
              <li>Submissions are reviewed by the community through upvoting in the <strong className="text-green-primary">Community Feed</strong>.</li>
              <li>Once your submission reaches <strong>3 or more net upvotes</strong>, it's marked as <strong>Community Approved</strong>.</li>
              <li>At the end of each week, the approved submission with the <strong>highest vote score</strong> wins and receives CLB. Only the top submission per week is rewarded.</li>
              <li>You can vote on other students' submissions too — this helps the community and can earn you the <strong>Mentor Spirit</strong> badge.</li>
            </ul>
          </InfoCard>

          {/* How CLB Earnings Work */}
          <InfoCard icon={CircleStackIcon} title="How You Earn CLB">
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/40">
                  <p className="text-xs font-bold text-green-800 dark:text-green-300 mb-1">🧩 Coding Challenges</p>
                  <ul className="text-[11px] text-green-700 dark:text-green-400 space-y-0.5">
                    <li>• Easy: <strong>5 CLB</strong></li>
                    <li>• Medium: <strong>10 CLB</strong></li>
                    <li>• Hard: <strong>20 CLB</strong></li>
                    <li>• Credited on submission pass — may need <strong>Claim CLB</strong> if auto-transfer fails</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/40">
                  <p className="text-xs font-bold text-purple-800 dark:text-purple-300 mb-1">🌍 Weekly SDG Tasks</p>
                  <ul className="text-[11px] text-purple-700 dark:text-purple-400 space-y-0.5">
                    <li>• Reward varies per task (shown on card)</li>
                    <li>• Needs ≥3 net upvotes to qualify</li>
                    <li>• Top-voted submission wins CLB weekly</li>
                    <li>• One submission per task per student</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                <strong>Important:</strong> Your <em>rank</em> (skill tier) is based on <strong>lifetime earned CLB</strong>, not your current balance. Spending CLB at the cafeteria does <strong>not</strong> affect your rank.
              </p>
            </div>
          </InfoCard>

          {/* Skill Tiers */}
          <InfoCard icon={TrophyIcon} title="Skill Tier Progression">
            <p className="mb-3">Your skill tier reflects your coding journey. Tiers are based on total CLB earned over your lifetime.</p>
            <div className="space-y-2">
              {[
                { icon: "🌱", title: "Novice", range: "0 – 49 CLB", desc: "Just getting started. Complete your first challenge!" },
                { icon: "⚙️", title: "Apprentice", range: "50 – 129 CLB", desc: "Building foundations. You're gaining momentum." },
                { icon: "💻", title: "Junior Developer", range: "130 – 279 CLB", desc: "Solid progress. You can handle real problems." },
                { icon: "🔧", title: "Intermediate", range: "280 – 479 CLB", desc: "Strong skills. Employers start to notice." },
                { icon: "🚀", title: "Advanced", range: "480 – 729 CLB", desc: "Impressive mastery. Top-tier problem solver." },
                { icon: "🏆", title: "Expert Engineer", range: "730+ CLB", desc: "Elite status. Employer-verified coding mastery." },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-dark-surface">
                  <span className="text-lg">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{t.title}</span>
                      <span className="text-[10px] text-gray-400 dark:text-dark-muted">{t.range}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-dark-muted">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-dark-muted">
              Your tier is displayed on your profile, the leaderboard, and your downloadable certificate. Higher tiers unlock decorative profile frames.
            </p>
          </InfoCard>

          {/* Achievements & Badges */}
          <InfoCard icon={SparklesIcon} title="Achievements & Badges">
            <p className="mb-2">Badges are awarded automatically when you meet specific criteria. They appear on your profile card and the Achievements page.</p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-dark-surface">
                <p className="font-bold text-gray-900 dark:text-white mb-1">Rarity Levels</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-border text-gray-500 text-[10px] font-semibold">Common</span>
                  <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 text-[10px] font-semibold">Uncommon</span>
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-[10px] font-semibold">Rare</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-[10px] font-semibold">Epic</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 text-[10px] font-semibold">Legendary</span>
                </div>
              </div>
              <p className="text-gray-500 dark:text-dark-muted">
                Hover over any badge on the <strong className="text-green-primary">Achievements</strong> page to see its description and whether you've earned it. Badges with higher rarity have a more intense glow effect.
              </p>
              <p className="text-gray-500 dark:text-dark-muted">
                There are currently <strong>20 badges</strong> to collect, including coding, community, milestone, and mindset categories.
              </p>
            </div>
          </InfoCard>

          {/* Certificates */}
          <InfoCard icon={AcademicCapIcon} title="Downloadable Certificate">
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li>Once you reach <strong>50 CLB</strong> (Apprentice tier), you can download a verifiable PDF certificate.</li>
              <li>Go to <strong className="text-green-primary">Achievements → Certificate</strong> tab and click <strong>Generate Certificate</strong>.</li>
              <li>Each certificate has a unique SHA-256 hash stored in the database for verification.</li>
              <li>Share the verification link with employers — they can confirm your achievement is authentic.</li>
              <li>Your certificate includes your name, tier, total CLB earned, and challenges completed.</li>
            </ul>
          </InfoCard>

          {/* Cafeteria Spending */}
          <InfoCard icon={CircleStackIcon} title="Spending CLB at the Cafeteria">
            <ul className="list-disc list-inside space-y-1.5 text-xs">
              <li>You can spend CLB tokens at the university cafeteria by sending them via MetaMask.</li>
              <li>Open MetaMask → <strong>Send</strong> → enter the cafeteria wallet address and the amount of CLB.</li>
              <li>Spending CLB reduces your <em>spendable balance</em> but does <strong>not</strong> affect your skill tier or rank.</li>
              <li>Your rank is always based on <strong>lifetime earned total</strong>, never your current balance.</li>
              <li>The Transactions page shows a detailed breakdown of earned vs. spent vs. on-chain balances.</li>
            </ul>
          </InfoCard>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ── FAQs & TROUBLESHOOTING TAB ── */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSection === "faqs" && (
        <div className="space-y-6">
          {/* FAQs */}
          <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <QuestionMarkCircleIcon className="w-4 h-4 text-green-primary" />
                <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
                  Frequently Asked Questions
                </span>
              </div>
            </div>
            <div className="px-5 pt-2">
              <Accordion title="I completed a challenge or task but didn't receive CLB — what do I do?" defaultOpen>
                <p>Your CLB is almost certainly sitting as a <strong>pending balance</strong> in our system, waiting to be transferred on-chain. Here's what to do:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                  <li>Click the <strong className="text-green-primary">user icon (👤)</strong> in the <strong>top-right corner</strong> of the header.</li>
                  <li>Click <strong className="text-green-primary">My Account</strong> from the dropdown menu.</li>
                  <li>Scroll down to the <strong>Wallet Connection</strong> section on the page.</li>
                  <li>Click <strong className="text-green-primary">Claim CLB</strong> — this button appears when you have a pending transferable balance.</li>
                  <li>If you haven't connected a wallet yet, connect MetaMask first using the button in that same section.</li>
                </ol>
                <p className="mt-2 text-xs">This is expected behavior — the system stores your earned CLB safely and lets you claim it on demand rather than triggering an on-chain transaction for every single action.</p>
              </Accordion>

              <Accordion title="What is CLB and is it real cryptocurrency?">
                <p>CLB (CrediLab) is an ERC-20 token deployed on the Ethereum <strong>Sepolia testnet</strong>. It has <strong>no real monetary value</strong> — it's an educational token used to gamify learning and reward students for completing challenges and SDG tasks.</p>
              </Accordion>

              <Accordion title="Do I need to pay anything to use CrediLab?">
                <p>No. CrediLab is completely free. The Sepolia testnet uses free test ETH for gas fees. You don't need real ETH or any cryptocurrency to participate.</p>
              </Accordion>

              <Accordion title="Can I use CrediLab without connecting a wallet?">
                <p>Yes! Wallet connection is optional. You can complete challenges, earn CLB credits (tracked in the app), and climb the leaderboard without MetaMask. Connecting a wallet adds on-chain verification and lets you spend CLB at the cafeteria.</p>
              </Accordion>

              <Accordion title="What programming language do challenges use?">
                <p>All coding challenges are in <strong>Java</strong>. The code editor runs your Java solution server-side and checks output against test cases. No local Java installation is needed.</p>
              </Accordion>

              <Accordion title="Can I re-submit a challenge I already completed?">
                <p>You can re-open and practice any challenge, but CLB is only awarded once per challenge. Your first successful submission earns the reward.</p>
              </Accordion>

              <Accordion title="How does the leaderboard ranking work?">
                <p>The leaderboard ranks students by <strong>total CLB earned</strong> (lifetime). It updates in real-time. Only students who have completed at least one challenge or earned CLB appear.</p>
              </Accordion>

              <Accordion title="Will spending CLB lower my rank?">
                <p><strong>No.</strong> Your rank (skill tier) is based on <em>lifetime earned</em> CLB, not your current balance. Spending CLB at the cafeteria does not affect your tier, leaderboard position, or certificate eligibility.</p>
              </Accordion>

              <Accordion title="How do weekly SDG task votes work?">
                <p>After submitting a weekly task, your submission appears in the Community Feed. Other students can upvote it. Once you receive <strong>3 or more net upvotes</strong>, your submission is marked as <strong>Community Approved ✅</strong>. At the end of each week, the community-approved submission with the <strong>highest vote score</strong> is selected as the weekly winner and awarded CLB. Lower-voted submissions do not receive CLB that week.</p>
              </Accordion>

              <Accordion title="What are badges and how do I earn them?">
                <p>Badges are achievements awarded automatically when you meet specific criteria — like completing your first challenge, maintaining a streak, or voting on community submissions. There are 20 badges across 5 rarity tiers. Visit <strong>Achievements → Badges</strong> to see all available badges.</p>
              </Accordion>

              <Accordion title="What is the downloadable certificate?">
                <p>Once you earn 50+ CLB (Apprentice tier), you can generate a PDF certificate from the Achievements page. Each certificate has a unique verification hash. Share the verification link with employers to prove your coding achievements are authentic.</p>
              </Accordion>

              <Accordion title="Does CrediLab have a mobile app?">
                <p>Yes! There's an Android app built with Kotlin that connects to the same Firebase backend. Your CLB, challenges, and wallet sync across both platforms. Use the same MetaMask wallet address on both devices.</p>
              </Accordion>

              <Accordion title="Who can see my profile and achievements?">
                <p>Your name, tier, and badges are visible on the leaderboard. Other students can hover over your name to see your profile card. Your wallet address is only visible on your own profile page.</p>
              </Accordion>

              <Accordion title="How does the anti-cheat system work?">
                <p>During coding challenges, CrediLab monitors for tab switches, DevTools usage, and keyboard shortcuts that could indicate cheating. Each violation is logged in real-time to both your browser and our database (Firestore). After <strong>3 violations</strong>, your challenge session is automatically terminated. Violation history persists across sessions and devices — clearing your browser data will not reset it.</p>
                <p className="mt-2">You can review every recorded violation in the <strong className="text-green-primary">Cheating Logs</strong> page (accessible from the sidebar). Logs are grouped by challenge and show the violation type, count, and exact timestamp — so you always know what was flagged and when.</p>
              </Accordion>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center gap-1.5 ml-2">
                <ExclamationTriangleIcon className="w-4 h-4 text-green-primary" />
                <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
                  Troubleshooting
                </span>
              </div>
            </div>
            <div className="p-5 space-y-3 text-sm text-gray-600 dark:text-dark-muted">
              <div className="p-3 rounded-lg border border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10">
                <p className="font-semibold text-orange-800 dark:text-orange-300 text-xs mb-1">⚠️ Completed a task or challenge but CLB wasn't transferred to your wallet?</p>
                <p className="text-xs text-orange-700 dark:text-orange-400">This is the most common issue. On-chain transfers are not always instant or automatic. Click the <strong>user icon (👤)</strong> in the top-right header → <strong>My Account</strong> → scroll to <strong>Wallet Connection</strong> → click <strong className="text-orange-800 dark:text-orange-300">Claim CLB</strong> to manually trigger the transfer. Your pending balance is safe.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">CLB balance shows 0 in MetaMask?</p>
                <p className="text-xs">Make sure you've added the CLB token contract address and switched to the Sepolia network. Token balances only appear after importing the custom token.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">Balance mismatch between app and wallet?</p>
                <p className="text-xs">Visit the <strong className="text-green-primary">Transactions</strong> page in your dashboard to see a detailed comparison of your on-chain vs. app balance.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">MetaMask not popping up when connecting?</p>
                <p className="text-xs">Ensure the MetaMask extension is enabled and not blocked by your browser. Try clicking the MetaMask icon in your toolbar first, then retry connecting.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">Using the mobile app?</p>
                <p className="text-xs">The CrediLab mobile app (Android/Kotlin) shares the same Firebase backend. Use the same wallet address on both platforms — your CLB syncs automatically via the blockchain.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">Code editor not loading or running?</p>
                <p className="text-xs">Try refreshing the page. If the issue persists, check your internet connection. The code execution happens server-side, so a stable connection is required.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">Weekly task submission not showing in Community Feed?</p>
                <p className="text-xs">Submissions may take a few seconds to appear. Refresh the Community Feed page. If it still doesn't show, ensure you clicked <strong>Submit</strong> and saw the success confirmation.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-xs mb-1">Badge not appearing after meeting criteria?</p>
                <p className="text-xs">Badges are checked against your user data in real-time. Try refreshing the page. Some badges require specific Firestore fields that are updated on submission.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
