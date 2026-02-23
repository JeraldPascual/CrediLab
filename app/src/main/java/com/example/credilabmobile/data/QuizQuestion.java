package com.example.credilabmobile.data;

public class QuizQuestion {
    public int id;
    public String question;
    public String[] options;
    public int correctIndex;

    public QuizQuestion(int id, String question, String[] options, int correctIndex) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.correctIndex = correctIndex;
    }
}
