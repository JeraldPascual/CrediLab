package com.example.credilabmobile;

import android.util.Log;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.example.credilabmobile.data.WeeklyTask;
import com.example.credilabmobile.data.TaskSubmission;

/**
 * Read-only helper for Firestore data.
 * Reads user profile, system credit pool, and leaderboard.
 */
public class FirestoreHelper {
    private static final String TAG = "FirestoreHelper";
    private final FirebaseFirestore db;

    public FirestoreHelper() {
        db = FirebaseFirestore.getInstance();
    }

    // --- Data Models ---

    public static class UserData {
        public final String uid;
        public final String displayName;
        public final String firstName;
        public final String lastName;
        public final String email;
        public final String photoURL;
        public final String walletAddress;
        public final long credits;
        public final long totalCLBEarned;
        public final List<String> completedChallenges;
        public final String equippedFrame;
        public final List<String> equippedBadges;
        public final List<String> unlockedFrames;
        public final List<String> unlockedBadges;

        public UserData(String uid, String displayName, String firstName, String lastName,
                String email, String photoURL, String walletAddress,
                long credits, long totalCLBEarned, List<String> completedChallenges,
                String equippedFrame, List<String> equippedBadges,
                List<String> unlockedFrames, List<String> unlockedBadges) {
            this.uid = uid;
            this.displayName = displayName;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.photoURL = photoURL;
            this.walletAddress = walletAddress;
            this.credits = credits;
            this.totalCLBEarned = totalCLBEarned;
            this.completedChallenges = completedChallenges;
            this.equippedFrame = equippedFrame;
            this.equippedBadges = equippedBadges;
            this.unlockedFrames = unlockedFrames;
            this.unlockedBadges = unlockedBadges;
        }

        /** Helper: best display name available */
        public String getBestName() {
            if (displayName != null && !displayName.isEmpty())
                return displayName;
            String full = ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
            if (!full.isEmpty())
                return full;
            if (email != null)
                return email;
            return "Anonymous";
        }
    }

    public static class CreditPool {
        public final long total;
        public final long distributed;
        public final long remaining;

        public CreditPool(long total, long distributed, long remaining) {
            this.total = total;
            this.distributed = distributed;
            this.remaining = remaining;
        }
    }

    // --- Callbacks ---

    public interface UserDataCallback {
        void onSuccess(UserData data);

        void onFailure(Exception e);
    }

    public interface CreditPoolCallback {
        void onSuccess(CreditPool pool);

        void onFailure(Exception e);
    }

    public interface LeaderboardCallback {
        void onSuccess(List<UserData> users);

        void onFailure(Exception e);
    }

    public interface WeeklyTasksCallback {
        void onSuccess(List<WeeklyTask> tasks);

        void onFailure(Exception e);
    }

    public interface TaskSubmissionCallback {
        void onSuccess(List<TaskSubmission> submissions);

        void onFailure(Exception e);
    }

    // --- Helpers to safely read fields ---

    private static long safeLong(DocumentSnapshot doc, String field) {
        Long val = doc.getLong(field);
        return val != null ? val : 0;
    }

    @SuppressWarnings("unchecked")
    private static List<String> safeStringList(DocumentSnapshot doc, String field) {
        Object val = doc.get(field);
        if (val instanceof List)
            return (List<String>) val;
        return null;
    }

    private static UserData parseUserDoc(DocumentSnapshot doc) {
        return new UserData(
                doc.getId(),
                doc.getString("displayName"),
                doc.getString("firstName"),
                doc.getString("lastName"),
                doc.getString("email"),
                doc.getString("photoURL"),
                doc.getString("walletAddress"),
                safeLong(doc, "credits"),
                safeLong(doc, "totalCLBEarned"),
                safeStringList(doc, "completedChallenges"),
                doc.getString("equippedFrame"),
                safeStringList(doc, "equippedBadges"),
                safeStringList(doc, "unlockedFrames"),
                safeStringList(doc, "unlockedBadges"));
    }

    // --- Read Methods ---

    /**
     * Read user profile from Firestore: users/{uid}
     */
    public void getUserData(String uid, UserDataCallback callback) {
        db.collection("users").document(uid).get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        UserData data = parseUserDoc(doc);
                        Log.d(TAG, "User data loaded — name: " + data.getBestName()
                                + ", wallet: " + data.walletAddress
                                + ", credits: " + data.credits);
                        callback.onSuccess(data);
                    } else {
                        Log.w(TAG, "No user document found for UID: " + uid);
                        callback.onSuccess(new UserData(uid, null, null, null, null, null, null,
                                0, 0, null, null, null, null, null));
                    }
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to read user data", e);
                    callback.onFailure(e);
                });
    }

    /**
     * Read system credit pool from Firestore: system/credit_pool
     */
    public void getCreditPool(CreditPoolCallback callback) {
        db.collection("system").document("credit_pool").get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        long total = safeLong(doc, "total");
                        long distributed = safeLong(doc, "distributed");
                        long remaining = safeLong(doc, "remaining");

                        Log.d(TAG, "Credit pool — remaining: " + remaining + "/" + total);
                        callback.onSuccess(new CreditPool(total, distributed, remaining));
                    } else {
                        Log.w(TAG, "No credit_pool document found");
                        callback.onSuccess(new CreditPool(0, 0, 0));
                    }
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to read credit pool", e);
                    callback.onFailure(e);
                });
    }

    /**
     * Read all users for leaderboard, sorted by totalCLBEarned descending.
     * Returns top 20 users who have earned at least some credits.
     */
    public void getAllUsers(LeaderboardCallback callback) {
        db.collection("users").get()
                .addOnSuccessListener(snapshot -> {
                    List<UserData> users = new ArrayList<>();
                    for (DocumentSnapshot doc : snapshot.getDocuments()) {
                        UserData u = parseUserDoc(doc);
                        // Only include users with some activity
                        if (u.totalCLBEarned > 0 || u.credits > 0 ||
                                (u.completedChallenges != null && !u.completedChallenges.isEmpty())) {
                            users.add(u);
                        }
                    }
                    // Sort by totalCLBEarned descending
                    Collections.sort(users, (a, b) -> Long.compare(b.totalCLBEarned, a.totalCLBEarned));
                    // Take top 20
                    if (users.size() > 20) {
                        users = new ArrayList<>(users.subList(0, 20));
                    }
                    Log.d(TAG, "Leaderboard loaded: " + users.size() + " entries");
                    callback.onSuccess(users);
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to fetch leaderboard", e);
                    callback.onFailure(e);
                });
    }

    /**
     * Update user profile information (nickname and photo URL).
     */
    public void updateUserProfile(String uid, String nickname, String photoUrl, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        db.collection("users").document(uid)
                .update(
                        "displayName", nickname,
                        "photoURL", photoUrl)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "User profile updated successfully for UID: " + uid);
                    onSuccess.run();
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to update user profile", e);
                    onFailure.accept(e);
                });
    }

    /**
     * Update user wallet address.
     */
    public void updateWalletAddress(String uid, String walletAddress, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        db.collection("users").document(uid)
                .update("walletAddress", walletAddress)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Wallet address updated successfully for UID: " + uid);
                    if (onSuccess != null)
                        onSuccess.run();
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to update wallet address", e);
                    if (onFailure != null)
                        onFailure.accept(e);
                });
    }

    /**
     * Increase the user's credits atomically via FieldValue.increment.
     */
    public void claimQuizReward(String uid, long amount, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        db.collection("users").document(uid)
                .update(
                        "credits", com.google.firebase.firestore.FieldValue.increment(amount),
                        "totalCLBEarned", com.google.firebase.firestore.FieldValue.increment(amount))
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Quiz reward " + amount + " CLB claimed for UID: " + uid);
                    onSuccess.run();
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to claim quiz reward", e);
                    onFailure.accept(e);
                });
    }

    // --- Weekly Tasks Methods ---

    public void getActiveWeeklyTasks(WeeklyTasksCallback callback) {
        db.collection("weekly_tasks")
                .whereEqualTo("isActive", true)
                .get()
                .addOnSuccessListener(snap -> {
                    List<WeeklyTask> tasks = new ArrayList<>();
                    for (DocumentSnapshot doc : snap.getDocuments()) {
                        WeeklyTask t = new WeeklyTask();
                        t.id = doc.getId();
                        t.weekNumber = (int) safeLong(doc, "weekNumber");
                        t.title = doc.getString("title");
                        t.description = doc.getString("description");
                        t.rewardCLB = (int) safeLong(doc, "reward");
                        t.isActive = Boolean.TRUE.equals(doc.getBoolean("isActive"));
                        t.type = doc.getString("type");
                        t.sdgGoal = (int) safeLong(doc, "sdgGoal");
                        tasks.add(t);
                    }
                    callback.onSuccess(tasks);
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to get active weekly tasks", e);
                    callback.onFailure(e);
                });
    }

    public void hasCompletedWeeklyTask(String uid, String taskId, java.util.function.Consumer<Boolean> callback) {
        db.collection("weekly_completions").document(uid + "_" + taskId).get()
                .addOnSuccessListener(doc -> callback.accept(doc.exists()))
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to check completed weekly task", e);
                    callback.accept(false);
                });
    }

    public void submitWeeklyTask(TaskSubmission submission, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        db.collection("weekly_completions").document(submission.id)
                .set(submission)
                .addOnSuccessListener(aVoid -> {
                    Log.d(TAG, "Weekly task submitted: " + submission.id);
                    onSuccess.run();
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to submit weekly task", e);
                    onFailure.accept(e);
                });
    }

    public void getCommunitySubmissions(TaskSubmissionCallback callback) {
        // According to web app, it filters by status.
        db.collection("weekly_completions")
                .whereIn("status", java.util.Arrays.asList("pending_review", "community_approved", "completed"))
                .get()
                .addOnSuccessListener(snap -> {
                    List<TaskSubmission> submissions = new ArrayList<>();
                    for (DocumentSnapshot doc : snap.getDocuments()) {
                        TaskSubmission sub = doc.toObject(TaskSubmission.class);
                        if (sub != null) {
                            sub.id = doc.getId();
                            submissions.add(sub);
                        }
                    }
                    callback.onSuccess(submissions);
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Failed to get community submissions", e);
                    callback.onFailure(e);
                });
    }

    public void upvoteSubmission(String submissionId, String uid, boolean isAdding, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        com.google.firebase.firestore.DocumentReference docRef = db.collection("weekly_completions")
                .document(submissionId);

        db.runTransaction(transaction -> {
            DocumentSnapshot snapshot = transaction.get(docRef);
            if (!snapshot.exists()) {
                throw new com.google.firebase.firestore.FirebaseFirestoreException("Document does not exist",
                        com.google.firebase.firestore.FirebaseFirestoreException.Code.NOT_FOUND);
            }
            TaskSubmission current = snapshot.toObject(TaskSubmission.class);
            if (current == null)
                return null;

            if (isAdding) {
                if (!current.upvoters.contains(uid)) {
                    current.upvoters.add(uid);
                    current.upvotes++;
                }
                if (current.downvoters.contains(uid)) {
                    current.downvoters.remove(uid);
                    current.downvotes--;
                }
            } else {
                if (current.upvoters.contains(uid)) {
                    current.upvoters.remove(uid);
                    current.upvotes--;
                }
            }
            current.netScore = current.upvotes - current.downvotes;
            transaction.set(docRef, current);
            return null;
        }).addOnSuccessListener(result -> {
            if (onSuccess != null)
                onSuccess.run();
        }).addOnFailureListener(e -> {
            Log.e(TAG, "Transaction failed for upvote", e);
            if (onFailure != null)
                onFailure.accept(e);
        });
    }

    public void downvoteSubmission(String submissionId, String uid, boolean isAdding, Runnable onSuccess,
            java.util.function.Consumer<Exception> onFailure) {
        com.google.firebase.firestore.DocumentReference docRef = db.collection("weekly_completions")
                .document(submissionId);

        db.runTransaction(transaction -> {
            DocumentSnapshot snapshot = transaction.get(docRef);
            if (!snapshot.exists()) {
                throw new com.google.firebase.firestore.FirebaseFirestoreException("Document does not exist",
                        com.google.firebase.firestore.FirebaseFirestoreException.Code.NOT_FOUND);
            }
            TaskSubmission current = snapshot.toObject(TaskSubmission.class);
            if (current == null)
                return null;

            if (isAdding) {
                if (!current.downvoters.contains(uid)) {
                    current.downvoters.add(uid);
                    current.downvotes++;
                }
                if (current.upvoters.contains(uid)) {
                    current.upvoters.remove(uid);
                    current.upvotes--;
                }
            } else {
                if (current.downvoters.contains(uid)) {
                    current.downvoters.remove(uid);
                    current.downvotes--;
                }
            }
            current.netScore = current.upvotes - current.downvotes;
            transaction.set(docRef, current);
            return null;
        }).addOnSuccessListener(result -> {
            if (onSuccess != null)
                onSuccess.run();
        }).addOnFailureListener(e -> {
            Log.e(TAG, "Transaction failed for downvote", e);
            if (onFailure != null)
                onFailure.accept(e);
        });
    }
}
