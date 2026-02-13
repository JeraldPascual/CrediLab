import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  WalletIcon,
  ArrowDownTrayIcon,
  LinkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function WalletGuidePage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <WalletIcon className="w-7 h-7 text-green-primary" />
          Wallet Setup Guide
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Learn how to install MetaMask, connect your wallet, and receive CLB
          tokens.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10">
        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
          <p className="font-semibold">Important safety tips</p>
          <ul className="list-disc list-inside text-xs space-y-0.5 text-yellow-700 dark:text-yellow-400">
            <li>
              Never share your Secret Recovery Phrase (seed phrase) with anyone.
            </li>
            <li>
              CrediLab will <span className="font-bold">never</span> ask for
              your private key or seed phrase.
            </li>
            <li>
              Only download MetaMask from official sources:{" "}
              <span className="font-mono">metamask.io</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Desktop Guide ── */}
      <GuideSection
        icon={ComputerDesktopIcon}
        title="Desktop / Laptop (Browser Extension)"
        steps={[
          {
            title: "Install MetaMask Extension",
            description: (
              <>
                Go to{" "}
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-primary underline"
                >
                  metamask.io/download
                </a>{" "}
                and click <strong>Install MetaMask for Chrome</strong> (or your
                browser). It supports Chrome, Firefox, Brave, and Edge.
              </>
            ),
          },
          {
            title: "Create or Import a Wallet",
            description:
              "After installation, click the MetaMask fox icon in your browser toolbar. Follow the setup wizard to create a new wallet or import an existing one using your Secret Recovery Phrase.",
          },
          {
            title: "Set a Strong Password",
            description:
              "Choose a strong password for your MetaMask vault. This password encrypts your wallet data on this device only.",
          },
          {
            title: "Back Up Your Recovery Phrase",
            description:
              'MetaMask will show you a 12-word Secret Recovery Phrase. Write it down on paper and store it somewhere safe. Never store it digitally or screenshot it.',
          },
          {
            title: "Connect to CrediLab",
            description: (
              <>
                In CrediLab, go to{" "}
                <strong className="text-green-primary">
                  My Account → Connect MetaMask
                </strong>
                . MetaMask will pop up asking for permission. Click{" "}
                <strong>Connect</strong>. Your wallet address will appear in your
                profile.
              </>
            ),
          },
        ]}
      />

      {/* ── Mobile Guide ── */}
      <GuideSection
        icon={DevicePhoneMobileIcon}
        title="Mobile (Android / iOS)"
        steps={[
          {
            title: "Download MetaMask App",
            description: (
              <>
                Download from the{" "}
                <a
                  href="https://play.google.com/store/apps/details?id=io.metamask"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-primary underline"
                >
                  Google Play Store
                </a>{" "}
                or{" "}
                <a
                  href="https://apps.apple.com/app/metamask/id1438144202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-primary underline"
                >
                  Apple App Store
                </a>
                . Make sure the developer is "ConsenSys".
              </>
            ),
          },
          {
            title: "Create or Import Wallet",
            description:
              "Open the app and choose \"Create a New Wallet\" or \"Import Using Secret Recovery Phrase\" if you already have one from your desktop.",
          },
          {
            title: "Enable Browser in MetaMask",
            description: (
              <>
                Tap the <strong>☰ menu</strong> in the MetaMask app, then tap{" "}
                <strong>Browser</strong>. Navigate to the CrediLab URL in the
                MetaMask built-in browser to connect your wallet.
              </>
            ),
          },
          {
            title: "Sync with Desktop (Optional)",
            description:
              "If you already set up on desktop, use the same 12-word Recovery Phrase to import your wallet into the mobile app. Both devices will share the same address.",
          },
        ]}
      />

      {/* ── How CLB Tokens Work ── */}
      <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <ShieldCheckIcon className="w-4 h-4 text-green-primary" />
            <span className="text-xs font-semibold text-gray-600 dark:text-dark-muted uppercase tracking-wide">
              How CLB Tokens Work
            </span>
          </div>
        </div>
        <div className="p-5 space-y-3 text-sm text-gray-600 dark:text-dark-muted">
          <p>
            <strong className="text-gray-900 dark:text-white">1.</strong>{" "}
            Complete coding challenges to earn CLB (CrediLab) credits.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">2.</strong>{" "}
            Credits are recorded in your CrediLab profile immediately.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">3.</strong>{" "}
            Once blockchain integration goes live, CLB tokens will be minted to
            your connected MetaMask wallet address.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">4.</strong>{" "}
            You'll be able to view your token balance in MetaMask under the
            "Tokens" tab after adding the CLB contract address (provided later).
          </p>
          <p className="text-xs text-gray-400 dark:text-dark-muted pt-2 border-t border-gray-100 dark:border-dark-border">
            Blockchain features are under development by Student B. Connect your
            wallet now so you're ready when it launches.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Guide Section Component ── */
function GuideSection({ icon: Icon, title, steps }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card overflow-hidden">
      {/* Window title bar */}
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

      {/* Steps */}
      <div className="p-5 space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-primary/10 text-green-primary flex items-center justify-center text-xs font-bold">
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
