package com.example.credilabmobile;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.List;

public class LeaderboardFragment extends Fragment {
    private static final String TAG = "LeaderboardFragment";

    private RecyclerView rvLeaderboard;
    private ProgressBar progressBar;
    private LinearLayout emptyState;
    private LeaderboardAdapter adapter;
    private FirestoreHelper firestoreHelper;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_leaderboard, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        rvLeaderboard = view.findViewById(R.id.rvLeaderboard);
        progressBar = view.findViewById(R.id.progressBar);
        emptyState = view.findViewById(R.id.emptyState);
        ImageView btnRefresh = view.findViewById(R.id.btnRefresh);

        View cvLeaderboard = view.findViewById(R.id.cvLeaderboard);
        if (cvLeaderboard != null) {
            View header = cvLeaderboard.findViewById(R.id.tvHeaderTitle);
            if (header instanceof android.widget.TextView)
                ((android.widget.TextView) header).setText("Leaderboard");
            View icon = cvLeaderboard.findViewById(R.id.ivHeaderIcon);
            if (icon != null)
                icon.setVisibility(View.GONE);
        }

        adapter = new LeaderboardAdapter();
        rvLeaderboard.setLayoutManager(new LinearLayoutManager(requireContext()));
        rvLeaderboard.setAdapter(adapter);

        firestoreHelper = new FirestoreHelper();

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
                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
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
            }

            @Override
            public void onFailure(Exception e) {
                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        progressBar.setVisibility(View.GONE);
                        emptyState.setVisibility(View.VISIBLE);
                        Log.e(TAG, "Failed to load leaderboard", e);
                        Toast.makeText(requireContext(), "Failed to load leaderboard", Toast.LENGTH_SHORT).show();
                    });
                }
            }
        });
    }
}
