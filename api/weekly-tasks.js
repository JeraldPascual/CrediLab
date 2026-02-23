/**
 * Vercel Serverless Function: Weekly Tasks API
 *
 * Designed for Student B's Android/Flutter mobile app integration.
 * No auth required for GET — tasks are public.
 * POST (seed/update) requires ADMIN_SECRET header.
 *
 * Routes:
 *   GET  /api/weekly-tasks                  — fetch active tasks for current week
 *   GET  /api/weekly-tasks?week=9           — fetch tasks for specific week
 *   GET  /api/weekly-tasks?taskId=xxx       — fetch single task
 *   POST /api/weekly-tasks                  — seed/update a task (admin only)
 *
 * Student B Android query equivalent:
 *   fetch("https://credi-lab.vercel.app/api/weekly-tasks")
 *   // returns { tasks: [...], weekNumber: 9, count: 1 }
 */

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

function getDB() {
  if (getApps().length === 0) {
    let serviceAccount;
    try {
      serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : {
            projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          };
    } catch (e) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };
    }
    initializeApp({ credential: cert(serviceAccount) });
  }
  return getFirestore();
}

/** ISO week number helper */
function getISOWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/** Serialize Firestore doc (convert Timestamps → ISO strings) */
function serializeTask(doc) {
  const data = doc.data ? doc.data() : doc;
  return {
    ...data,
    id: doc.id || data.id,
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? null,
    expiresAt: data.expiresAt?.toDate?.()?.toISOString() ?? data.expiresAt ?? null,
  };
}

export default async function handler(req, res) {
  // ── CORS — allow web app + Student B's mobile/local testing ──────────
  const origin = req.headers.origin || '';
  const isAllowed =
    origin.endsWith('.vercel.app') ||
    origin === 'http://localhost:5173' ||
    origin === 'http://localhost:3000' ||
    origin === 'http://10.0.2.2:3000'; // Android emulator localhost

  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-secret');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = getDB();

  // ────────────────────────────────────────────────────────────────────
  // GET — fetch tasks (public, no auth needed)
  // ────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { week, taskId } = req.query;

      // Single task lookup
      if (taskId) {
        const docRef = db.collection('weekly_tasks').doc(taskId);
        const snap = await docRef.get();
        if (!snap.exists) return res.status(404).json({ error: 'Task not found' });
        return res.status(200).json({ task: serializeTask(snap) });
      }

      // Determine week number to query
      const weekNumber = week ? parseInt(week, 10) : getISOWeek();

      // Query active tasks for this week
      const q = db.collection('weekly_tasks')
        .where('isActive', '==', true)
        .where('weekNumber', '==', weekNumber)
        .orderBy('createdAt', 'desc');

      const snap = await q.get();
      const tasks = snap.docs.map(serializeTask);

      return res.status(200).json({
        tasks,
        weekNumber,
        count: tasks.length,
        // Convenience fields for Student B's mobile app
        currentWeek: getISOWeek(),
        fetchedAt: new Date().toISOString(),
      });

    } catch (err) {
      console.error('[weekly-tasks GET]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  // ────────────────────────────────────────────────────────────────────
  // POST — seed or update a task (admin only)
  // Student B calls this from his mobile app to create/update tasks
  //
  // Headers required:
  //   x-admin-secret: <ADMIN_SECRET env var>
  //
  // Body: { task: { id, title, description, sdgGoal, ... } }
  // ────────────────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const adminSecret = req.headers['x-admin-secret'];
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Forbidden — invalid admin secret' });
    }

    try {
      const { task } = req.body || {};
      if (!task || !task.id) {
        return res.status(400).json({ error: 'Missing task.id in request body' });
      }

      // Validate required fields
      const required = ['title', 'description', 'sdgGoal', 'weekNumber', 'reward'];
      for (const field of required) {
        if (task[field] === undefined) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }

      // Cap reward at 50 CLB (weekly task max)
      const reward = Math.min(task.reward, 50);

      const payload = {
        ...task,
        reward,
        isActive: task.isActive ?? true,
        category: task.category ?? 'SDG Environment',
        type: task.type ?? 'reflection',
        createdBy: task.createdBy ?? 'student-b',
        updatedAt: Timestamp.now(),
        expiresAt: task.expiresAt ? Timestamp.fromDate(new Date(task.expiresAt)) : null,
      };

      const ref = db.collection('weekly_tasks').doc(task.id);
      const existing = await ref.get();

      if (existing.exists) {
        await ref.update(payload);
        return res.status(200).json({
          success: true, action: 'updated', taskId: task.id,
          message: `Task "${task.id}" updated successfully`,
        });
      } else {
        payload.createdAt = Timestamp.now();
        await ref.set(payload);
        return res.status(201).json({
          success: true, action: 'created', taskId: task.id,
          message: `Task "${task.id}" created successfully`,
        });
      }
    } catch (err) {
      console.error('[weekly-tasks POST]', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
