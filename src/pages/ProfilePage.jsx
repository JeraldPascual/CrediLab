import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  PlusCircleIcon,
  WalletIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  EyeIcon,
  EyeSlashIcon,
  TrophyIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { doc, setDoc, getDocs, collection, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { connectMetaMask } from "../../web3/wallet/metamask";
import { getCLBBalance } from "../../web3/contracts/clbToken";


export default function ProfilePage() {
  const { user, userData } = useAuth();

  const [firstName, setFirstName] = useState(userData?.firstName || "");
  const [lastName, setLastName] = useState(userData?.lastName || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [walletAddress, setWalletAddress] = useState(
    userData?.walletAddress || ""
  );
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [claimingCLB, setClaimingCLB] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  // Sync local state when userData arrives / updates from Firestore onSnapshot
  // (userData is null on first render; onSnapshot delivers it asynchronously)
  useEffect(() => {
    if (userData) {
      if (userData.firstName && !firstName) setFirstName(userData.firstName);
      if (userData.lastName && !lastName) setLastName(userData.lastName);
      if (userData.walletAddress && userData.walletAddress !== walletAddress) {
        setWalletAddress(userData.walletAddress);
      }
    }
  }, [userData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Blockchain balance state
  const [blockchainBalance, setBlockchainBalance] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [balanceError, setBalanceError] = useState("");

  // Load blockchain balance when wallet address changes
  useEffect(() => {
    async function loadBlockchainBalance() {
      if (!walletAddress) {
        setBlockchainBalance(null);
        return;
      }

      setLoadingBalance(true);
      setBalanceError("");

      try {
        const balance = await getCLBBalance(walletAddress);
        setBlockchainBalance(balance);
      } catch (error) {
        console.error("Failed to load blockchain balance:", error);
        setBalanceError(error.message || "Failed to load blockchain balance");
      } finally {
        setLoadingBalance(false);
      }
    }

    loadBlockchainBalance();
  }, [walletAddress]);

  // Save profile
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const displayName = `${firstName} ${lastName}`.trim();
      // Update Firebase Auth profile
      await updateProfile(user, { displayName });
      // Update Firestore document (merge: creates doc if it doesn't exist)
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, { firstName, lastName, displayName, email: user.email, uid: user.uid }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Profile save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  // Connect MetaMask
  async function handleConnectWallet() {
    setConnectingWallet(true);
    setWalletError("");
    try {
      const address = await connectMetaMask();
      if (!address) return;

      // Check if this wallet is already linked to another account
      const q = query(
        collection(db, "users"),
        where("walletAddress", "==", address)
      );
      const snap = await getDocs(q);
      const alreadyLinked = snap.docs.find((d) => d.id !== user.uid);
      if (alreadyLinked) {
        setWalletError(
          "This wallet address is already linked to another account. Switch to a different MetaMask account and try again."
        );
        return;
      }

      setWalletAddress(address);
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        { walletAddress: address, uid: user.uid, email: user.email },
        { merge: true }
      );
    } catch (err) {
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setWalletError("Connection cancelled. You can try again anytime.");
      } else if (err.message?.includes("MetaMask is not installed")) {
        setWalletError("MetaMask is not installed. Please install it from metamask.io first.");
      } else {
        setWalletError("Wallet connection failed. Please try again.");
        console.error("Wallet connection failed:", err);
      }
    } finally {
      setConnectingWallet(false);
    }
  }

  // Copy wallet address
  function handleCopy() {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Profile picture upload — compress to 128x128 JPEG, store in Firestore only
  // Firebase Auth updateProfile has a strict URL length limit, so we skip it
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }

    // Compress and resize to 128x128 JPEG using canvas
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      const size = 128;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      // Center-crop: use the smaller dimension as the crop square
      const min = Math.min(img.width, img.height);
      const sx = (img.width - min) / 2;
      const sy = (img.height - min) / 2;
      ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);

      const compressed = canvas.toDataURL("image/jpeg", 0.7);
      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { photoURL: compressed }, { merge: true });
        // Force refresh to show new photo
        window.location.reload();
      } catch (err) {
        console.error("Photo upload failed:", err);
        alert("Failed to save photo. Please try again.");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      alert("Could not read image file.");
    };
    img.src = objectUrl;
  }

  async function handleClaimCLB() {
    setClaimingCLB(true);
    setClaimResult(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/claim-pending-clb", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Claim failed");
      setClaimResult({ ok: true, msg: data.message });
      setTimeout(async () => {
        try { const bal = await getCLBBalance(walletAddress); setBlockchainBalance(bal); } catch { /* ignore */ }
      }, 5000);
    } catch (err) {
      setClaimResult({ ok: false, msg: err.message });
    } finally {
      setClaimingCLB(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Account
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Manage your profile and wallet connection.
        </p>
      </div>

      {/* ── Profile Photo ── */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {(userData?.photoURL || user?.photoURL) ? (
            <img
              src={userData?.photoURL || user.photoURL}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-green-primary/20"
            />
          ) : (
            <UserCircleIcon className="w-20 h-20 text-gray-300 dark:text-dark-muted" />
          )}
          <label className="absolute -bottom-1 -right-1 cursor-pointer">
            <PlusCircleIcon className="w-7 h-7 text-green-primary bg-white dark:bg-dark-card rounded-full" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.displayName || "Student"}
          </p>
          <p className="text-sm text-gray-500 dark:text-dark-muted">
            Upload a photo (auto-compressed to 128×128)
          </p>
        </div>
      </div>

      {/* ── Profile Form ── */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
            Email / Google Account
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface text-gray-500 dark:text-dark-muted cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 dark:text-dark-muted mt-1">
            Email is linked to your Google account and cannot be changed.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-green-primary text-dark-bg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </form>

      {/* ── Wallet Section ── */}
      <div className="border-t border-gray-200 dark:border-dark-border pt-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <WalletIcon className="w-5 h-5 text-green-primary" />
          Wallet Connection
        </h2>

        {walletAddress ? (
          <div className="space-y-3">
            {/* Wallet Address Display */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-green-primary/5 border border-emerald-200 dark:border-green-primary/20">
              {showWallet ? (
                <span className="text-sm font-mono text-gray-700 dark:text-dark-text flex-1 truncate">
                  {walletAddress}
                </span>
              ) : (
                <span className="text-sm font-mono text-gray-500 dark:text-dark-muted flex-1">
                  {walletAddress.slice(0, 6)}••••••••{walletAddress.slice(-4)}
                </span>
              )}
              <button
                onClick={() => setShowWallet(!showWallet)}
                className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-green-primary/10 transition-colors"
                title={showWallet ? "Hide address" : "Reveal address"}
              >
                {showWallet ? (
                  <EyeSlashIcon className="w-4 h-4 text-green-primary" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {showWallet && (
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-green-primary/10 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-green-primary" />
                  ) : (
                    <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}
            </div>

            {/* CLB Balance Display */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-50/30 dark:from-green-primary/10 dark:to-green-primary/5 border border-emerald-200 dark:border-green-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-dark-muted">
                  CLB Token Balance
                </span>
                <span className="text-xs text-gray-400 dark:text-dark-muted">
                  Sepolia Testnet
                </span>
              </div>

              {loadingBalance ? (
                <div className="text-2xl font-bold text-gray-400 dark:text-dark-muted animate-pulse">
                  Loading...
                </div>
              ) : balanceError ? (
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-red-500">
                    Error
                  </div>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {balanceError}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-muted">
                    Make sure contract is deployed and RPC URL is configured.
                  </p>
                </div>
              ) : blockchainBalance !== null ? (
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-green-primary">
                    {parseFloat(blockchainBalance).toFixed(2)} CLB
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted">
                    <span>Firestore Credits: {userData?.totalCLBEarned ?? userData?.credits ?? 0}</span>
                    {(() => {
                      const onChain = parseFloat(blockchainBalance);
                      const offChain = userData?.totalCLBEarned ?? userData?.credits ?? 0;
                      if (Math.abs(onChain - offChain) <= 0.01) return null;
                      // On-chain is 0 but Firestore has credits → pending on-chain transfer
                      const label = onChain < offChain ? "Pending on-chain" : "Mismatch";
                      return (
                        <span className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400">
                            ⚠️ {label}
                          </span>
                          {onChain < offChain && (
                            <button
                              onClick={handleClaimCLB}
                              disabled={claimingCLB}
                              className="px-3 py-0.5 rounded-full bg-green-primary text-dark-bg text-xs font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
                            >
                              {claimingCLB ? "Sending…" : "Claim CLB"}
                            </button>
                          )}
                          {claimResult && (
                            <span className={claimResult.ok ? "text-green-500" : "text-red-400"}>
                              {claimResult.msg}
                            </span>
                          )}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-400 dark:text-dark-muted">
                  0.00 CLB
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-dark-muted">
              Connect your MetaMask wallet to receive CLB tokens when you
              complete challenges.
            </p>
            {walletError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {walletError}
              </div>
            )}
            <button
              onClick={handleConnectWallet}
              disabled={connectingWallet}
              className="px-5 py-2.5 rounded-lg bg-green-primary text-dark-bg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {connectingWallet ? "Connecting…" : "Connect MetaMask"}
            </button>
          </div>
        )}

        <p className="text-xs text-gray-400 dark:text-dark-muted">
          Your wallet address is saved on-chain. The same address is used on
          the mobile app to view your token balance.
        </p>
      </div>
    </div>
  );
}
