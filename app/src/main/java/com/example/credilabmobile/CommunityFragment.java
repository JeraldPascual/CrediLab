package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.credilabmobile.data.TaskSubmission;
import com.example.credilabmobile.data.WeeklyTask;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

public class CommunityFragment extends Fragment {
    private static final String TAG = "CommunityFragment";
    private FirestoreHelper firestoreHelper;
    private CommunityFeedAdapter adapter;
    private String currentUserUid;
    private RecyclerView rvCommunityFeed;
    private RecyclerView rvWeeklyTasks;
    private WeeklyTaskAdapter weeklyTaskAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_community, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvCommunityFeed = view.findViewById(R.id.rvCommunityFeed);
        rvWeeklyTasks = view.findViewById(R.id.rvWeeklyTasks);
        firestoreHelper = new FirestoreHelper();
        FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
        if (user != null) {
            currentUserUid = user.getUid();
        } else {
            Toast.makeText(requireContext(), "Not logged in", Toast.LENGTH_SHORT).show();
            return;
        }

        setupRecyclerView();
        loadTasks();
        loadFeed();
    }

    private void setupRecyclerView() {
        adapter = new CommunityFeedAdapter(new ArrayList<>(), currentUserUid, (submission, isUpvote, isAdding) -> {
            if (isUpvote) {
                firestoreHelper.upvoteSubmission(submission.id, currentUserUid, isAdding, this::loadFeed, e -> {
                    if (isAdded())
                        Toast.makeText(requireContext(), "Failed to upvote", Toast.LENGTH_SHORT).show();
                });
            } else {
                firestoreHelper.downvoteSubmission(submission.id, currentUserUid, isAdding, this::loadFeed, e -> {
                    if (isAdded())
                        Toast.makeText(requireContext(), "Failed to downvote", Toast.LENGTH_SHORT).show();
                });
            }
        });

        rvCommunityFeed.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvCommunityFeed.setAdapter(adapter);

        weeklyTaskAdapter = new WeeklyTaskAdapter(new ArrayList<>(), new HashMap<>(), (task, isCompleted) -> {
            if (isCompleted) {
                Toast.makeText(requireContext(), "You have already completed this task.", Toast.LENGTH_SHORT).show();
            } else {
                Intent opt = new Intent(requireActivity(), SubmitTaskActivity.class);
                opt.putExtra("TASK_ID", task.id);
                opt.putExtra("WEEK_NUMBER", task.weekNumber);
                opt.putExtra("REWARD_CLB", task.rewardCLB);
                opt.putExtra("TASK_TYPE", task.type != null ? task.type : "reflection");
                opt.putExtra("TASK_TITLE", task.title);
                opt.putExtra("TASK_DESC", task.description);
                startActivity(opt);
            }
        });
        rvWeeklyTasks.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvWeeklyTasks.setAdapter(weeklyTaskAdapter);
    }

    private void loadFeed() {
        firestoreHelper.getCommunitySubmissions(new FirestoreHelper.TaskSubmissionCallback() {
            @Override
            public void onSuccess(List<TaskSubmission> submissions) {
                if (submissions.isEmpty()) {
                    if (isAdded())
                        requireActivity().runOnUiThread(() -> Toast
                                .makeText(requireContext(), "No community submissions yet.", Toast.LENGTH_SHORT)
                                .show());
                    return;
                }

                Collections.sort(submissions, (a, b) -> {
                    if (a.completedAt == null || b.completedAt == null)
                        return 0;
                    return b.completedAt.compareTo(a.completedAt);
                });

                if (isAdded())
                    requireActivity().runOnUiThread(() -> adapter.updateData(submissions));
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Failed to load community feed", e);
                if (isAdded())
                    requireActivity().runOnUiThread(
                            () -> Toast.makeText(requireContext(), "Failed to load feed.", Toast.LENGTH_SHORT).show());
            }
        });
    }

    private void loadTasks() {
        firestoreHelper.getActiveWeeklyTasks(new FirestoreHelper.WeeklyTasksCallback() {
            @Override
            public void onSuccess(List<WeeklyTask> tasks) {
                if (tasks.isEmpty()) {
                    return;
                }

                Map<String, Boolean> completedStatus = new HashMap<>();
                AtomicInteger pendingChecks = new AtomicInteger(tasks.size());

                for (WeeklyTask task : tasks) {
                    firestoreHelper.hasCompletedWeeklyTask(currentUserUid, task.id, isCompleted -> {
                        completedStatus.put(task.id, isCompleted);
                        if (pendingChecks.decrementAndGet() == 0) {
                            if (isAdded())
                                requireActivity()
                                        .runOnUiThread(() -> weeklyTaskAdapter.updateData(tasks, completedStatus));
                        }
                    });
                }
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Error loading weekly tasks", e);
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        if (currentUserUid != null) {
            loadTasks();
            loadFeed();
        }
    }
}
