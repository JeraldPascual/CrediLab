package com.example.credilabmobile.data;

import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.annotation.NonNull;

@Entity(tableName = "chat_sessions")
public class ChatSession {
    @PrimaryKey(autoGenerate = false)
    @NonNull
    public String id; // UUID

    public String title;
    public long lastActive;
    public String preview; // Last message snippet

    public ChatSession(String id, String title, long lastActive, String preview) {
        this.id = id;
        this.title = title;
        this.lastActive = lastActive;
        // Limit preview length
        if (preview != null && preview.length() > 50) {
            this.preview = preview.substring(0, 50) + "...";
        } else {
            this.preview = preview;
        }
    }
}
