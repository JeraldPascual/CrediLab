package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.credilabmobile.data.WeeklyTask;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class WeeklyTaskAdapter extends RecyclerView.Adapter<WeeklyTaskAdapter.ViewHolder> {

    private final List<WeeklyTask> tasks;
    private final Map<String, Boolean> completedStatus;
    private final OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(WeeklyTask task, boolean isCompleted);
    }

    public WeeklyTaskAdapter(List<WeeklyTask> tasks, Map<String, Boolean> completedStatus,
            OnItemClickListener listener) {
        this.tasks = tasks;
        this.completedStatus = completedStatus;
        this.listener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_weekly_task, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        WeeklyTask task = tasks.get(position);
        boolean isCompleted = completedStatus.containsKey(task.id) && completedStatus.get(task.id);

        holder.tvTaskTitle.setText(task.title);
        holder.tvTaskDesc.setText(task.description);
        holder.tvReward.setText("+" + task.rewardCLB + " CLB");

        // Set SDG icon
        String icon = getSdgIcon(task.sdgGoal);
        holder.tvTaskIcon.setText(icon);

        if (isCompleted) {
            holder.ivStatus.setVisibility(View.VISIBLE);
            holder.ivStatus.setImageResource(android.R.drawable.ic_input_add); // Using placeholder for checkmark
            holder.itemView.setAlpha(0.6f);
        } else {
            holder.ivStatus.setVisibility(View.GONE);
            holder.itemView.setAlpha(1.0f);
        }

        holder.itemView.setOnClickListener(v -> listener.onItemClick(task, isCompleted));
    }

    @Override
    public int getItemCount() {
        return tasks.size();
    }

    public void updateData(List<WeeklyTask> newTasks, Map<String, Boolean> newStatus) {
        this.tasks.clear();
        this.tasks.addAll(newTasks);
        this.completedStatus.clear();
        this.completedStatus.putAll(newStatus);
        notifyDataSetChanged();
    }

    private String getSdgIcon(int goal) {
        switch (goal) {
            case 6:
                return "💧";
            case 7:
                return "⚡";
            case 11:
                return "🏙️";
            case 12:
                return "♻️";
            case 13:
                return "🌍";
            case 14:
                return "🐟";
            case 15:
                return "🌳";
            default:
                return "🌱";
        }
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvTaskIcon, tvTaskTitle, tvTaskDesc, tvReward;
        ImageView ivStatus;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTaskIcon = itemView.findViewById(R.id.tvTaskIcon);
            tvTaskTitle = itemView.findViewById(R.id.tvTaskTitle);
            tvTaskDesc = itemView.findViewById(R.id.tvTaskDesc);
            tvReward = itemView.findViewById(R.id.tvReward);
            ivStatus = itemView.findViewById(R.id.ivStatus);
        }
    }
}
