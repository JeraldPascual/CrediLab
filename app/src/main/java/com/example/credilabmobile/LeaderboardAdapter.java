package com.example.credilabmobile;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.example.credilabmobile.data.AchievementData;

import java.util.ArrayList;
import java.util.List;

public class LeaderboardAdapter extends RecyclerView.Adapter<LeaderboardAdapter.ViewHolder> {

    private final List<FirestoreHelper.UserData> entries = new ArrayList<>();
    private String currentUserUid;

    public void setData(List<FirestoreHelper.UserData> data, String currentUid) {
        this.entries.clear();
        this.entries.addAll(data);
        this.currentUserUid = currentUid;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_leaderboard_row, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder h, int position) {
        FirestoreHelper.UserData entry = entries.get(position);
        int rank = position + 1;
        Context ctx = h.itemView.getContext();

        // Rank styling
        h.tvRank.setText(String.valueOf(rank));
        switch (rank) {
            case 1:
                h.tvRank.setTextColor(Color.parseColor("#FFD700")); // Gold
                h.tvRank.setText("🥇");
                break;
            case 2:
                h.tvRank.setTextColor(Color.parseColor("#C0C0C0")); // Silver
                h.tvRank.setText("🥈");
                break;
            case 3:
                h.tvRank.setTextColor(Color.parseColor("#CD7F32")); // Bronze
                h.tvRank.setText("🥉");
                break;
            default:
                h.tvRank.setTextColor(Color.parseColor("#888888"));
                break;
        }

        // Profile photo
        if (entry.photoURL != null && !entry.photoURL.isEmpty()) {
            Glide.with(ctx)
                    .load(entry.photoURL)
                    .transform(new CircleCrop())
                    .placeholder(R.drawable.ic_launcher_foreground)
                    .into(h.ivPhoto);
        } else {
            h.ivPhoto.setImageResource(R.drawable.ic_launcher_foreground);
        }

        // Name
        h.tvName.setText(entry.getBestName());

        // Tier
        AchievementData.SkillTier tier = AchievementData.getSkillTier(entry.totalCLBEarned);
        h.tvTierIcon.setText(tier.icon);
        h.tvTierName.setText(tier.shortTitle);

        // Challenges
        int challengeCount = entry.completedChallenges != null ? entry.completedChallenges.size() : 0;
        h.tvChallenges.setText(String.valueOf(challengeCount));

        // Credits
        h.tvCredits.setText(String.valueOf(entry.totalCLBEarned));

        // Highlight current user row
        if (entry.uid != null && entry.uid.equals(currentUserUid)) {
            h.itemView.setBackgroundColor(Color.parseColor("#1A4CAF50")); // Subtle green
        } else {
            h.itemView.setBackgroundColor(Color.TRANSPARENT);
        }
    }

    @Override
    public int getItemCount() {
        return entries.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvRank, tvName, tvTierIcon, tvTierName, tvChallenges, tvCredits;
        ImageView ivPhoto, ivFrame;

        ViewHolder(@NonNull View v) {
            super(v);
            tvRank = v.findViewById(R.id.tvRank);
            tvName = v.findViewById(R.id.tvName);
            tvTierIcon = v.findViewById(R.id.tvTierIcon);
            tvTierName = v.findViewById(R.id.tvTierName);
            tvChallenges = v.findViewById(R.id.tvChallenges);
            tvCredits = v.findViewById(R.id.tvCredits);
            ivPhoto = v.findViewById(R.id.ivPhoto);
            ivFrame = v.findViewById(R.id.ivFrame);
        }
    }
}
