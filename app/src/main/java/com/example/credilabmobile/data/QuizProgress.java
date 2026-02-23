package com.example.credilabmobile.data;

import androidx.annotation.NonNull;
import androidx.room.Entity;

@Entity(tableName = "quiz_progress", primaryKeys = { "language", "difficulty" })
public class QuizProgress {

    @NonNull
    public String language;

    @NonNull
    public String difficulty;

    public int answeredCorrectly;

    public int totalQuestions;

    public QuizProgress(@NonNull String language, @NonNull String difficulty, int answeredCorrectly,
            int totalQuestions) {
        this.language = language;
        this.difficulty = difficulty;
        this.answeredCorrectly = answeredCorrectly;
        this.totalQuestions = totalQuestions;
    }
}
