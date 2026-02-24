package com.example.credilabmobile;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.List;

public class LeaderboardActivity extends AppCompatActivity {
    private static final String TAG = "LeaderboardActivity";

    private RecyclerView rvLeaderboard;
    private ProgressBar progressBar;
    private LinearLayout emptyState;
    private LeaderboardAdapter adapter;
    private FirestoreHelper firestoreHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_leaderboard);

        rvLeaderboard = findViewById(R.id.rvLeaderboard);
        progressBar = findViewById(R.id.progressBar);
        emptyState = findViewById(R.id.emptyState);

        adapter = new LeaderboardAdapter();
        rvLeaderboard.setLayoutManager(new LinearLayoutManager(this));
        rvLeaderboard.setAdapter(adapter);

        firestoreHelper = new FirestoreHelper();

        // Back button
        ImageView btnBack = findViewById(R.id.btnBack);
        btnBack.setOnClickListener(v -> finish());

        // Refresh button
        ImageView btnRefresh = findViewById(R.id.btnRefresh);
        btnRefresh.setOnClickListener(v -> loadLeaderboard());

        loadLeaderboard();
    }

    private void loadLeaderboard() {
        progressBar.setVisibility(View.VISIBLE);
        emptyState.setVisibility(View.GONE);
        rvLeaderboard.setVisibility(View.GONE);

        firestoreHelper.getAllUsers(new FirestoreHelper.LeaderboardCallback() {
            @Override
            public void onSuccess(List<FirestoreHelper.UserData> users) {
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    if (users.isEmpty()) {
                        emptyState.setVisibility(View.VISIBLE);
                        rvLeaderboard.setVisibility(View.GONE);
                    } else {
                        emptyState.setVisibility(View.GONE);
                        rvLeaderboard.setVisibility(View.VISIBLE);
                        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
                        String uid = currentUser != null ? currentUser.getUid() : null;
                        adapter.setData(users, uid);
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    emptyState.setVisibility(View.VISIBLE);
                    Log.e(TAG, "Failed to load leaderboard", e);
                    Toast.makeText(LeaderboardActivity.this,
                            "Failed to load leaderboard", Toast.LENGTH_SHORT).show();
                });
            }
        });
    }
}
