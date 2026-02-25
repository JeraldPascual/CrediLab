package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.credilabmobile.data.WeeklyTask;
import com.example.credilabmobile.databinding.ActivityWeeklyTasksBinding;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class WeeklyTasksActivity extends AppCompatActivity {
    private static final String TAG = "WeeklyTasksActivity";
    private ActivityWeeklyTasksBinding binding;
    private FirestoreHelper firestoreHelper;
    private WeeklyTaskAdapter adapter;
    private String currentUserUid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityWeeklyTasksBinding.inflate(getLayoutInflater());
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
        binding.btnCommunityFeed.setOnClickListener(v -> {
            startActivity(new Intent(this, CommunityFeedActivity.class));
        });

        loadTasks();
    }

    private void setupRecyclerView() {
        adapter = new WeeklyTaskAdapter(new ArrayList<>(), new HashMap<>(), (task, isCompleted) -> {
            if (isCompleted) {
                Toast.makeText(this, "You have already completed this task.", Toast.LENGTH_SHORT).show();
            } else {
                Intent opt = new Intent(this, SubmitTaskActivity.class);
                opt.putExtra("TASK_ID", task.id);
                opt.putExtra("WEEK_NUMBER", task.weekNumber);
                opt.putExtra("REWARD_CLB", task.rewardCLB);
                opt.putExtra("TASK_TYPE", task.type != null ? task.type : "reflection");
                opt.putExtra("TASK_TITLE", task.title);
                opt.putExtra("TASK_DESC", task.description);
                startActivity(opt);
            }
        });
        binding.rvWeeklyTasks.setLayoutManager(new LinearLayoutManager(this));
        binding.rvWeeklyTasks.setAdapter(adapter);
    }

    private void loadTasks() {
        firestoreHelper.getActiveWeeklyTasks(new FirestoreHelper.WeeklyTasksCallback() {
            @Override
            public void onSuccess(List<WeeklyTask> tasks) {
                if (tasks.isEmpty()) {
                    runOnUiThread(() -> Toast
                            .makeText(WeeklyTasksActivity.this, "No active tasks found.", Toast.LENGTH_SHORT).show());
                    return;
                }

                // For each task, check if completed
                Map<String, Boolean> completedStatus = new HashMap<>();
                AtomicInteger pendingChecks = new AtomicInteger(tasks.size());

                for (WeeklyTask task : tasks) {
                    firestoreHelper.hasCompletedWeeklyTask(currentUserUid, task.id, isCompleted -> {
                        completedStatus.put(task.id, isCompleted);
                        if (pendingChecks.decrementAndGet() == 0) {
                            runOnUiThread(() -> adapter.updateData(tasks, completedStatus));
                        }
                    });
                }
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Error loading weekly tasks", e);
                runOnUiThread(() -> Toast
                        .makeText(WeeklyTasksActivity.this, "Failed to load tasks.", Toast.LENGTH_SHORT).show());
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Refresh when returning from SubmitTaskActivity
        if (currentUserUid != null) {
            loadTasks();
        }
    }
}
