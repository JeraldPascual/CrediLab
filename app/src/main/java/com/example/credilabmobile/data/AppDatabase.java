package com.example.credilabmobile.data;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = { ChatMessage.class, ChatSession.class, QuizProgress.class,
        QuizCompletion.class }, version = 3, exportSchema = false)
public abstract class AppDatabase extends RoomDatabase {
    public abstract ChatDao chatDao();

    public abstract QuizDao quizDao();
}
