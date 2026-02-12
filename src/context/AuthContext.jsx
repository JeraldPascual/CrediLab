import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore user data (best-effort — ad blockers may block Firestore)
  const fetchUserData = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUserData(null);
      return;
    }
    // Always set a minimal local userData from the Auth object
    setUserData((prev) => prev || {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      photoURL: firebaseUser.photoURL || "",
    });
    // Timeout Firestore read to prevent indefinite loading
    const firestoreTimeout = new Promise((resolve) => setTimeout(resolve, 1000));
    const firestoreRead = (async () => {
      try {
        const docRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } catch (err) {
        console.warn("Firestore read failed (ad blocker?). Using Auth profile data.", err.message);
      }
    })();

    // Race: either Firestore succeeds or timeout after 1s
    await Promise.race([firestoreRead, firestoreTimeout]);
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await fetchUserData(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, [fetchUserData]);

  // Google Sign-In
  async function loginWithGoogle() {
    console.log("[AuthContext] Attempting Google sign-in");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      console.log("[AuthContext] Google sign-in successful. UID:", u.uid);

      // Firestore write is best-effort — ad blockers may block it
      try {
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, {
            uid: u.uid,
            displayName: u.displayName || "",
            email: u.email,
            photoURL: u.photoURL || "",
            walletAddress: null,
            credits: 0,
            completedChallenges: [],
            createdAt: serverTimestamp(),
          });
          console.log("[AuthContext] Firestore user doc created for Google user");
        } else {
          setUserData(snap.data());
          console.log("[AuthContext] Existing Firestore data loaded for Google user");
        }
      } catch (firestoreErr) {
        console.warn("[AuthContext] Firestore write failed (ad blocker?). Auth still succeeded.", firestoreErr.message);
      }

      return u;
    } catch (authErr) {
      console.error("[AuthContext] Google sign-in failed:", authErr.code, authErr.message);
      throw authErr;
    }
  }

  // Email/Password Registration
  async function registerWithEmail(email, password, firstName, lastName) {
    console.log("[AuthContext] Attempting registration with email:", email);

    try {
      // This is the critical call — if it fails, we DO want to throw
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const u = result.user;
      console.log("[AuthContext] Registration successful. UID:", u.uid);

      const displayName = `${firstName} ${lastName}`.trim();

      // Update display name (Auth-level, not Firestore)
      try {
        await updateProfile(u, { displayName });
        console.log("[AuthContext] Profile updated with displayName:", displayName);
      } catch (profileErr) {
        console.warn("[AuthContext] Profile update failed:", profileErr.message);
      }

      // Set BOTH user and userData immediately so ProtectedRoute works
      setUser(u);
      setUserData({
        uid: u.uid,
        displayName,
        firstName,
        lastName,
        email: u.email,
        photoURL: "",
        walletAddress: null,
        credits: 0,
        completedChallenges: [],
      });

      // Firestore write is best-effort — ad blockers may block it
      try {
        const docRef = doc(db, "users", u.uid);
        await setDoc(docRef, {
          uid: u.uid,
          displayName,
          firstName,
          lastName,
          email: u.email,
          photoURL: "",
          walletAddress: null,
          credits: 0,
          completedChallenges: [],
          createdAt: serverTimestamp(),
        });
        console.log("[AuthContext] Firestore user doc created successfully");
      } catch (firestoreErr) {
        console.warn("[AuthContext] Firestore write failed (ad blocker?). Auth still succeeded.", firestoreErr.message);
      }

      return result;
    } catch (authErr) {
      console.error("[AuthContext] Registration failed:", authErr.code, authErr.message);
      throw authErr;
    }
  }

  // Email/Password Login
  async function loginWithEmail(email, password) {
    console.log("[AuthContext] Attempting login with email:", email);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const u = result.user;
      console.log("[AuthContext] Login successful. UID:", u.uid);

      // Set BOTH user and userData immediately so ProtectedRoute works
      setUser(u);
      setUserData({
        uid: u.uid,
        displayName: u.displayName || "",
        email: u.email,
        photoURL: u.photoURL || "",
      });

      // Firestore read is best-effort
      try {
        const docRef = doc(db, "users", u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUserData(snap.data());
          console.log("[AuthContext] Firestore user data loaded");
        } else {
          console.warn("[AuthContext] No Firestore doc found for user. Using Auth data.");
        }
      } catch (firestoreErr) {
        console.warn("[AuthContext] Firestore read failed (ad blocker?). Auth still succeeded.", firestoreErr.message);
      }

      return result;
    } catch (authErr) {
      console.error("[AuthContext] Login failed:", authErr.code, authErr.message);
      console.error("[AuthContext] Full error:", authErr);
      throw authErr;
    }
  }

  // Logout
  async function logout() {
    setUserData(null);
    return signOut(auth);
  }

  const value = {
    user,
    userData,
    loading,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    refreshUserData: () => fetchUserData(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
