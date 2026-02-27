import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeftIcon,
  CameraIcon,
  PhotoIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import {
  STATIC_WEEKLY_TASKS,
  getCurrentWeekNumber,
  getActiveWeeklyTasks,
  hasCompletedWeeklyTask,
  completeWeeklyTask,
} from "../data/weeklyTasks";
import { SDG_GOALS, SDG_ICONS } from "../data/weeklyTasks";

// ΓöÇΓöÇ Photo Compression Utility ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// Compresses images client-side to <800KB base64 ΓÇö stored in Firestore
// directly. No Firebase Storage / Blaze plan required.
async function compressPhoto(file, maxSizeKB = 800, maxDim = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if larger than maxDim
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively reduce quality until under maxSizeKB
        let quality = 0.8;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        // If still too large, scale dimensions down more
        if (dataUrl.length > maxSizeKB * 1024 * 1.37) {
          const scale = 0.6;
          canvas.width = Math.round(width * scale);
          canvas.height = Math.round(height * scale);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        }

        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WeeklyTaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  const fileInputRef = useRef(null);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyDone, setAlreadyDone] = useState(false);

  // Form state
  const [response, setResponse] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState(null);

  // Load task data + check completion status
  useEffect(() => {
    if (!taskId || !user) return;

    (async () => {
      try {
        // Try Firestore first, fall back to static
        let tasks = await getActiveWeeklyTasks();
        let found = tasks.find((t) => t.id === taskId);

        if (!found) {
          found = STATIC_WEEKLY_TASKS.find((t) => t.id === taskId);
        }

        setTask(found || null);

        // Check if already submitted
        const done = await hasCompletedWeeklyTask(user.uid, taskId);
        setAlreadyDone(done);
      } catch (e) {
        console.error("Failed to load task:", e);
        const fallback = STATIC_WEEKLY_TASKS.find((t) => t.id === taskId);
        setTask(fallback || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId, user]);

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
  const minWords = task?.minWordCount ?? 30;
  const maxWords = task?.maxWordCount ?? 200;
  const isPhoto = task?.type === "photo" || task?.requiresPhoto;
  const wordsValid = wordCount >= minWords && wordCount <= maxWords;
  const photoValid = isPhoto ? !!photoBase64 : true;
  const canSubmit = wordsValid && photoValid && !submitting && !submitted;

  // Handle photo selection
  const handlePhotoSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File too large. Max 10MB before compression.");
      return;
    }

    setError(null);
    setCompressing(true);

    try {
      const compressed = await compressPhoto(file, task?.maxPhotoSizeKB ?? 800);
      setPhotoBase64(compressed);
      setPhotoPreview(compressed);
    } catch {
      setError("Failed to process image. Try a different photo.");
    } finally {
      setCompressing(false);
    }
  }, [task]);

  // Handle submission
  const handleSubmit = useCallback(async () => {
    if (!canSubmit || !user || !task) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await completeWeeklyTask(
        user.uid,
        task.id,
        task.weekNumber ?? getCurrentWeekNumber(),
        task.reward ?? 25,
        {
          response,
          photoBase64: isPhoto ? photoBase64 : null,
          taskType: task.type ?? "reflection",
          displayName: userData?.displayName ?? user.displayName ?? "",
          email: userData?.email ?? user.email ?? "",
        }
      );

      if (result.success) {
        setSubmitted(true);
        setSubmitResult(result);
      } else {
        setError(result.error || "Submission failed.");
      }
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }, [canSubmit, user, task, response, photoBase64, isPhoto, userData]);

  // ΓöÇΓöÇ Loading state ΓöÇΓöÇ
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  // ΓöÇΓöÇ Not found ΓöÇΓöÇ
  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center gap-4">
        <ExclamationTriangleIcon className="w-10 h-10 text-gray-400" />
        <p className="text-gray-500 dark:text-dark-muted">Task not found.</p>
        <Link to="/problem" className="text-sm text-green-primary hover:underline">ΓåÉ Back to Challenges</Link>
      </div>
    );
  }

  // ΓöÇΓöÇ Already submitted ΓöÇΓöÇ
  if (alreadyDone && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center gap-4 px-4">
        <CheckCircleIcon className="w-12 h-12 text-emerald-400" />
        <p className="text-lg font-semibold text-emerald-400">Already Submitted</p>
        <p className="text-sm text-gray-500 dark:text-dark-muted text-center max-w-md">
          You've already submitted this task. {isPhoto ? "It's now in the community feed for voting." : "CLB has been credited."}
        </p>
        <Link to="/problem" className="text-sm text-green-primary hover:underline mt-2">ΓåÉ Back to Challenges</Link>
      </div>
    );
  }

  // ΓöÇΓöÇ Success state ΓöÇΓöÇ
  if (submitted && submitResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col items-center justify-center gap-4 px-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircleIcon className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-white text-[10px] font-bold">Γ£ô</div>
        </div>
        <p className="text-xl font-bold text-white">
          {submitResult.status === "pending_review" ? "Submitted for Review!" : "Task Complete!"}
        </p>
        <p className="text-sm text-gray-400 dark:text-dark-muted text-center max-w-md">
          {submitResult.message}
        </p>
        {submitResult.status === "pending_review" && (
          <div className="flex items-center gap-2 mt-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <ClockIcon className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Visible in Community Feed</span>
          </div>
        )}
        <Link to="/problem" className="mt-4 px-5 py-2 rounded-lg bg-green-primary text-white text-sm font-semibold hover:bg-green-600 transition-colors">
          Back to Challenges
        </Link>
      </div>
    );
  }

  // ΓöÇΓöÇ Main form ΓöÇΓöÇ
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 h-14">
          <button onClick={() => navigate("/problem")} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-dark-muted" />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg">{SDG_ICONS[task.sdgGoal] ?? "≡ƒî▒"}</span>
            <span className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</span>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            +{task.reward} CLB
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* SDG Card */}
        <div className="rounded-xl bg-gradient-to-br from-emerald-950/70 to-teal-900/50 border border-emerald-500/20 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex flex-col items-center justify-center">
              <span className="text-lg leading-none">{task.sdgGoal}</span>
              <span className="text-[8px] font-bold text-emerald-400">SDG</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{SDG_GOALS[task.sdgGoal] ?? task.sdgLabel}</p>
              <p className="text-[11px] text-emerald-400/60 uppercase tracking-wider font-medium">
                {task.type === "photo" ? "≡ƒô╕ Photo Submission" : "Γ£ì∩╕Å Written Reflection"} ┬╖ Week {task.weekNumber}
              </p>
            </div>
          </div>
          <p className="text-sm text-emerald-100/80 leading-relaxed">{task.description}</p>
        </div>

        {/* Prompt */}
        <div className="rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">≡ƒôï Your Task</h3>
          <p className="text-sm text-gray-600 dark:text-dark-muted leading-relaxed">{task.prompt}</p>
        </div>

        {/* Photo Upload (for photo tasks) */}
        {isPhoto && (
          <div className="rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CameraIcon className="w-4 h-4 text-emerald-500" />
              Upload Photo Proof
            </h3>

            {photoPreview ? (
              <div className="relative group">
                <img
                  src={photoPreview}
                  alt="Submission preview"
                  className="w-full rounded-lg border border-emerald-500/30 max-h-80 object-cover"
                />
                <button
                  onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold">
                  Γ£ô Photo ready
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={compressing}
                className="w-full flex flex-col items-center gap-3 py-8 rounded-xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/5 transition-all cursor-pointer"
              >
                {compressing ? (
                  <>
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-500/40 border-t-emerald-400 animate-spin" />
                    <span className="text-xs text-emerald-400">CompressingΓÇª</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <PhotoIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-dark-text">
                        Tap to upload photo
                      </p>
                      <p className="text-xs text-gray-400 dark:text-dark-muted mt-0.5">
                        JPG, PNG ┬╖ Auto-compressed to &lt;800KB
                      </p>
                    </div>
                  </>
                )}
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Text Response */}
        <div className="rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Γ£ì∩╕Å Your {isPhoto ? "Description" : "Reflection"}
          </h3>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={isPhoto
              ? "Describe what you did and why it mattersΓÇª"
              : "Write your reflection hereΓÇª"
            }
            rows={5}
            className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 resize-none transition-shadow"
          />
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${
              wordCount < minWords
                ? "text-gray-400 dark:text-dark-muted"
                : wordCount > maxWords
                ? "text-red-500"
                : "text-emerald-500"
            }`}>
              {wordCount} / {minWords}ΓÇô{maxWords} words
            </span>
            {wordCount > 0 && wordCount < minWords && (
              <span className="text-gray-400 dark:text-dark-muted">{minWords - wordCount} more needed</span>
            )}
            {wordCount > maxWords && (
              <span className="text-red-500">{wordCount - maxWords} over limit</span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${
            canSubmit
              ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
              : "bg-gray-200 dark:bg-dark-border text-gray-400 dark:text-dark-muted cursor-not-allowed"
          }`}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              SubmittingΓÇª
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="w-4 h-4" />
              {isPhoto ? "Submit for Review" : "Submit Reflection"}
            </>
          )}
        </button>

        {/* Info footer */}
        <div className="text-center pb-6">
          <p className="text-[11px] text-gray-400 dark:text-dark-muted">
            {isPhoto
              ? "≡ƒô╕ Photo submissions are voted on by the community in the feed"
              : "Γ£à Reflections are auto-approved and CLB is credited instantly"
            }
          </p>
        </div>
      </div>
    </div>
  );
}
