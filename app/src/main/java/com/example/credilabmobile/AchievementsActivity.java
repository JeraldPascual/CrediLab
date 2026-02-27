package com.example.credilabmobile;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.tabs.TabLayout;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.Arrays;
import java.util.List;

public class AchievementsActivity extends AppCompatActivity {

    private static final String TAG = "AchievementsActivity";

    private TierFrameView tfvCurrentRank;
    private TextView tvCurrentRankTitle, tvCurrentRankDesc, tvTotalClb, tvChallengesSolved, tvSpendableClb;
    private TextView tvProgressLabel, tvNextRank, tvProgressValues, tvRemainingClb, tvCurrentSpendableBox;
    private ProgressBar pbRankProgress;

    private TabLayout tabLayout;
    private RecyclerView rvSkillTiers;
    private RecyclerView rvBadges;

    private FirestoreHelper firestoreHelper;
    private BadgesHelper badgesHelper;
    private FirebaseAuth mAuth;

    private List<TiersAdapter.Tier> tierList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_achievements);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setTitle("Achievements & Credentials");
        }
        toolbar.setNavigationOnClickListener(v -> finish());

        mAuth = FirebaseAuth.getInstance();
        firestoreHelper = new FirestoreHelper();
        badgesHelper = new BadgesHelper(this);

        initViews();
        setupTabs();
        setupTierList();

        loadUserData();
    }

    private void initViews() {
        tfvCurrentRank = findViewById(R.id.tfvCurrentRank);
        tvCurrentRankTitle = findViewById(R.id.tvCurrentRankTitle);
        tvCurrentRankDesc = findViewById(R.id.tvCurrentRankDesc);
        tvTotalClb = findViewById(R.id.tvTotalClb);
        tvChallengesSolved = findViewById(R.id.tvChallengesSolved);
        tvSpendableClb = findViewById(R.id.tvSpendableClb);

        tvProgressLabel = findViewById(R.id.tvProgressLabel);
        tvNextRank = findViewById(R.id.tvNextRank);
        tvProgressValues = findViewById(R.id.tvProgressValues);
        tvRemainingClb = findViewById(R.id.tvRemainingClb);
        pbRankProgress = findViewById(R.id.pbRankProgress);
        tvCurrentSpendableBox = findViewById(R.id.tvCurrentSpendableBox);

        tabLayout = findViewById(R.id.tabLayout);
        rvSkillTiers = findViewById(R.id.rvSkillTiers);
        rvBadges = findViewById(R.id.rvBadges);

        View btnWebPromo = findViewById(R.id.btnOpenWebPromoAchievements);
        if (btnWebPromo != null) {
            btnWebPromo.setOnClickListener(v -> {
                android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://credilab.vercel.app/"));
                startActivity(intent);
            });
        }
    }

    private void setupTierList() {
        tierList = Arrays.asList(
                new TiersAdapter.Tier("Novice Coder", 0, "Just starting the journey into code."),
                new TiersAdapter.Tier("Apprentice Developer", 50, "Solving basic problems with confidence."),
                new TiersAdapter.Tier("Junior Programmer", 130, "Building functional programs and applications."),
                new TiersAdapter.Tier("Intermediate Coder", 280, "Writing clean, efficient, and well-structured code."),
                new TiersAdapter.Tier("Advanced Developer", 480, "Mastering complex algorithms and architecture."),
                new TiersAdapter.Tier("Expert Engineer", 730,
                        "A true master of the craft, capable of architecting entire systems."));
    }

    private void setupTabs() {
        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    rvSkillTiers.setVisibility(View.VISIBLE);
                    rvBadges.setVisibility(View.GONE);
                } else {
                    rvSkillTiers.setVisibility(View.GONE);
                    rvBadges.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
            }
        });
    }

    private void loadUserData() {
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if (currentUser == null) {
            Toast.makeText(this, "Not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        firestoreHelper.getUserData(currentUser.getUid(), new FirestoreHelper.UserDataCallback() {
            @Override
            public void onSuccess(FirestoreHelper.UserData data) {
                updateUI(data);
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Failed to load user data", e);
                Toast.makeText(AchievementsActivity.this, "Error loading profile", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateUI(FirestoreHelper.UserData userData) {
        long totalClb = userData.totalCLBEarned;

        TiersAdapter.Tier currentTier = tierList.get(0);
        TiersAdapter.Tier nextTier = null;
        String tierType = "common";

        for (int i = 0; i < tierList.size(); i++) {
            if (totalClb >= tierList.get(i).requiredClb) {
                currentTier = tierList.get(i);
                tierType = getTierType(i);
            }
        }

        int currentIndex = tierList.indexOf(currentTier);
        if (currentIndex < tierList.size() - 1) {
            nextTier = tierList.get(currentIndex + 1);
        }

        tvCurrentRankTitle.setText(currentTier.name);
        tvCurrentRankDesc.setText(currentTier.description);
        tvTotalClb.setText(String.valueOf(totalClb));
        tvSpendableClb.setText(userData.credits + " CLB spendable");
        tvCurrentSpendableBox.setText("Current spendable balance: " + userData.credits + " CLB");

        int solvedCount = userData.completedChallenges != null ? userData.completedChallenges.size() : 0;
        tvChallengesSolved.setText(solvedCount + (solvedCount == 1 ? " challenge solved" : " challenges solved"));

        tfvCurrentRank.setTierColors(badgesHelper.getTierColors(tierType));
        if (userData.photoURL != null && !userData.photoURL.isEmpty()) {
            // Can be extended to decode base64 profile image if needed
        }

        if (nextTier != null) {
            tvNextRank.setText(nextTier.name);
            long progress = totalClb - currentTier.requiredClb;
            long goal = nextTier.requiredClb - currentTier.requiredClb;

            pbRankProgress.setMax((int) goal);
            pbRankProgress.setProgress((int) progress);

            tvProgressValues.setText(progress + " / " + goal + " CLB");
            tvRemainingClb.setText((goal - progress) + " CLB to reach " + nextTier.name);
        } else {
            tvProgressLabel.setText("");
            tvNextRank.setText("Max Rank Reached");
            tvProgressValues.setText("");
            pbRankProgress.setMax(100);
            pbRankProgress.setProgress(100);
            tvRemainingClb.setText("");
        }

        rvSkillTiers.setLayoutManager(new LinearLayoutManager(this));
        rvSkillTiers.setAdapter(new TiersAdapter(tierList, totalClb));

        rvBadges.setLayoutManager(new GridLayoutManager(this, 3));
        List<Badge> allBadges = badgesHelper.getAllBadges();
        rvBadges.setAdapter(new BadgesGridAdapter(allBadges, userData, badgesHelper));
    }

    private String getTierType(int index) {
        switch (index) {
            case 0:
                return "common"; // Novice
            case 1:
                return "uncommon"; // Apprentice
            case 2:
                return "rare"; // Junior
            case 3:
                return "epic"; // Intermediate
            case 4:
                return "legendary";// Advanced
            case 5:
                return "legendary";// Expert
            default:
                return "common";
        }
    }
}
