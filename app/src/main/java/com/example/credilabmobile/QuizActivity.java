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
            btnNext.setVisibility(View.GONE);
            for (MaterialCardView card : optionCards) {
                card.setClickable(false);
            }
            decrementProgressAndShowDialog();
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

    private void decrementProgressAndShowDialog() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                QuizProgress prog = db.quizDao().getProgress(language, currentDifficulty);
                int previousScore = 0;
                if (prog != null) {
                    previousScore = prog.answeredCorrectly;
                    prog.answeredCorrectly = Math.max(0, prog.answeredCorrectly - 20);
                    db.quizDao().upsertProgress(prog);
                }
                final int lostAmount = prog != null ? (previousScore - prog.answeredCorrectly) : 0;

                runOnUiThread(() -> {
                    android.view.View dialogView = getLayoutInflater().inflate(R.layout.dialog_out_of_lives, null);
                    TextView tvMessage = dialogView.findViewById(R.id.tvLockedMessage);
                    MaterialButton btnOutOk = dialogView.findViewById(R.id.btnOutOk);

                    if (lostAmount > 0) {
                        tvMessage.setText("You lost all your lives. You've been pushed back " + lostAmount
                                + " questions on your progress!");
                    } else {
                        tvMessage.setText(
                                "You lost all your lives, but luckily you didn't have any progress to lose yet!");
                    }

                    AlertDialog dialog = new AlertDialog.Builder(QuizActivity.this)
                            .setView(dialogView)
                            .setCancelable(false)
                            .create();

                    if (dialog.getWindow() != null) {
                        dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
                    }

                    btnOutOk.setOnClickListener(v -> {
                        dialog.dismiss();
                        finish();
                    });

                    dialog.show();
                });
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
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

        com.google.firebase.auth.FirebaseUser user = com.google.firebase.auth.FirebaseAuth.getInstance()
                .getCurrentUser();
        if (user == null) {
            android.view.View dialogView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
            TextView tvTitle = dialogView.findViewById(R.id.tvDialogTitle);
            TextView tvMessage = dialogView.findViewById(R.id.tvDialogMessage);
            MaterialButton btnConfirm = dialogView.findViewById(R.id.btnConfirm);

            tvTitle.setText("🎉 " + diffLabel + " Complete!");
            tvMessage.setText("Great job! Please sign in to earn rewards.");
            btnConfirm.setText("Done");

            AlertDialog dialog = new AlertDialog.Builder(this)
                    .setView(dialogView)
                    .setCancelable(false)
                    .create();

            if (dialog.getWindow() != null) {
                dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
            }

            btnConfirm.setOnClickListener(v -> {
                dialog.dismiss();
                finish();
            });
            dialog.show();
            return;
        }

        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                QuizCompletion existing = db.quizDao().getCompletion(language, currentDifficulty);

                if (existing == null) {
                    // First time completion! Award CLB.
                    db.quizDao().insertCompletion(
                            new QuizCompletion(language, currentDifficulty, System.currentTimeMillis()));

                    long rewardAmount = 10;
                    if (currentDifficulty.equals("medium"))
                        rewardAmount = 25;
                    else if (currentDifficulty.equals("hard"))
                        rewardAmount = 50;

                    final long finalReward = rewardAmount;

                    runOnUiThread(() -> {
                        android.view.View dialogView = getLayoutInflater().inflate(R.layout.dialog_claim_reward, null);
                        TextView tvTitle = dialogView.findViewById(R.id.tvDialogTitle);
                        TextView tvMessage = dialogView.findViewById(R.id.tvDialogMessage);
                        ProgressBar pb = dialogView.findViewById(R.id.progressBarClaim);
                        MaterialButton btnClaim = dialogView.findViewById(R.id.btnClaim);

                        tvTitle.setText("🎉 " + diffLabel + " Complete!");
                        tvMessage.setText("Great job! You've conquered " + languageName + " — " + diffLabel
                                + "!\n\nClaim your " + finalReward + " CLB reward below.");

                        AlertDialog dialog = new AlertDialog.Builder(this)
                                .setView(dialogView)
                                .setCancelable(false)
                                .create();

                        // Make dialog background transparent since the layout has its own background
                        if (dialog.getWindow() != null) {
                            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
                        }

                        btnClaim.setOnClickListener(v -> {
                            btnClaim.setEnabled(false);
                            pb.setVisibility(View.VISIBLE);

                            user.getIdToken(false).addOnSuccessListener(result -> {
                                String idToken = result.getToken();
                                CrediLabApiClient.rewardStudent(idToken, "mobile_quiz_" + currentDifficulty,
                                        (int) finalReward, new CrediLabApiClient.ApiCallback() {
                                            @Override
                                            public void onSuccess(String responseBody) {
                                                runOnUiThread(() -> {
                                                    dialog.dismiss();
                                                    android.view.View successCustomView = getLayoutInflater()
                                                            .inflate(R.layout.dialog_custom, null);
                                                    TextView successTvTitle = successCustomView
                                                            .findViewById(R.id.tvDialogTitle);
                                                    TextView successTvMessage = successCustomView
                                                            .findViewById(R.id.tvDialogMessage);
                                                    MaterialButton successBtnConfirm = successCustomView
                                                            .findViewById(R.id.btnConfirm);

                                                    successTvTitle.setText("Reward Claimed!");
                                                    successTvMessage.setText("You successfully claimed " + finalReward
                                                            + " CLB directly to your balance/wallet!");
                                                    successBtnConfirm.setText("Done");

                                                    AlertDialog successDialog = new AlertDialog.Builder(
                                                            QuizActivity.this)
                                                            .setView(successCustomView)
                                                            .setCancelable(false)
                                                            .create();
                                                    if (successDialog.getWindow() != null) {
                                                        successDialog.getWindow().setBackgroundDrawable(
                                                                new android.graphics.drawable.ColorDrawable(0));
                                                    }
                                                    successBtnConfirm.setOnClickListener(v1 -> {
                                                        successDialog.dismiss();
                                                        finish();
                                                    });
                                                    successDialog.show();
                                                });
                                            }

                                            @Override
                                            public void onFailure(int responseCode, String message) {
                                                runOnUiThread(() -> {
                                                    dialog.dismiss();
                                                    String errTitle = "Claim Failed";
                                                    String errMessage = "Error processing claim:\n" + message;
                                                    if (responseCode == 409) {
                                                        errTitle = "Already Rewarded";
                                                        errMessage = "You have already claimed the ON-CHAIN reward for this difficulty tier!";
                                                    }

                                                    android.view.View errCustomView = getLayoutInflater()
                                                            .inflate(R.layout.dialog_custom, null);
                                                    TextView errTvTitle = errCustomView
                                                            .findViewById(R.id.tvDialogTitle);
                                                    TextView errTvMessage = errCustomView
                                                            .findViewById(R.id.tvDialogMessage);
                                                    MaterialButton errBtnConfirm = errCustomView
                                                            .findViewById(R.id.btnConfirm);

                                                    errTvTitle.setText(errTitle);
                                                    errTvMessage.setText(errMessage);
                                                    errBtnConfirm.setText("Done");

                                                    AlertDialog errDialog = new AlertDialog.Builder(QuizActivity.this)
                                                            .setView(errCustomView)
                                                            .setCancelable(false)
                                                            .create();
                                                    if (errDialog.getWindow() != null) {
                                                        errDialog.getWindow().setBackgroundDrawable(
                                                                new android.graphics.drawable.ColorDrawable(0));
                                                    }
                                                    errBtnConfirm.setOnClickListener(v2 -> {
                                                        errDialog.dismiss();
                                                        finish();
                                                    });
                                                    errDialog.show();
                                                });
                                            }
                                        });
                            }).addOnFailureListener(e -> {
                                runOnUiThread(() -> {
                                    pb.setVisibility(View.GONE);
                                    btnClaim.setEnabled(true);

                                    android.view.View authCustomView = getLayoutInflater().inflate(
                                            R.layout.dialog_custom,
                                            null);
                                    TextView authTvTitle = authCustomView.findViewById(R.id.tvDialogTitle);
                                    TextView authTvMessage = authCustomView.findViewById(R.id.tvDialogMessage);
                                    MaterialButton authBtnConfirm = authCustomView.findViewById(R.id.btnConfirm);

                                    authTvTitle.setText("Authentication Error");
                                    authTvMessage.setText("Failed to retrieve Firebase ID token.");
                                    authBtnConfirm.setText("OK");

                                    AlertDialog authErrDialog = new AlertDialog.Builder(QuizActivity.this)
                                            .setView(authCustomView)
                                            .create();
                                    if (authErrDialog.getWindow() != null) {
                                        authErrDialog.getWindow()
                                                .setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
                                    }
                                    authBtnConfirm.setOnClickListener(v3 -> authErrDialog.dismiss());
                                    authErrDialog.show();
                                });
                            });
                        });

                        dialog.show();
                    });
                } else {
                    // Already completed previously
                    runOnUiThread(() -> {
                        android.view.View doneCustomView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
                        TextView doneTvTitle = doneCustomView.findViewById(R.id.tvDialogTitle);
                        TextView doneTvMessage = doneCustomView.findViewById(R.id.tvDialogMessage);
                        MaterialButton doneBtnConfirm = doneCustomView.findViewById(R.id.btnConfirm);

                        doneTvTitle.setText("🎉 " + diffLabel + " Complete!");
                        doneTvMessage.setText("Great job! You've already conquered " + languageName + " — " + diffLabel
                                + ".\n\nYou've previously claimed the rewards for this section.");
                        doneBtnConfirm.setText("Done");

                        AlertDialog doneDialog = new AlertDialog.Builder(this)
                                .setView(doneCustomView)
                                .setCancelable(false)
                                .create();
                        if (doneDialog.getWindow() != null) {
                            doneDialog.getWindow()
                                    .setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
                        }
                        doneBtnConfirm.setOnClickListener(v4 -> {
                            doneDialog.dismiss();
                            finish();
                        });
                        doneDialog.show();
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
                runOnUiThread(() -> finish());
            }
        });
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
