package com.example.credilabmobile;

import android.net.Uri;
import android.util.Log;

import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.UUID;

public class StorageHelper {
    private static final String TAG = "StorageHelper";
    private final FirebaseStorage storage;

    public StorageHelper() {
        storage = FirebaseStorage.getInstance();
    }

    public interface UploadCallback {
        void onSuccess(String downloadUrl);

        void onFailure(Exception e);
    }

    /**
     * Upload an image URI to Firebase Storage and get its download URL.
     */
    public void uploadProfileImage(String uid, Uri imageUri, UploadCallback callback) {
        if (imageUri == null) {
            callback.onFailure(new Exception("Image URI is null"));
            return;
        }

        // Create a reference to "profile_images/<uid>.jpg"
        // Also appending a timestamp to bust cached images on the client side
        String fileName = "profile_images/" + uid + "_" + System.currentTimeMillis() + ".jpg";
        StorageReference profileRef = storage.getReference().child(fileName);

        Log.d(TAG, "Starting upload for: " + fileName);
        profileRef.putFile(imageUri)
                .addOnSuccessListener(taskSnapshot -> {
                    // Get the download URL once upload is successful
                    profileRef.getDownloadUrl()
                            .addOnSuccessListener(uri -> {
                                Log.d(TAG, "Upload successful, D/L URL: " + uri.toString());
                                callback.onSuccess(uri.toString());
                            })
                            .addOnFailureListener(e -> {
                                Log.e(TAG, "Failed to get download URL", e);
                                callback.onFailure(e);
                            });
                })
                .addOnFailureListener(e -> {
                    Log.e(TAG, "Upload failed for: " + fileName, e);
                    callback.onFailure(e);
                });
    }
}
