package com.example.credilabmobile;

import android.app.AlertDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.FileProvider;

import com.bumptech.glide.Glide;
import com.example.credilabmobile.data.TaskSubmission;
import com.example.credilabmobile.databinding.ActivitySubmitTaskBinding;
import com.google.firebase.Timestamp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

public class SubmitTaskActivity extends AppCompatActivity {
    private static final String TAG = "SubmitTaskActivity";
    private ActivitySubmitTaskBinding binding;
    private FirestoreHelper firestoreHelper;
    private FirebaseAuth firebaseAuth;
    private FirebaseUser currentUser;

    private String taskId;
    private int weekNumber;
    private int rewardCLB;
    private String taskType;

    private Uri currentPhotoUri;
    private Uri tempCameraUri;

    private final ActivityResultLauncher<Intent> takePictureLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    currentPhotoUri = tempCameraUri;
                    Glide.with(this).load(currentPhotoUri).into(binding.ivPhotoPreview);
                }
            });

    private final ActivityResultLauncher<String> pickGalleryLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    currentPhotoUri = uri;
                    Glide.with(this).load(currentPhotoUri).into(binding.ivPhotoPreview);
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySubmitTaskBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        firestoreHelper = new FirestoreHelper();
        firebaseAuth = FirebaseAuth.getInstance();
        currentUser = firebaseAuth.getCurrentUser();

        if (currentUser == null) {
            Toast.makeText(this, "Not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        Intent intent = getIntent();
        taskId = intent.getStringExtra("TASK_ID");
        weekNumber = intent.getIntExtra("WEEK_NUMBER", -1);
        rewardCLB = intent.getIntExtra("REWARD_CLB", 0);
        taskType = intent.getStringExtra("TASK_TYPE");
        String taskTitle = intent.getStringExtra("TASK_TITLE");
        String taskDesc = intent.getStringExtra("TASK_DESC");

        binding.tvTaskTitle.setText(taskTitle);
        binding.tvTaskDesc.setText(taskDesc);
        binding.tvReward.setText("+" + rewardCLB + " CLB");

        if ("photo".equals(taskType)) {
            binding.layoutPhotoSection.setVisibility(View.VISIBLE);
        } else {
            binding.layoutPhotoSection.setVisibility(View.GONE);
        }

        binding.btnClose.setOnClickListener(v -> finish());
        binding.btnSelectPhoto.setOnClickListener(v -> showPhotoOptions());
        binding.btnSubmit.setOnClickListener(v -> submitTask());
    }

    private void showPhotoOptions() {
        String[] options = { "Take Photo", "Choose from Gallery", "Cancel" };
        new com.google.android.material.dialog.MaterialAlertDialogBuilder(this)
                .setTitle("Select Photo Source")
                .setItems(options, (dialog, which) -> {
                    if (which == 0) {
                        launchCamera();
                    } else if (which == 1) {
                        pickGalleryLauncher.launch("image/*");
                    } else {
                        dialog.dismiss();
                    }
                })
                .show();
    }

    private void launchCamera() {
        try {
            File photoFile = File.createTempFile("task_", ".jpg", new File(getCacheDir(), "camera_photos"));
            if (!photoFile.getParentFile().exists()) {
                photoFile.getParentFile().mkdirs();
            }
            tempCameraUri = FileProvider.getUriForFile(this, getPackageName() + ".provider", photoFile);

            Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, tempCameraUri);
            takePictureLauncher.launch(takePictureIntent);
        } catch (IOException ex) {
            Log.e(TAG, "Error creating camera file", ex);
            Toast.makeText(this, "Failed to prep camera", Toast.LENGTH_SHORT).show();
        }
    }

    private void submitTask() {
        String response = binding.etResponse.getText() != null ? binding.etResponse.getText().toString().trim() : "";

        if ("photo".equals(taskType) && currentPhotoUri == null) {
            Toast.makeText(this, "A photo is required for this task.", Toast.LENGTH_SHORT).show();
            return;
        }

        if (TextUtils.isEmpty(response) && !"photo".equals(taskType)) {
            Toast.makeText(this, "Please provide a reflection or response.", Toast.LENGTH_SHORT).show();
            return;
        }

        binding.btnSubmit.setEnabled(false);
        binding.btnSubmit.setText("Submitting...");

        // Process image if any
        String base64Image = null;
        if (currentPhotoUri != null) {
            base64Image = compressImageToBase64(currentPhotoUri);
            if (base64Image == null) {
                Toast.makeText(this, "Failed to process image.", Toast.LENGTH_SHORT).show();
                binding.btnSubmit.setEnabled(true);
                binding.btnSubmit.setText("Submit Task");
                return;
            }
        }

        final String finalBase64Image = base64Image;

        // According to web app, fetch student name (or email) for the submission
        firestoreHelper.getUserData(currentUser.getUid(), new FirestoreHelper.UserDataCallback() {
            @Override
            public void onSuccess(FirestoreHelper.UserData userData) {
                createAndSubmitTask(userData, response, currentPhotoUri != null ? finalBase64Image : null);
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Failed to fetch user data for submission", e);
                // Fallback to minimal user info
                FirestoreHelper.UserData fallback = new FirestoreHelper.UserData(currentUser.getUid(), null, null, null,
                        currentUser.getEmail(), null, null, 0, 0, null, null, null, null, null);
                createAndSubmitTask(fallback, response, currentPhotoUri != null ? finalBase64Image : null); // Without
                                                                                                            // currentPhotoUri
                                                                                                            // since
                                                                                                            // already
                                                                                                            // null
                                                                                                            // handled?
                // Wait, I need base64.
            }
        });
    }

    private void createAndSubmitTask(FirestoreHelper.UserData userData, String response, String photoBase64) {
        TaskSubmission submission = new TaskSubmission();
        submission.uid = currentUser.getUid();
        submission.taskId = taskId;
        submission.id = submission.uid + "_" + submission.taskId;
        submission.weekNumber = weekNumber;
        submission.completedAt = new Timestamp(new Date());
        submission.response = response;
        submission.photoBase64 = photoBase64;
        submission.rewardCLB = rewardCLB;
        submission.taskType = taskType != null ? taskType : "reflection";
        submission.displayName = userData.getBestName();
        submission.email = currentUser.getEmail();
        submission.photoURL = userData.photoURL != null ? userData.photoURL
                : (currentUser.getPhotoUrl() != null ? currentUser.getPhotoUrl().toString() : "");

        boolean needsReview = "photo".equals(taskType) || photoBase64 != null;
        submission.status = needsReview ? "pending_review" : "completed";

        firestoreHelper.submitWeeklyTask(submission,
                () -> {
                    runOnUiThread(() -> {
                        Toast.makeText(SubmitTaskActivity.this,
                                needsReview ? "Submitted for review!" : "Task Completed!", Toast.LENGTH_LONG).show();

                        // If it auto-completes, we should immediately reward the user.
                        // The web app doesn't seem to do client-side reward on submit (it waits for
                        // cloud function or doesn't say).
                        // Let's increment CLB if it is completed directly.
                        if (!needsReview) {
                            firestoreHelper.claimQuizReward(currentUser.getUid(), rewardCLB, () -> {
                                finish();
                            }, e -> {
                                finish();
                            });
                        } else {
                            finish();
                        }
                    });
                },
                e -> {
                    runOnUiThread(() -> {
                        Toast.makeText(SubmitTaskActivity.this, "Submission failed.", Toast.LENGTH_SHORT).show();
                        binding.btnSubmit.setEnabled(true);
                        binding.btnSubmit.setText("Submit Task");
                    });
                });
    }

    private String compressImageToBase64(Uri uri) {
        try {
            InputStream is = getContentResolver().openInputStream(uri);
            Bitmap bitmap = BitmapFactory.decodeStream(is);
            is.close();

            if (bitmap == null)
                return null;

            // Resize if too large (e.g. max width/height 1024)
            int maxWidth = 1024;
            int maxHeight = 1024;
            float ratio = Math.min(
                    (float) maxWidth / bitmap.getWidth(),
                    (float) maxHeight / bitmap.getHeight());

            if (ratio < 1.0f) {
                int newWidth = Math.round(ratio * bitmap.getWidth());
                int newHeight = Math.round(ratio * bitmap.getHeight());
                bitmap = Bitmap.createScaledBitmap(bitmap, newWidth, newHeight, true);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.JPEG, 70, baos);
            byte[] imageBytes = baos.toByteArray();
            String base64 = Base64.encodeToString(imageBytes, Base64.NO_WRAP);
            return "data:image/jpeg;base64," + base64;

        } catch (Exception e) {
            Log.e(TAG, "Failed to compress image", e);
            return null;
        }
    }
}
