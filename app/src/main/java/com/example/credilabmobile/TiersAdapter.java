package com.example.credilabmobile;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;

import java.util.List;

public class TiersAdapter extends RecyclerView.Adapter<TiersAdapter.TierViewHolder> {

    public static class Tier {
        public String name;
        public long requiredClb;
        public String description;

        public Tier(String name, long requiredClb, String description) {
            this.name = name;
            this.requiredClb = requiredClb;
            this.description = description;
        }
    }

    private final List<Tier> tiers;
    private final long userClb;

    public TiersAdapter(List<Tier> tiers, long userClb) {
        this.tiers = tiers;
        this.userClb = userClb;
    }

    @NonNull
    @Override
    public TierViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_tier_rank, parent, false);
        return new TierViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TierViewHolder holder, int position) {
        Tier tier = tiers.get(position);
        holder.tvTierName.setText(tier.name);
        holder.tvTierRequirement
                .setText(tier.requiredClb == 0 ? "Default Rank" : "Requires: " + tier.requiredClb + " CLB");
        holder.tvTierDesc.setText(tier.description);

        boolean isUnlocked = userClb >= tier.requiredClb;
        boolean isCurrent = false;

        if (isUnlocked) {
            if (position == tiers.size() - 1 || userClb < tiers.get(position + 1).requiredClb) {
                isCurrent = true;
            }
        }

        if (isCurrent) {
            holder.cardTier.setStrokeColor(Color.parseColor("#00D68F")); // primary
            holder.cardTier.setStrokeWidth(4);
            holder.flTierPreview.setVisibility(View.VISIBLE);
            holder.flTierPreview.setAlpha(1.0f);
        } else if (isUnlocked) {
            holder.cardTier.setStrokeColor(Color.parseColor("#30363D")); // divider
            holder.cardTier.setStrokeWidth(2);
            holder.flTierPreview.setVisibility(View.VISIBLE);
            holder.flTierPreview.setAlpha(1.0f);
        } else {
            holder.cardTier.setStrokeColor(Color.parseColor("#30363D"));
            holder.cardTier.setStrokeWidth(0);
            holder.flTierPreview.setVisibility(View.VISIBLE);
            holder.flTierPreview.setAlpha(0.3f);
            holder.tvTierName.setTextColor(Color.parseColor("#6E7681")); // text tertiary
        }

        // Set the frame colors
        BadgesHelper badgesHelper = new BadgesHelper(holder.itemView.getContext());
        String tierType = getTierType(position);
        holder.tfvTierPreview.setTierColors(badgesHelper.getTierColors(tierType));
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
                return "legendary"; // Advanced
            case 5:
                return "legendary"; // Expert
            default:
                return "common";
        }
    }

    @Override
    public int getItemCount() {
        return tiers != null ? tiers.size() : 0;
    }

    static class TierViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardTier;
        TextView tvTierName, tvTierRequirement, tvTierDesc;
        View flTierPreview;
        TierFrameView tfvTierPreview;

        public TierViewHolder(@NonNull View itemView) {
            super(itemView);
            cardTier = itemView.findViewById(R.id.cardTier);
            tvTierName = itemView.findViewById(R.id.tvTierName);
            tvTierRequirement = itemView.findViewById(R.id.tvTierRequirement);
            tvTierDesc = itemView.findViewById(R.id.tvTierDesc);
            flTierPreview = itemView.findViewById(R.id.flTierPreview);
            tfvTierPreview = itemView.findViewById(R.id.tfvTierPreview);
        }
    }
}
