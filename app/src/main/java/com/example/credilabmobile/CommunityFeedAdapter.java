package com.example.credilabmobile;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.example.credilabmobile.data.TaskSubmission;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

public class CommunityFeedAdapter extends RecyclerView.Adapter<CommunityFeedAdapter.ViewHolder> {

    private final List<TaskSubmission> submissions;
    private final String currentUserId;
    private final OnVoteClickListener voteListener;
    private Context context;

    public interface OnVoteClickListener {
        void onVote(TaskSubmission submission, boolean isUpvote, boolean isAdding);
    }

    public CommunityFeedAdapter(List<TaskSubmission> submissions, String currentUserId,
            OnVoteClickListener voteListener) {
        this.submissions = submissions;
        this.currentUserId = currentUserId;
        this.voteListener = voteListener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context)
                .inflate(R.layout.item_community_feed, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        TaskSubmission sub = submissions.get(position);

        holder.tvUserName
                .setText(sub.displayName != null && !sub.displayName.isEmpty() ? sub.displayName : "Anonymous");

        if (sub.completedAt != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("MMM d, yyyy h:mm a", Locale.getDefault());
            holder.tvTime.setText(sdf.format(sub.completedAt.toDate()));
        } else {
            holder.tvTime.setText("Just now");
        }

        if (sub.photoURL != null && !sub.photoURL.isEmpty()) {
            Glide.with(context)
                    .load(sub.photoURL)
                    .placeholder(R.drawable.ic_credilab_logo)
                    .error(R.drawable.ic_credilab_logo)
                    .transform(new CircleCrop())
                    .into(holder.ivProfile);
        } else {
            Glide.with(context)
                    .load(R.drawable.ic_credilab_logo)
                    .transform(new CircleCrop())
                    .into(holder.ivProfile);
        }

        if (sub.response != null && !sub.response.isEmpty()) {
            holder.tvResponse.setVisibility(View.VISIBLE);
            holder.tvResponse.setText(sub.response);
        } else {
            holder.tvResponse.setVisibility(View.GONE);
        }

        if (sub.photoBase64 != null && !sub.photoBase64.isEmpty()) {
            holder.cardSubmissionPhoto.setVisibility(View.VISIBLE);
            try {
                String base64String = sub.photoBase64;
                if (base64String.contains(",")) {
                    base64String = base64String.split(",")[1];
                }
                byte[] decodedBytes = Base64.decode(base64String, Base64.DEFAULT);
                Bitmap decodedBitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);
                Glide.with(context).load(decodedBitmap).into(holder.ivSubmissionPhoto);

                // Add click listener for full-screen view
                holder.ivSubmissionPhoto.setOnClickListener(v -> {
                    android.app.Dialog dialog = new android.app.Dialog(context,
                            android.R.style.Theme_Black_NoTitleBar_Fullscreen);
                    android.widget.ImageView fullImageView = new android.widget.ImageView(context);
                    fullImageView.setLayoutParams(new android.view.ViewGroup.LayoutParams(
                            android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                            android.view.ViewGroup.LayoutParams.MATCH_PARENT));
                    fullImageView.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                    fullImageView.setImageBitmap(decodedBitmap);
                    fullImageView.setOnClickListener(v1 -> dialog.dismiss());
                    dialog.setContentView(fullImageView);
                    dialog.show();
                });
            } catch (Exception e) {
                holder.cardSubmissionPhoto.setVisibility(View.GONE);
                holder.ivSubmissionPhoto.setOnClickListener(null);
            }
        } else {
            holder.cardSubmissionPhoto.setVisibility(View.GONE);
            holder.ivSubmissionPhoto.setOnClickListener(null);
        }

        holder.tvNetScore.setText(String.valueOf(sub.netScore));

        holder.tvSubmissionStatus.setText(sub.status.replace("_", " "));

        boolean hasUpvoted = sub.upvoters.contains(currentUserId);
        boolean hasDownvoted = sub.downvoters.contains(currentUserId);

        holder.btnUpvote.setColorFilter(hasUpvoted ? context.getResources().getColor(R.color.primary)
                : context.getResources().getColor(R.color.text_secondary));
        holder.btnDownvote.setColorFilter(hasDownvoted ? context.getResources().getColor(R.color.error)
                : context.getResources().getColor(R.color.text_secondary));

        holder.btnUpvote.setOnClickListener(v -> voteListener.onVote(sub, true, !hasUpvoted));
        holder.btnDownvote.setOnClickListener(v -> voteListener.onVote(sub, false, !hasDownvoted));
    }

    @Override
    public int getItemCount() {
        return submissions.size();
    }

    public void updateData(List<TaskSubmission> newSubmissions) {
        this.submissions.clear();
        this.submissions.addAll(newSubmissions);
        notifyDataSetChanged();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView ivProfile, ivSubmissionPhoto, btnUpvote, btnDownvote;
        TextView tvUserName, tvTime, tvResponse, tvNetScore, tvSubmissionStatus;
        View cardSubmissionPhoto;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            ivProfile = itemView.findViewById(R.id.ivProfile);
            tvUserName = itemView.findViewById(R.id.tvUserName);
            tvTime = itemView.findViewById(R.id.tvTime);
            tvResponse = itemView.findViewById(R.id.tvResponse);
            ivSubmissionPhoto = itemView.findViewById(R.id.ivSubmissionPhoto);
            cardSubmissionPhoto = itemView.findViewById(R.id.cardSubmissionPhoto);
            btnUpvote = itemView.findViewById(R.id.btnUpvote);
            btnDownvote = itemView.findViewById(R.id.btnDownvote);
            tvNetScore = itemView.findViewById(R.id.tvNetScore);
            tvSubmissionStatus = itemView.findViewById(R.id.tvSubmissionStatus);
        }
    }
}
