package com.example.credilabmobile;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.card.MaterialCardView;

import java.util.List;

public class LanguageAdapter extends RecyclerView.Adapter<LanguageAdapter.ViewHolder> {

    public static class LanguageItem {
        public final String key;
        public final String name;
        public final String description;
        public final String icon;
        public int easyDone, mediumDone, hardDone; // out of 50

        public LanguageItem(String key, String name, String description, String icon) {
            this.key = key;
            this.name = name;
            this.description = description;
            this.icon = icon;
        }
    }

    public interface OnLanguageClickListener {
        void onLanguageClick(LanguageItem item);
    }

    private final List<LanguageItem> items;
    private final OnLanguageClickListener listener;

    public LanguageAdapter(List<LanguageItem> items, OnLanguageClickListener listener) {
        this.items = items;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_language_card, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        LanguageItem item = items.get(position);
        holder.tvIcon.setText(item.icon);
        holder.tvName.setText(item.name);
        holder.tvDesc.setText(item.description);

        // Easy progress
        holder.progressEasy.setProgress(item.easyDone);
        holder.tvEasyProgress.setText(item.easyDone + "/50");

        // Medium progress
        boolean mediumUnlocked = item.easyDone >= 50;
        holder.progressMedium.setProgress(item.mediumDone);
        holder.tvMediumProgress.setText(mediumUnlocked ? item.mediumDone + "/50" : "🔒");

        // Hard progress
        boolean hardUnlocked = item.mediumDone >= 50;
        holder.progressHard.setProgress(item.hardDone);
        holder.tvHardProgress.setText(hardUnlocked ? item.hardDone + "/50" : "🔒");

        holder.card.setOnClickListener(v -> {
            if (listener != null)
                listener.onLanguageClick(item);
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView card;
        TextView tvIcon, tvName, tvDesc;
        TextView tvEasyProgress, tvMediumProgress, tvHardProgress;
        ProgressBar progressEasy, progressMedium, progressHard;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            card = itemView.findViewById(R.id.cardLanguage);
            tvIcon = itemView.findViewById(R.id.tvLanguageIcon);
            tvName = itemView.findViewById(R.id.tvLanguageName);
            tvDesc = itemView.findViewById(R.id.tvLanguageDesc);
            tvEasyProgress = itemView.findViewById(R.id.tvEasyProgress);
            tvMediumProgress = itemView.findViewById(R.id.tvMediumProgress);
            tvHardProgress = itemView.findViewById(R.id.tvHardProgress);
            progressEasy = itemView.findViewById(R.id.progressEasy);
            progressMedium = itemView.findViewById(R.id.progressMedium);
            progressHard = itemView.findViewById(R.id.progressHard);
        }
    }
}
