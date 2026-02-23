/**
 * Seed Script: Create Week 9 SDG Weekly Task in Firestore
 *
 * Run once with:
 *   node scripts/seed-weekly-task.js
 *
 * Requires env vars (copy from .env.local):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY
 *   (or FIREBASE_SERVICE_ACCOUNT as full JSON string)
 *
 * Student B can query this task from his mobile app using:
 *   collection: "weekly_tasks"
 *   filter:     isActive == true  AND  weekNumber == <current week>
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Init Firebase Admin ───────────────────────────────────────────────
let serviceAccount;
try {
  // Try loading a local service account JSON file first (dev convenience)
  // Try the Firebase Admin SDK JSON downloaded from Firebase Console
  const candidates = [
    "../serviceAccountKey.json",
    "../credilab-c8481-firebase-adminsdk-fbsvc-7b0c7fb9ad.json",
  ];
  let loaded = false;
  for (const c of candidates) {
    try {
      serviceAccount = JSON.parse(readFileSync(resolve(__dirname, c), "utf8"));
      console.log(`✅ Loaded ${c}`);
      loaded = true;
      break;
    } catch {}
  }
  if (!loaded) throw new Error("No service account file found");
} catch {
  // Fall back to env vars
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      };
  console.log("✅ Using env var credentials");
}

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

// ── Task Definition ───────────────────────────────────────────────────
// SDG 15 — Life on Land (photo upload task)
// Week 9 of 2026 (Feb 23 – Mar 1, 2026)
const TASK = {
  id: "sdg15-tree-action-w9",

  // ── Display fields (used by web app + Student B mobile) ───────────
  title: "Plant a Seed, Take a Photo 🌱",
  description:
    "Take real action for SDG 15: Life on Land. Plant a seed, seedling, or nurture a plant — then upload a photo as proof. Describe what you planted and why it matters.",
  shortDescription: "Plant something and upload a photo as proof",

  // ── SDG metadata ──────────────────────────────────────────────────
  sdgGoal: 15,
  sdgLabel: "Life on Land",
  sdgIcon: "🌳",
  sdgColor: "#56C02B", // official UN SDG 15 green

  // ── Task config ───────────────────────────────────────────────────
  category: "SDG Environment",
  type: "photo",
  weekNumber: 9,                 // ISO week 9 = Feb 23 – Mar 1, 2026
  isActive: true,
  requiresPhoto: true,
  maxPhotoSizeKB: 800,

  // ── Reward ────────────────────────────────────────────────────────
  reward: 35,

  // ── Prompt (shown to student on submission page) ──────────────────
  prompt:
    "Upload a photo showing your environmental action (planting, watering, composting, cleanup, etc). Then in 30–150 words describe: What did you do? Why does this action matter for SDG 15: Life on Land?",
  minWordCount: 30,
  maxWordCount: 150,

  // ── Expiry ────────────────────────────────────────────────────────
  expiresAt: Timestamp.fromDate(new Date("2026-03-01T23:59:59.000Z")),

  // ── Limits ────────────────────────────────────────────────────────
  maxCompletions: null,          // unlimited — every student can complete once

  // ── Admin metadata ────────────────────────────────────────────────
  createdBy: "system",
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),

  // ── Student B mobile query hints ─────────────────────────────────
  // .where("isActive", "==", true)
  // .where("weekNumber", "==", currentWeekNumber)
  tags: ["environment", "trees", "photo", "action", "sdg15"],
};

// ── Write to Firestore ────────────────────────────────────────────────
async function seed() {
  console.log(`\n📝 Seeding task: ${TASK.id}`);
  console.log(`   Collection : weekly_tasks`);
  console.log(`   Week       : ${TASK.weekNumber}`);
  console.log(`   SDG        : ${TASK.sdgIcon} ${TASK.sdgLabel}`);
  console.log(`   Reward     : ${TASK.reward} CLB`);
  console.log(`   Expires    : ${new Date("2026-03-01T23:59:59.000Z").toDateString()}\n`);

  const ref = db.collection("weekly_tasks").doc(TASK.id);
  const existing = await ref.get();

  if (existing.exists) {
    console.log("⚠️  Task already exists — updating...");
    await ref.update({ ...TASK, updatedAt: Timestamp.now() });
  } else {
    await ref.set(TASK);
  }

  console.log("✅ Task seeded successfully!\n");
  console.log("─── Student B Firestore Query (Android/Flutter) ───────────────");
  console.log(`
  // Kotlin / Android (Firebase SDK)
  db.collection("weekly_tasks")
    .whereEqualTo("isActive", true)
    .whereEqualTo("weekNumber", 9)
    .orderBy("createdAt", Query.Direction.DESCENDING)
    .get()

  // Flutter / Dart
  FirebaseFirestore.instance
    .collection('weekly_tasks')
    .where('isActive', isEqualTo: true)
    .where('weekNumber', isEqualTo: 9)
    .orderBy('createdAt', descending: true)
    .get()
  `);

  console.log("─── Completion Write Schema ────────────────────────────────────");
  console.log(`
  // Document path: weekly_completions/{uid}_{taskId}
  // e.g.          weekly_completions/abc123_sdg15-tree-action-w9
  {
    uid:         "<student uid>",
    taskId:      "sdg15-tree-action-w9",
    weekNumber:  9,
    completedAt: serverTimestamp(),
    response:    "<student description text>",
    photoBase64: "<compressed base64 data URL>",
    rewardCLB:   35,
    status:      "pending_review"
  }
  `);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
