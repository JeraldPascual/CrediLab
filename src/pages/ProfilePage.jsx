import { useState } from "react";
import {
  UserCircleIcon,
  PlusCircleIcon,
  WalletIcon,
  ClipboardDocumentIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { doc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { connectMetaMask } from "../../web3/wallet/metamask";

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
    try {
      const address = await connectMetaMask();
      if (address) {
        setWalletAddress(address);
        // Save to Firestore (merge: creates doc if it doesn't exist)
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { walletAddress: address, uid: user.uid, email: user.email }, { merge: true });
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
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

  // Profile picture upload placeholder
  // NOTE: Using Firestore document to store base64 photo (small images only)
  // because Firebase Storage requires Blaze plan
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size — max 200KB for Firestore doc field
    if (file.size > 200 * 1024) {
      alert("Image must be under 200KB. Please compress it first.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        await updateProfile(user, { photoURL: base64 });
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, { photoURL: base64 }, { merge: true });
      } catch (err) {
        console.error("Photo upload failed:", err);
      }
    };
    reader.readAsDataURL(file);
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
          {user?.photoURL ? (
            <img
              src={user.photoURL}
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
            Upload a photo (max 200KB)
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
          <div className="flex items-center gap-3 p-4 rounded-xl bg-green-primary/5 border border-green-primary/20">
            <span className="text-sm font-mono text-gray-700 dark:text-dark-text flex-1 truncate">
              {walletAddress}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-green-primary/10 transition-colors"
              title="Copy address"
            >
              {copied ? (
                <CheckIcon className="w-4 h-4 text-green-primary" />
              ) : (
                <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 dark:text-dark-muted">
              Connect your MetaMask wallet to receive CLB tokens when you
              complete challenges.
            </p>
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
