package com.example.credilabmobile.data;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "chat_messages")
public class ChatMessage {
    @PrimaryKey(autoGenerate = true)
    public int id;

    public String sessionId;
    public String text;
    public boolean isUser; // true = User, false = Bot
    public String imagePath; // Local path to attached image (optional)
    public long timestamp;

    public ChatMessage(String sessionId, String text, boolean isUser, String imagePath, long timestamp) {
        this.sessionId = sessionId;
        this.text = text;
        this.isUser = isUser;
        this.imagePath = imagePath;
        this.timestamp = timestamp;
    }
}
