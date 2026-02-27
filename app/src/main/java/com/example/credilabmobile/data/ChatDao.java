package com.example.credilabmobile.data;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Delete;
import java.util.List;

@Dao
public interface ChatDao {

    // --- Sessions ---
    @Query("SELECT * FROM chat_sessions ORDER BY lastActive DESC")
    List<ChatSession> getAllSessions();

    @Query("SELECT * FROM chat_sessions WHERE id = :id")
    ChatSession getSessionById(String id);

    @Insert
    void insertSession(ChatSession session);

    @Query("UPDATE chat_sessions SET lastActive = :timestamp, preview = :preview WHERE id = :sessionId")
    void updateSessionPreview(String sessionId, String preview, long timestamp);

    @Query("UPDATE chat_sessions SET title = :title WHERE id = :sessionId")
    void updateSessionTitle(String sessionId, String title);

    @Query("DELETE FROM chat_sessions WHERE id = :sessionId")
    void deleteSession(String sessionId);

    // --- Messages ---
    @Query("SELECT * FROM chat_messages WHERE sessionId = :sessionId ORDER BY timestamp ASC")
    List<ChatMessage> getMessagesBySession(String sessionId);

    @Insert
    void insertMessage(ChatMessage message);

    @Query("DELETE FROM chat_messages WHERE sessionId = :sessionId")
    void clearMessages(String sessionId);

    @Query("DELETE FROM chat_messages WHERE id = (SELECT id FROM chat_messages WHERE sessionId = :sessionId ORDER BY timestamp DESC LIMIT 1) AND isUser = 1")
    void deleteLastMessageIfUser(String sessionId);

    // Get all images in a session (for context injection)
    @Query("SELECT imagePath FROM chat_messages WHERE sessionId = :sessionId AND imagePath IS NOT NULL")
    List<String> getImagesBySession(String sessionId);
}
