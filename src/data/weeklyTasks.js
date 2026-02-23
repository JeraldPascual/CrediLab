/**
 * Weekly SDG Tasks — Firestore-Driven
 *
 * Weekly tasks are stored in Firestore, NOT in code.
 * This file provides:
 *   1. The Firestore schema (for documentation)
 *   2. Helper functions to read/write weekly tasks
 *   3. Completion tracking helpers
 *
 * Firestore Collections:
 *   weekly_tasks/{taskId}       — Task definitions (created by admin/Student B)
 *   weekly_completions/{docId}  — Completion records per student
 *
 * Why Firestore-driven?
 *   - Student B can add/edit tasks from mobile app without code deploys
 *   - Tasks can be toggled active/inactive without redeployment
 *   - Weekly rotation is controlled by `weekNumber` field
 */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { WEEKLY_TASK_CONFIG } from "./constants";

// ─── Static Fallback Tasks ───────────────────────────────────────────
// Shown immediately while Firestore loads, and as a safety net if
// the collection is empty or permissions aren't yet deployed.
export const STATIC_WEEKLY_TASKS = [
  {
    id: "sdg15-tree-action-w9",
    title: "Plant a Seed, Take a Photo 🌱",
    description:
      "Take real action for SDG 15: Life on Land. Plant a seed, seedling, or nurture a plant — then upload a photo as proof. Describe what you planted and why it matters.",
    sdgGoal: 15,
    sdgLabel: "Life on Land",
    sdgIcon: "🌳",
    category: "SDG Environment",
    type: "photo",
    weekNumber: 9,
    isActive: true,
    reward: 35,
    prompt:
      "Upload a photo showing your environmental action (planting, watering, composting, cleanup, etc). Then in 30–150 words describe: What did you do? Why does this action matter for SDG 15: Life on Land?",
    minWordCount: 30,
    maxWordCount: 150,
    requiresPhoto: true,
    maxPhotoSizeKB: 800,
    tags: ["environment", "trees", "photo", "action", "sdg15"],
    expiresAt: "2026-03-01T23:59:59.000Z",
  },
];

// ─── Firestore Schema (for reference) ────────────────────────────────
//
// weekly_tasks/{taskId}:
// {
//   id:            string     — unique slug e.g. "sdg-water-week1"
//   title:         string     — "Water Conservation Quiz"
//   description:   string     — task description / instructions
//   sdgGoal:       number     — UN SDG number (1-17), e.g. 6 = Clean Water
//   sdgLabel:      string     — "Clean Water and Sanitation"
//   category:      string     — "SDG Environment"
//   reward:        number     — CLB reward (bounded by WEEKLY_TASK_CONFIG.maxReward)
//   weekNumber:    number     — which week this task belongs to (1, 2, 3...)
//   isActive:      boolean    — whether this task is currently available
//   type:          string     — "reflection" | "photo" | "quiz" | "action" | "research"
//   requiresPhoto: boolean    — whether student must upload a photo
//   maxPhotoSizeKB:number     — max photo size in KB (default 800)
//   questions:     array      — [{question, options, correctIndex}] for quiz type
//   prompt:        string     — for reflection/action type (free text response)
//   minWordCount:  number     — minimum words for reflection responses (default 50)
//   createdAt:     timestamp
//   createdBy:     string     — uid of admin who created it
//   expiresAt:     timestamp  — optional, auto-deactivate after this date
//   maxCompletions:number     — max times ANY student can complete (null = unlimited)
// }
//
// weekly_completions/{uid}_{taskId}:
// {
//   uid:           string
//   taskId:        string
//   weekNumber:    number
//   completedAt:   timestamp
//   response:      string     — student's answer/reflection text
//   photoBase64:   string     — compressed base64 data URL (for type=photo, <800KB)
//   rewardCLB:     number     — CLB to award upon admin approval
//   status:        string     — "pending_review" | "approved" | "rejected" | "completed"
//   reviewedBy:    string     — uid of admin who approved/rejected
//   reviewedAt:    timestamp  — when the review happened
//   reviewNote:    string     — optional admin comment
//   displayName:   string     — student's name (for admin review convenience)
//   email:         string     — student's email
// }

// ─── Read Active Weekly Tasks ────────────────────────────────────────

/**
 * Fetch all active weekly tasks from Firestore.
 * @param {number} [weekNumber] — optional filter by week number
 * @returns {Promise<Array>} Array of task objects
 */
export async function getActiveWeeklyTasks(weekNumber = null) {
  try {
    const tasksRef = collection(db, "weekly_tasks");

    // Simple single-field query — no composite index required.
    // We filter weekNumber and sort client-side to avoid index creation.
    const q = query(tasksRef, where("isActive", "==", true));

    const snap = await getDocs(q);
    let tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Client-side week filter
    if (weekNumber !== null) {
      tasks = tasks.filter((t) => t.weekNumber === weekNumber);
    }

    // Client-side sort by createdAt desc
    tasks.sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt ?? 0).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });

    // If Firestore returned nothing, fall back to static tasks
    if (tasks.length === 0) {
      const wn = weekNumber ?? getCurrentWeekNumber();
      return STATIC_WEEKLY_TASKS.filter((t) => t.isActive && t.weekNumber === wn);
    }

    return tasks;
  } catch (err) {
    console.error("[weeklyTasks] Failed to fetch:", err.message);
    // Always return static fallback on any error so UI never breaks
    const wn = weekNumber ?? getCurrentWeekNumber();
    return STATIC_WEEKLY_TASKS.filter((t) => t.isActive && t.weekNumber === wn);
  }
}

// ─── Check Completion Status ─────────────────────────────────────────

/**
 * Check if a student already completed a specific weekly task.
 * @param {string} uid
 * @param {string} taskId
 * @returns {Promise<boolean>}
 */
export async function hasCompletedWeeklyTask(uid, taskId) {
  try {
    const docRef = doc(db, "weekly_completions", `${uid}_${taskId}`);
    const snap = await getDoc(docRef);
    return snap.exists();
  } catch {
    return false;
  }
}

/**
 * Count how many weekly tasks a student completed this week.
 * @param {string} uid
 * @param {number} weekNumber
 * @returns {Promise<number>}
 */
export async function getWeeklyCompletionCount(uid, weekNumber) {
  try {
    const ref = collection(db, "weekly_completions");
    const q = query(
      ref,
      where("uid", "==", uid),
      where("weekNumber", "==", weekNumber)
    );
    const snap = await getDocs(q);
    return snap.size;
  } catch {
    return 0;
  }
}

/**
 * Check if student can still complete weekly tasks this week.
 * @param {string} uid
 * @param {number} weekNumber
 * @returns {Promise<{canComplete: boolean, remaining: number, completed: number}>}
 */
export async function canCompleteWeeklyTask(uid, weekNumber) {
  const completed = await getWeeklyCompletionCount(uid, weekNumber);
  const max = WEEKLY_TASK_CONFIG.maxTasksPerWeek;
  return {
    canComplete: completed < max,
    remaining: Math.max(0, max - completed),
    completed,
  };
}

// ─── Mark Weekly Task as Complete ────────────────────────────────────

/**
 * Submit a weekly task for review or auto-complete.
 *
 * For type="photo" → status starts as "pending_review" (community votes validate)
 * For type="reflection" → status is "completed" immediately
 *
 * Photo is stored as compressed base64 data URL directly in Firestore
 * (no Cloud Storage / Blaze plan needed). Max ~800KB per photo.
 *
 * Community feed queries submissions for voting:
 *   db.collection("weekly_completions")
 *     .where("status", "in", ["pending_review", "community_approved"])
 *     .get()
 *
 * @param {string}  uid
 * @param {string}  taskId
 * @param {number}  weekNumber
 * @param {number}  rewardCLB
 * @param {object}  opts
 * @param {string}  [opts.response]      — text reflection
 * @param {string}  [opts.photoBase64]   — base64 data URL of compressed photo
 * @param {string}  [opts.taskType]      — "reflection" | "photo"
 * @param {string}  [opts.displayName]   — student name for admin convenience
 * @param {string}  [opts.email]         — student email for admin convenience
 * @returns {Promise<{success: boolean, status?: string, error?: string}>}
 */
export async function completeWeeklyTask(uid, taskId, weekNumber, rewardCLB, opts = {}) {
  const { response = "", photoBase64 = null, taskType = "reflection", displayName = "", email = "" } = opts;

  try {
    // Check weekly limit
    const { canComplete, remaining } = await canCompleteWeeklyTask(uid, weekNumber);
    if (!canComplete) {
      return {
        success: false,
        error: `Weekly limit reached (${WEEKLY_TASK_CONFIG.maxTasksPerWeek} tasks/week). ${remaining} remaining.`,
      };
    }

    // Check not already submitted
    const already = await hasCompletedWeeklyTask(uid, taskId);
    if (already) {
      return { success: false, error: "You already submitted this task." };
    }

    // Photo tasks require admin review; reflection tasks auto-complete
    const needsReview = taskType === "photo" || !!photoBase64;
    const status = needsReview ? "pending_review" : "completed";

    const docRef = doc(db, "weekly_completions", `${uid}_${taskId}`);
    await setDoc(docRef, {
      uid,
      taskId,
      weekNumber,
      completedAt: serverTimestamp(),
      response,
      ...(photoBase64 ? { photoBase64 } : {}),
      rewardCLB,
      status,
      taskType,
      displayName,
      email,
      // Community voting fields
      upvotes: 0,
      downvotes: 0,
      upvoters: [],
      downvoters: [],
      netScore: 0,
      // Review fields (null until community-approved or flagged)
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
    });

    return {
      success: true,
      status,
      message: needsReview
        ? "Submitted! Your photo is under review. CLB will be awarded once approved."
        : `Task completed! ${rewardCLB} CLB earned.`,
    };
  } catch (err) {
    console.error("[weeklyTasks] Submission error:", err.message);
    return { success: false, error: err.message };
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Get current week number (ISO week of the year).
 * Used to match tasks to the current week.
 */
export function getCurrentWeekNumber() {
  // ISO 8601 week number — weeks start Monday, week 1 = week containing first Thursday
  const d = new Date();
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return Math.ceil((((utc - yearStart) / 86400000) + 1) / 7);
}

/**
 * SDG Goal labels (United Nations Sustainable Development Goals)
 * Only including environment-related ones for v1.
 */
export const SDG_GOALS = {
  6:  "Clean Water and Sanitation",
  7:  "Affordable and Clean Energy",
  11: "Sustainable Cities and Communities",
  12: "Responsible Consumption and Production",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
};

/**
 * SDG Goal icons (emoji representation)
 */
export const SDG_ICONS = {
  6:  "💧",
  7:  "⚡",
  11: "🏙️",
  12: "♻️",
  13: "🌍",
  14: "🐟",
  15: "🌳",
};
