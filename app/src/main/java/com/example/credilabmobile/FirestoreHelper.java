package com.example.credilabmobile;

import android.util.Log;

import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.List;
import java.util.Map;

/**
 * Read-only helper for Firestore data.
 * Reads user profile (walletAddress, credits) and system credit pool.
 */
public class FirestoreHelper {
    private static final String TAG = "FirestoreHelper";
    private final FirebaseFirestore db;

    public FirestoreHelper() {
        db = FirebaseFirestore.getInstance();
    }

    // --- Data Models ---

    public static class UserData {
        public final String walletAddress;
        public final long credits;
        public final long totalCLBEarned;
        public final List<String> completedChallenges;

        public UserData(String walletAddress, long credits, long totalCLBEarned, List<String> completedChallenges) {
            this.walletAddress = walletAddress;
            this.credits = credits;
            this.totalCLBEarned = totalCLBEarned;
            this.completedChallenges = completedChallenges;
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

    // --- Read Methods ---

    /**
     * Read user profile from Firestore: users/{uid}
     */
    public void getUserData(String uid, UserDataCallback callback) {
        db.collection("users").document(uid).get()
                .addOnSuccessListener(doc -> {
                    if (doc.exists()) {
                        String walletAddress = doc.getString("walletAddress");
                        long credits = doc.getLong("credits") != null ? doc.getLong("credits") : 0;
                        long totalCLBEarned = doc.getLong("totalCLBEarned") != null ? doc.getLong("totalCLBEarned") : 0;

                        @SuppressWarnings("unchecked")
                        List<String> challenges = (List<String>) doc.get("completedChallenges");

                        Log.d(TAG, "User data loaded — wallet: " + walletAddress + ", credits: " + credits);
                        callback.onSuccess(new UserData(walletAddress, credits, totalCLBEarned, challenges));
                    } else {
                        Log.w(TAG, "No user document found for UID: " + uid);
                        callback.onSuccess(new UserData(null, 0, 0, null));
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
                        long total = doc.getLong("total") != null ? doc.getLong("total") : 0;
                        long distributed = doc.getLong("distributed") != null ? doc.getLong("distributed") : 0;
                        long remaining = doc.getLong("remaining") != null ? doc.getLong("remaining") : 0;

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
}
