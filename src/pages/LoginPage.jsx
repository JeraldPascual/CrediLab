import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail, authError, clearAuthError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  // Combine context-level auth errors with local errors
  const error = authError || localError;

  function clearError() {
    setLocalError("");
    clearAuthError();
  }

  async function handleEmailLogin(e) {
    e.preventDefault();
    clearError();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      // Navigation handled by onAuthStateChanged -> PublicRoute redirect
    } catch (err) {
      setLocalError(friendlyError(err.code) || err.message);
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    clearError();
    setLoading(true);
    await loginWithGoogle();
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left Panel — Branding ── */}
      <div className="hidden md:flex md:w-1/2 bg-dark-bg items-center justify-center p-12">
        <div className="max-w-sm space-y-6">
          <Link to="/" className="text-4xl font-bold text-green-primary">
            CrediLab
          </Link>
          <p className="text-dark-muted text-lg leading-relaxed">
            A decentralized coding assessment platform. Solve Java challenges,
            earn CLB tokens, and prove your skills on-chain.
          </p>
          <div className="flex items-center gap-2 text-sm text-dark-muted">
            <span className="w-2 h-2 rounded-full bg-green-primary inline-block" />
            Learn to earn.
          </div>
        </div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 md:p-16 bg-white dark:bg-dark-surface">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <div className="md:hidden text-center">
            <Link to="/" className="text-3xl font-bold text-green-primary">
              CrediLab
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
              Sign in to continue your coding journey.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-gray-300 dark:border-dark-border text-gray-700 dark:text-dark-text hover:border-green-primary transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            <span className="text-sm font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
            <span className="text-xs text-gray-400 dark:text-dark-muted">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-primary text-dark-bg font-semibold hover:bg-green-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-dark-muted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-primary font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function friendlyError(code) {
  // Normalize raw Firebase error messages like "Firebase: Error (auth/invalid-credential)."
  if (code && code.includes("Firebase:")) {
    const match = code.match(/\(([^)]+)\)/);
    if (match) code = match[1];
  }
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";
    case "auth/operation-not-allowed":
    case "auth/admin-restricted-operation":
      return "Email/password sign-in is not enabled. Please contact the admin.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    default:
      return code
        ? `Something went wrong. Please try again.`
        : "Something went wrong. Please try again.";
  }
}
