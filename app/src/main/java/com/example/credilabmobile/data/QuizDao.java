package com.example.credilabmobile.data;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import java.util.List;

@Dao
public interface QuizDao {

    @Query("SELECT * FROM quiz_progress WHERE language = :language")
    List<QuizProgress> getProgressByLanguage(String language);

    @Query("SELECT * FROM quiz_progress WHERE language = :language AND difficulty = :difficulty")
    QuizProgress getProgress(String language, String difficulty);

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void upsertProgress(QuizProgress progress);

    @Query("SELECT * FROM quiz_progress")
    List<QuizProgress> getAllProgress();

    @Query("DELETE FROM quiz_progress WHERE language = :language AND difficulty = :difficulty")
    void deleteProgress(String language, String difficulty);

    // Completion tracking for badges/titles/certificates
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    void insertCompletion(QuizCompletion completion);

    @Query("SELECT * FROM quiz_completion")
    List<QuizCompletion> getAllCompletions();

    @Query("SELECT * FROM quiz_completion WHERE language = :language AND difficulty = :difficulty")
    QuizCompletion getCompletion(String language, String difficulty);

    @Query("SELECT COUNT(*) FROM quiz_completion")
    int getCompletionCount();
}
