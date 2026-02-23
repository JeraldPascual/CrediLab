/**
 * scripts/set-admin-role.js
 *
 * Sets role: "admin" on a Firestore user document for admin features.
 *
 * Usage:
 *   node --experimental-vm-modules scripts/set-admin-role.js <email-or-uid>
 *
 * Examples:
 *   node --experimental-vm-modules scripts/set-admin-role.js jerald@example.com
 *   node --experimental-vm-modules scripts/set-admin-role.js abc123uid
 */

import { createRequire } from "module";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

// ── Init Firebase Admin ───────────────────────────────────────────────
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore }                  from "firebase-admin/firestore";
import { getAuth }                       from "firebase-admin/auth";

const SA_PATHS = [
  resolve(__dirname, "../credilab-c8481-firebase-adminsdk-fbsvc-7b0c7fb9ad.json"),
  resolve(__dirname, "../serviceAccountKey.json"),
];

function loadServiceAccount() {
  for (const p of SA_PATHS) {
    if (existsSync(p)) {
      console.log("Using service account:", p);
      return JSON.parse(readFileSync(p, "utf8"));
    }
  }
  throw new Error("Service account JSON not found. Place it in the project root.");
}

if (!getApps().length) {
  initializeApp({ credential: cert(loadServiceAccount()) });
}

const db   = getFirestore();
const fbAuth = getAuth();

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
  const target = process.argv[2];
  if (!target) {
    console.error("Usage: node scripts/set-admin-role.js <email-or-uid>");
    process.exit(1);
  }

  let uid = target;

  // If it looks like an email, resolve to UID first
  if (target.includes("@")) {
    console.log(`Looking up UID for email: ${target}`);
    const userRecord = await fbAuth.getUserByEmail(target);
    uid = userRecord.uid;
    console.log(`Resolved UID: ${uid}`);
  }

  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    console.error(`No Firestore user document found for UID: ${uid}`);
    console.error("Make sure the user has logged in at least once.");
    process.exit(1);
  }

  const current = snap.data();
  console.log(`\nCurrent data for ${current.displayName || current.email || uid}:`);
  console.log("  role:", current.role ?? "(not set)");
  console.log("  email:", current.email ?? "(not set)");

  await ref.update({ role: "admin" });

  console.log("\n✅ role set to \"admin\" successfully.");
  console.log("The user now has admin privileges.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
