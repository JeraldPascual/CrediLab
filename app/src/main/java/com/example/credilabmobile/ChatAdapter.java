package com.example.credilabmobile;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import io.noties.markwon.Markwon;

import java.util.ArrayList;
import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

    private static final int TYPE_USER = 1;
    private static final int TYPE_BOT = 2;

    private final List<Message> messages = new ArrayList<>();
    private String currentRumbleString = "";
    private final Markwon markwon;
    private final TTSListener ttsListener;

    public interface TTSListener {
        void onSpeak(String text);
    }

    public ChatAdapter(Context context, TTSListener ttsListener) {
        this.markwon = Markwon.create(context);
        this.ttsListener = ttsListener;
    }

    @Override
    public int getItemViewType(int position) {
        return messages.get(position).isUser ? TYPE_USER : TYPE_BOT;
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    public void setRumbleContent(String rumble) {
        this.currentRumbleString = rumble;
        if (!messages.isEmpty()) {
            notifyItemChanged(messages.size() - 1);
        }
    }

    public void clear() {
        int size = messages.size();
        messages.clear();
        notifyItemRangeRemoved(0, size);
    }

    public void addMessage(Message message) {
        messages.add(message);
        notifyItemInserted(messages.size() - 1);
    }

    public void appendToken(String token) {
        if (messages.isEmpty())
            return;

        Message lastMsg = messages.get(messages.size() - 1);
        if (!lastMsg.isUser) {
            lastMsg.text += token;
            notifyItemChanged(messages.size() - 1);
        } else {
            addMessage(new Message(token, false));
        }
    }

    public void setLastMessageText(String text) {
        if (messages.isEmpty())
            return;
        Message lastMsg = messages.get(messages.size() - 1);
        if (!lastMsg.isUser) {
            lastMsg.text = text;
            notifyItemChanged(messages.size() - 1);
        }
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (viewType == TYPE_USER) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message_user, parent, false);
            return new UserViewHolder(v);
        } else {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_message_bot, parent, false);
            return new BotViewHolder(v, markwon, ttsListener);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        Message m = messages.get(position);
        if (holder instanceof UserViewHolder) {
            ((UserViewHolder) holder).bind(m);
        } else {
            String rumble = (position == messages.size() - 1) ? currentRumbleString : "";
            // If it's the very last message and bot is typing, we might append rumble
            // logic normally handled by m.text update but let's keep it safe.
            ((BotViewHolder) holder).bind(m, rumble);
        }
    }

    // --- ViewHolders ---

    static class UserViewHolder extends RecyclerView.ViewHolder {
        TextView textView;
        android.widget.ImageView imageView;
        android.widget.ProgressBar progressBar;
        View imgContainer;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            textView = itemView.findViewById(R.id.textUser);
            imageView = itemView.findViewById(R.id.imgAttachmentUser);
            progressBar = itemView.findViewById(R.id.progressImage);
            imgContainer = itemView.findViewById(R.id.imgContainer);
        }

        public void bind(Message message) {
            textView.setText(message.text);
            if (message.image != null) {
                imgContainer.setVisibility(View.VISIBLE);
                if (message.isLoading) {
                    imageView.setImageBitmap(message.image);
                    imageView.setAlpha(0.5f); // Fade out during load
                    progressBar.setVisibility(View.VISIBLE);
                    imageView.setOnClickListener(null);
                } else {
                    imageView.setImageBitmap(message.image);
                    imageView.setAlpha(1.0f); // Clear when done
                    progressBar.setVisibility(View.GONE);

                    // Add click listener for full-screen view
                    imageView.setOnClickListener(v -> {
                        Context context = imageView.getContext();
                        android.app.Dialog dialog = new android.app.Dialog(context,
                                android.R.style.Theme_Black_NoTitleBar_Fullscreen);
                        android.widget.ImageView fullImageView = new android.widget.ImageView(context);
                        fullImageView.setLayoutParams(new android.view.ViewGroup.LayoutParams(
                                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                                android.view.ViewGroup.LayoutParams.MATCH_PARENT));
                        fullImageView.setScaleType(android.widget.ImageView.ScaleType.FIT_CENTER);
                        fullImageView.setImageBitmap(message.image);
                        fullImageView.setOnClickListener(v1 -> dialog.dismiss());
                        dialog.setContentView(fullImageView);
                        dialog.show();
                    });
                }
            } else {
                imgContainer.setVisibility(View.GONE);
                imageView.setOnClickListener(null);
            }
        }
    }

    static class BotViewHolder extends RecyclerView.ViewHolder {
        TextView textView;
        ImageButton btnSpeaker;
        Markwon markwon;
        TTSListener ttsListener;

        public BotViewHolder(@NonNull View itemView, Markwon markwon, TTSListener listener) {
            super(itemView);
            textView = itemView.findViewById(R.id.textBot);
            btnSpeaker = itemView.findViewById(R.id.btnSpeaker);
            this.markwon = markwon;
            this.ttsListener = listener;
        }

        public void bind(Message message, String rumble) {
            // Apply rumble if needed
            String content = message.text + rumble;

            // Render Markdown
            markwon.setMarkdown(textView, content);

            // Handle TTS
            btnSpeaker.setOnClickListener(v -> {
                if (ttsListener != null) {
                    ttsListener.onSpeak(content); // Speak the full content
                }
            });
        }
    }

    public static class Message {
        public String text;
        public boolean isUser;
        public Bitmap image;
        public boolean isLoading = false; // New field

        public Message(String text, boolean isUser) {
            this.text = text;
            this.isUser = isUser;
            this.image = null;
        }

        public Message(String text, boolean isUser, Bitmap image) {
            this.text = text;
            this.isUser = isUser;
            this.image = image;
        }

        public Message(String text, boolean isUser, Bitmap image, boolean isLoading) {
            this.text = text;
            this.isUser = isUser;
            this.image = image;
            this.isLoading = isLoading;
        }
    }
}
