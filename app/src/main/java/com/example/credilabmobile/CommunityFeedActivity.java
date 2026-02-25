package com.example.credilabmobile;

import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.credilabmobile.data.TaskSubmission;
import com.example.credilabmobile.databinding.ActivityCommunityFeedBinding;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CommunityFeedActivity extends AppCompatActivity {
    private static final String TAG = "CommunityFeedActivity";
    private ActivityCommunityFeedBinding binding;
    private FirestoreHelper firestoreHelper;
    private CommunityFeedAdapter adapter;
    private String currentUserUid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCommunityFeedBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        firestoreHelper = new FirestoreHelper();
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            currentUserUid = user.getUid();
        } else {
            Toast.makeText(this, "Not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        setupRecyclerView();

        binding.btnClose.setOnClickListener(v -> finish());

        loadFeed();
    }

    private void setupRecyclerView() {
        adapter = new CommunityFeedAdapter(new ArrayList<>(), currentUserUid, (submission, isUpvote, isAdding) -> {
            if (isUpvote) {
                firestoreHelper.upvoteSubmission(submission.id, currentUserUid, isAdding, this::loadFeed, e -> {
                    Toast.makeText(this, "Failed to upvote", Toast.LENGTH_SHORT).show();
                });
            } else {
                firestoreHelper.downvoteSubmission(submission.id, currentUserUid, isAdding, this::loadFeed, e -> {
                    Toast.makeText(this, "Failed to downvote", Toast.LENGTH_SHORT).show();
                });
            }
        });

        binding.rvCommunityFeed.setLayoutManager(new LinearLayoutManager(this));
        binding.rvCommunityFeed.setAdapter(adapter);
    }

    private void loadFeed() {
        firestoreHelper.getCommunitySubmissions(new FirestoreHelper.TaskSubmissionCallback() {
            @Override
            public void onSuccess(List<TaskSubmission> submissions) {
                if (submissions.isEmpty()) {
                    runOnUiThread(() -> Toast
                            .makeText(CommunityFeedActivity.this, "No community submissions yet.", Toast.LENGTH_SHORT)
                            .show());
                    return;
                }

                // Sort by completedAt descending
                Collections.sort(submissions, (a, b) -> {
                    if (a.completedAt == null || b.completedAt == null)
                        return 0;
                    return b.completedAt.compareTo(a.completedAt);
                });

                runOnUiThread(() -> adapter.updateData(submissions));
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Failed to load community feed", e);
                runOnUiThread(() -> Toast
                        .makeText(CommunityFeedActivity.this, "Failed to load feed.", Toast.LENGTH_SHORT).show());
            }
        });
    }
}
