package com.example.credilabmobile.data;

import androidx.annotation.NonNull;
import androidx.room.Entity;

@Entity(tableName = "quiz_completion", primaryKeys = { "language", "difficulty" })
public class QuizCompletion {

    @NonNull
    public String language;

    @NonNull
    public String difficulty;

    public long completedAt; // System.currentTimeMillis()

    public QuizCompletion(@NonNull String language, @NonNull String difficulty, long completedAt) {
        this.language = language;
        this.difficulty = difficulty;
        this.completedAt = completedAt;
    }
}
