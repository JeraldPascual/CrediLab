package com.example.credilabmobile;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.example.credilabmobile.bob.ChatRepository;
import com.example.credilabmobile.data.AppDatabase;
import com.example.credilabmobile.data.QuizCompletion;
import com.example.credilabmobile.data.QuizProgress;
import com.example.credilabmobile.data.QuizQuestion;
import com.example.credilabmobile.data.QuizQuestionBank;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;

public class QuizActivity extends AppCompatActivity {

    private String language, languageName, currentDifficulty;
    private List<QuizQuestion> questions;
    private int currentIndex = 0;
    private int lives = 3;
    private int correctCount = 0;
    private boolean answered = false;
    private int shuffledCorrectIndex = 0; // where correct ended up after shuffle

    // Views
    private TextView tvTitle, tvLives, tvQuestionCount, tvQuestion, tvFeedback, tvCodeBlock;
    private MaterialCardView[] optionCards;
    private MaterialCardView cardCodeBlock;
    private TextView[] optionTexts;
    private ProgressBar progressBar;
    private MaterialButton btnNext;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quiz);

        language = getIntent().getStringExtra("language");
        languageName = getIntent().getStringExtra("languageName");
        currentDifficulty = getIntent().getStringExtra("difficulty");
        if (language == null)
            language = "java";
        if (languageName == null)
            languageName = "Java";
        if (currentDifficulty == null)
            currentDifficulty = "easy";

        initViews();
        loadQuestions();
    }

    private void initViews() {
        ImageView btnClose = findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> finish());

        tvTitle = findViewById(R.id.tvTitle);
        tvLives = findViewById(R.id.tvLives);
        tvQuestionCount = findViewById(R.id.tvQuestionCount);
        tvQuestion = findViewById(R.id.tvQuestion);
        tvFeedback = findViewById(R.id.tvFeedback);
        progressBar = findViewById(R.id.progressBar);
        btnNext = findViewById(R.id.btnNext);
        tvCodeBlock = findViewById(R.id.tvCodeBlock);
        cardCodeBlock = findViewById(R.id.cardCodeBlock);

        MaterialCardView c0 = findViewById(R.id.cardOption0);
        MaterialCardView c1 = findViewById(R.id.cardOption1);
        MaterialCardView c2 = findViewById(R.id.cardOption2);
        MaterialCardView c3 = findViewById(R.id.cardOption3);
        optionCards = new MaterialCardView[] { c0, c1, c2, c3 };

        TextView t0 = findViewById(R.id.tvOption0);
        TextView t1 = findViewById(R.id.tvOption1);
        TextView t2 = findViewById(R.id.tvOption2);
        TextView t3 = findViewById(R.id.tvOption3);
        optionTexts = new TextView[] { t0, t1, t2, t3 };

        for (int i = 0; i < 4; i++) {
            final int idx = i;
            optionCards[i].setOnClickListener(v -> onOptionSelected(idx));
        }

        btnNext.setOnClickListener(v -> onNextClicked());
    }

    private void loadQuestions() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                QuizProgress prog = db.quizDao().getProgress(language, currentDifficulty);
                int alreadyAnswered = (prog != null) ? prog.answeredCorrectly : 0;

                if (alreadyAnswered >= 50) {
                    runOnUiThread(this::showComplete);
                    return;
                }

                questions = QuizQuestionBank.getQuestions(language, currentDifficulty);
                Collections.shuffle(questions);

                // Trim to remaining
                if (alreadyAnswered > 0 && alreadyAnswered < questions.size()) {
                    questions = new ArrayList<>(questions.subList(alreadyAnswered, questions.size()));
                }
                correctCount = alreadyAnswered;
                currentIndex = 0;
                lives = 3;

                runOnUiThread(this::displayQuestion);
            } catch (Exception e) {
                e.printStackTrace();
                // Fallback
                runOnUiThread(() -> {
                    questions = QuizQuestionBank.getQuestions(language, currentDifficulty);
                    Collections.shuffle(questions);
                    currentIndex = 0;
                    lives = 3;
                    correctCount = 0;
                    displayQuestion();
                });
            }
        });
    }

    private void displayQuestion() {
        if (questions == null || currentIndex >= questions.size())
            return;

        String diffLabel = currentDifficulty.substring(0, 1).toUpperCase() + currentDifficulty.substring(1);
        tvTitle.setText(languageName + " · " + diffLabel);
        tvLives.setText(String.valueOf(lives));

        QuizQuestion q = questions.get(currentIndex);
        int displayNum = correctCount + currentIndex + 1;
        tvQuestionCount.setText("Question " + displayNum + " / 50");

        // Detect code questions: if the question contains newlines, split into text +
        // code
        String fullQuestion = q.question;
        if (fullQuestion.contains("\n")) {
            int splitIdx = fullQuestion.indexOf("\n");
            String textPart = fullQuestion.substring(0, splitIdx).trim();
            String codePart = fullQuestion.substring(splitIdx + 1).trim();
            tvQuestion.setText(textPart);
            tvCodeBlock.setText(codePart);
            cardCodeBlock.setVisibility(View.VISIBLE);
        } else {
            tvQuestion.setText(fullQuestion);
            cardCodeBlock.setVisibility(View.GONE);
        }

        int progress = (int) (((float) (correctCount + currentIndex)) / 50f * 100);
        progressBar.setProgress(progress);

        // ---- SHUFFLE OPTIONS so correct answer isn't always at index 0 ----
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < 4; i++)
            indices.add(i);
        Collections.shuffle(indices);

        shuffledCorrectIndex = -1;
        for (int displayPos = 0; displayPos < 4; displayPos++) {
            int originalIdx = indices.get(displayPos);
            optionTexts[displayPos].setText(q.options[originalIdx]);
            if (originalIdx == q.correctIndex) {
                shuffledCorrectIndex = displayPos;
            }
            resetOptionStyle(displayPos);
            optionCards[displayPos].setClickable(true);
        }

        tvFeedback.setVisibility(View.GONE);
        btnNext.setVisibility(View.GONE);
        answered = false;
    }

    private void onOptionSelected(int idx) {
        if (answered)
            return;
        answered = true;

        boolean isCorrect = (idx == shuffledCorrectIndex);

        // Highlight correct answer
        highlightOption(shuffledCorrectIndex, true);

        if (isCorrect) {
            tvFeedback.setText("✅ Correct!");
            tvFeedback.setTextColor(ContextCompat.getColor(this, R.color.success));
        } else {
            highlightOption(idx, false);
            lives--;
            tvLives.setText(String.valueOf(lives));
            tvFeedback.setText("❌ Wrong! The answer is: " + optionTexts[shuffledCorrectIndex].getText());
            tvFeedback.setTextColor(ContextCompat.getColor(this, R.color.error));
        }

        tvFeedback.setVisibility(View.VISIBLE);

        for (MaterialCardView card : optionCards) {
            card.setClickable(false);
        }

        if (lives <= 0) {
            btnNext.setText("Try Again");
            btnNext.setVisibility(View.VISIBLE);
            btnNext.setOnClickListener(v -> {
                lives = 3;
                currentIndex = 0;
                Collections.shuffle(questions);
                btnNext.setOnClickListener(v2 -> onNextClicked());
                displayQuestion();
            });
        } else {
            btnNext.setText("Next");
            btnNext.setVisibility(View.VISIBLE);
        }
    }

    private void onNextClicked() {
        if (!answered)
            return;

        boolean wasCorrect = tvFeedback.getText().toString().startsWith("✅");

        if (wasCorrect) {
            saveProgress();
        }

        currentIndex++;
        if (currentIndex >= questions.size()) {
            showComplete();
        } else {
            displayQuestion();
        }
    }

    private void saveProgress() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                QuizProgress prog = db.quizDao().getProgress(language, currentDifficulty);
                if (prog == null) {
                    prog = new QuizProgress(language, currentDifficulty, 0, 50);
                }
                prog.answeredCorrectly++;
                db.quizDao().upsertProgress(prog);

                // Record completion when reaching 50
                if (prog.answeredCorrectly >= 50) {
                    QuizCompletion existing = db.quizDao().getCompletion(language, currentDifficulty);
                    if (existing == null) {
                        db.quizDao().insertCompletion(
                                new QuizCompletion(language, currentDifficulty, System.currentTimeMillis()));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    private void showComplete() {
        String diffLabel = currentDifficulty.substring(0, 1).toUpperCase() + currentDifficulty.substring(1);

        // Save completion record
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                QuizCompletion existing = db.quizDao().getCompletion(language, currentDifficulty);
                if (existing == null) {
                    db.quizDao().insertCompletion(
                            new QuizCompletion(language, currentDifficulty, System.currentTimeMillis()));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });

        new AlertDialog.Builder(this)
                .setTitle("🎉 " + diffLabel + " Complete!")
                .setMessage("Great job! You've completed " + languageName + " \u2014 " + diffLabel
                        + "!\n\n\ud83c\udfc6 This achievement has been recorded!\nYou can earn titles, badges, and certificates by completing more quizzes.")
                .setCancelable(false)
                .setPositiveButton("Done", (d, w) -> finish())
                .show();
    }

    private void highlightOption(int idx, boolean correct) {
        int color = correct
                ? ContextCompat.getColor(this, R.color.success)
                : ContextCompat.getColor(this, R.color.error);
        optionCards[idx].setStrokeColor(color);
        optionCards[idx].setStrokeWidth(3);
    }

    private void resetOptionStyle(int idx) {
        optionCards[idx].setStrokeColor(ContextCompat.getColor(this, R.color.divider));
        optionCards[idx].setStrokeWidth((int) (getResources().getDisplayMetrics().density));
        optionCards[idx].setCardBackgroundColor(ContextCompat.getColor(this, R.color.surface_dark));
    }
}
