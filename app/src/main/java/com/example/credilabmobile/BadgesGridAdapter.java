package com.example.credilabmobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import androidx.appcompat.app.AlertDialog;
import com.google.android.material.dialog.MaterialAlertDialogBuilder;

import java.util.List;

public class BadgesGridAdapter extends RecyclerView.Adapter<BadgesGridAdapter.BadgeViewHolder> {

    private final List<Badge> badges;
    private final FirestoreHelper.UserData userData;
    private final BadgesHelper badgesHelper;

    public BadgesGridAdapter(List<Badge> badges, FirestoreHelper.UserData userData, BadgesHelper badgesHelper) {
        this.badges = badges;
        this.userData = userData;
        this.badgesHelper = badgesHelper;
    }

    @NonNull
    @Override
    public BadgeViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_badge_achievement, parent, false);
        return new BadgeViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BadgeViewHolder holder, int position) {
        Badge badge = badges.get(position);
        holder.tvTitle.setText(badge.getName());
        holder.tvCriteria.setText(badge.getDescription());

        boolean isUnlocked = badgesHelper.isBadgeUnlocked(badge, userData);

        if (isUnlocked) {
            String hex = badgesHelper.getTierHexColor(badge.getRarity());
            badgesHelper.renderBadgeSvg(holder.ivIcon, badge.getSvg(), hex);
            holder.ivIcon.setAlpha(1.0f);
            holder.cardBadge.setStrokeColor(android.graphics.Color.parseColor("#00D68F"));
        } else {
            badgesHelper.renderBadgeSvg(holder.ivIcon, badge.getSvg(), "#808080");
            holder.ivIcon.setAlpha(0.3f);
            holder.cardBadge.setStrokeColor(android.graphics.Color.parseColor("#30363D"));
        }

        holder.itemView.setOnClickListener(v -> {
            String statusTex = isUnlocked ? "Unlocked" : "Locked";

            String criteriaStr = "Unknown Criteria";
            if (badge.getCondition() != null) {
                criteriaStr = "Type: " + badge.getCondition().getType();
                if (badge.getCondition().getReqs() != null) {
                    criteriaStr += "\nReqs: " + badge.getCondition().getReqs().toString();
                }
            }

            View dialogView = LayoutInflater.from(v.getContext()).inflate(R.layout.dialog_badge_details, null);
            TextView tvTitle = dialogView.findViewById(R.id.tvDialogBadgeTitle);
            TextView tvDesc = dialogView.findViewById(R.id.tvDialogBadgeDesc);
            TextView tvCriteria = dialogView.findViewById(R.id.tvDialogBadgeCriteria);
            View btnClose = dialogView.findViewById(R.id.btnDialogClose);

            tvTitle.setText(badge.getName());
            tvDesc.setText(badge.getDescription() + "\n\nStatus: " + statusTex);
            tvCriteria.setText("Criteria:\n" + criteriaStr);

            AlertDialog dialog = new MaterialAlertDialogBuilder(v.getContext())
                    .setView(dialogView)
                    .setBackground(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT))
                    .create();

            btnClose.setOnClickListener(btn -> dialog.dismiss());
            dialog.show();
        });
    }

    @Override
    public int getItemCount() {
        return badges != null ? badges.size() : 0;
    }

    static class BadgeViewHolder extends RecyclerView.ViewHolder {
        com.google.android.material.card.MaterialCardView cardBadge;
        ImageView ivIcon;
        TextView tvTitle, tvCriteria;

        public BadgeViewHolder(@NonNull View itemView) {
            super(itemView);
            cardBadge = itemView.findViewById(R.id.cardBadge);
            ivIcon = itemView.findViewById(R.id.ivBadgeIcon);
            tvTitle = itemView.findViewById(R.id.tvBadgeTitle);
            tvCriteria = itemView.findViewById(R.id.tvBadgeCriteria);
        }
    }
}
