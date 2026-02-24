package com.example.credilabmobile;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.credilabmobile.bob.ChatRepository;
import com.example.credilabmobile.data.AppDatabase;
import com.example.credilabmobile.data.QuizProgress;
import com.google.android.material.card.MaterialCardView;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;

public class EarnActivity extends AppCompatActivity {

    private RecyclerView rvLanguages;
    private LanguageAdapter adapter;
    private List<LanguageAdapter.LanguageItem> languageItems;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_earn);

        ImageView btnClose = findViewById(R.id.btnClose);
        btnClose.setOnClickListener(v -> finish());

        ImageView btnRules = findViewById(R.id.btnRules);
        btnRules.setOnClickListener(v -> showRulesDialog());

        rvLanguages = findViewById(R.id.rvLanguages);
        rvLanguages.setLayoutManager(new LinearLayoutManager(this));

        languageItems = buildLanguageList();
        adapter = new LanguageAdapter(languageItems, this::showDifficultyDialog);
        rvLanguages.setAdapter(adapter);
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadProgress();
    }

    private List<LanguageAdapter.LanguageItem> buildLanguageList() {
        List<LanguageAdapter.LanguageItem> list = new ArrayList<>();
        list.add(new LanguageAdapter.LanguageItem("java", "Java", "Object-oriented language for Android & enterprise",
                "☕"));
        list.add(new LanguageAdapter.LanguageItem("python", "Python", "Versatile language for AI, web, and scripting",
                "🐍"));
        list.add(new LanguageAdapter.LanguageItem("c", "C", "Low-level systems programming language", "⚙️"));
        list.add(new LanguageAdapter.LanguageItem("cpp", "C++", "High-performance language with OOP support", "🔧"));
        list.add(new LanguageAdapter.LanguageItem("csharp", "C#", "Microsoft's language for .NET and game dev", "🎮"));
        list.add(new LanguageAdapter.LanguageItem("php", "PHP", "Server-side web development language", "🌐"));
        list.add(new LanguageAdapter.LanguageItem("javascript", "JavaScript", "The language of the web", "🟨"));
        list.add(new LanguageAdapter.LanguageItem("devchallenge", "Dev Challenge",
                "Mixed questions from all languages!", "🏆"));
        return list;
    }

    private void loadProgress() {
        Executors.newSingleThreadExecutor().execute(() -> {
            try {
                AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                List<QuizProgress> allProgress = db.quizDao().getAllProgress();

                for (LanguageAdapter.LanguageItem item : languageItems) {
                    item.easyDone = 0;
                    item.mediumDone = 0;
                    item.hardDone = 0;
                    for (QuizProgress p : allProgress) {
                        if (p.language.equals(item.key)) {
                            switch (p.difficulty) {
                                case "easy":
                                    item.easyDone = p.answeredCorrectly;
                                    break;
                                case "medium":
                                    item.mediumDone = p.answeredCorrectly;
                                    break;
                                case "hard":
                                    item.hardDone = p.answeredCorrectly;
                                    break;
                            }
                        }
                    }
                }

                runOnUiThread(() -> adapter.notifyDataSetChanged());
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    private void showDifficultyDialog(LanguageAdapter.LanguageItem item) {
        // Dev Challenge is locked until all other languages are fully completed
        if (item.key.equals("devchallenge")) {
            boolean allComplete = true;
            for (LanguageAdapter.LanguageItem lang : languageItems) {
                if (lang.key.equals("devchallenge"))
                    continue;
                if (lang.easyDone < 50 || lang.mediumDone < 50 || lang.hardDone < 50) {
                    allComplete = false;
                    break;
                }
            }
            if (!allComplete) {
                Dialog lockedDialog = new Dialog(this);
                lockedDialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
                lockedDialog.setContentView(R.layout.dialog_locked);
                lockedDialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
                lockedDialog.getWindow().setLayout(
                        (int) (getResources().getDisplayMetrics().widthPixels * 0.85),
                        android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
                lockedDialog.findViewById(R.id.btnLockedOk).setOnClickListener(v -> lockedDialog.dismiss());
                lockedDialog.show();
                return;
            }
        }

        Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        dialog.setContentView(R.layout.dialog_difficulty_selector);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.getWindow().setLayout(
                (int) (getResources().getDisplayMetrics().widthPixels * 0.9),
                android.view.ViewGroup.LayoutParams.WRAP_CONTENT);

        TextView tvTitle = dialog.findViewById(R.id.tvDialogTitle);
        tvTitle.setText(item.name);

        TextView tvSubtitle = dialog.findViewById(R.id.tvDialogSubtitle);
        tvSubtitle.setText("Choose a difficulty level");

        // Easy — always unlocked
        MaterialCardView cardEasy = dialog.findViewById(R.id.cardEasy);
        TextView tvEasyStatus = dialog.findViewById(R.id.tvEasyStatus);
        TextView btnResetEasy = dialog.findViewById(R.id.btnResetEasy);
        tvEasyStatus.setText(item.easyDone + " / 50 completed");
        if (item.easyDone >= 50) {
            tvEasyStatus.setText("✅ Completed!");
        }
        if (item.easyDone > 0) {
            btnResetEasy.setVisibility(View.VISIBLE);
            btnResetEasy.setOnClickListener(v -> resetDifficulty(item, "easy", dialog));
        }
        cardEasy.setOnClickListener(v -> {
            dialog.dismiss();
            launchQuiz(item, "easy");
        });

        // Medium
        boolean mediumUnlocked = item.easyDone >= 50;
        MaterialCardView cardMedium = dialog.findViewById(R.id.cardMedium);
        TextView tvMediumIcon = dialog.findViewById(R.id.tvMediumIcon);
        TextView tvMediumTitle = dialog.findViewById(R.id.tvMediumTitle);
        TextView tvMediumStatus = dialog.findViewById(R.id.tvMediumStatus);
        TextView tvMediumArrow = dialog.findViewById(R.id.tvMediumArrow);
        TextView btnResetMedium = dialog.findViewById(R.id.btnResetMedium);

        if (mediumUnlocked) {
            tvMediumIcon.setText("🟡");
            tvMediumTitle.setTextColor(ContextCompat.getColor(this, R.color.warning));
            tvMediumStatus.setText(item.mediumDone >= 50 ? "✅ Completed!" : item.mediumDone + " / 50 completed");
            tvMediumArrow.setText("▶");
            tvMediumArrow.setTextColor(ContextCompat.getColor(this, R.color.warning));
            cardMedium.setStrokeColor(ContextCompat.getColor(this, R.color.warning));
            if (item.mediumDone > 0) {
                btnResetMedium.setVisibility(View.VISIBLE);
                btnResetMedium.setOnClickListener(v -> resetDifficulty(item, "medium", dialog));
            }
            cardMedium.setOnClickListener(v -> {
                dialog.dismiss();
                launchQuiz(item, "medium");
            });
        } else {
            cardMedium.setAlpha(0.5f);
            cardMedium.setClickable(false);
        }

        // Hard
        boolean hardUnlocked = item.mediumDone >= 50;
        MaterialCardView cardHard = dialog.findViewById(R.id.cardHard);
        TextView tvHardIcon = dialog.findViewById(R.id.tvHardIcon);
        TextView tvHardTitle = dialog.findViewById(R.id.tvHardTitle);
        TextView tvHardStatus = dialog.findViewById(R.id.tvHardStatus);
        TextView tvHardArrow = dialog.findViewById(R.id.tvHardArrow);
        TextView btnResetHard = dialog.findViewById(R.id.btnResetHard);

        if (hardUnlocked) {
            tvHardIcon.setText("🔴");
            tvHardTitle.setTextColor(ContextCompat.getColor(this, R.color.error));
            tvHardStatus.setText(item.hardDone >= 50 ? "✅ Completed!" : item.hardDone + " / 50 completed");
            tvHardArrow.setText("▶");
            tvHardArrow.setTextColor(ContextCompat.getColor(this, R.color.error));
            cardHard.setStrokeColor(ContextCompat.getColor(this, R.color.error));
            if (item.hardDone > 0) {
                btnResetHard.setVisibility(View.VISIBLE);
                btnResetHard.setOnClickListener(v -> resetDifficulty(item, "hard", dialog));
            }
            cardHard.setOnClickListener(v -> {
                dialog.dismiss();
                launchQuiz(item, "hard");
            });
        } else {
            cardHard.setAlpha(0.5f);
            cardHard.setClickable(false);
        }

        dialog.show();
    }

    private void resetDifficulty(LanguageAdapter.LanguageItem item, String difficulty, Dialog dialog) {
        String diffLabel = difficulty.substring(0, 1).toUpperCase() + difficulty.substring(1);

        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Reset " + diffLabel + "?");
        tvMessage.setText("Reset " + item.name + " — " + diffLabel + " progress?");
        btnConfirm.setText("Reset");
        btnCancel.setVisibility(View.VISIBLE);

        AlertDialog resetDialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (resetDialog.getWindow() != null) {
            resetDialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> {
            resetDialog.dismiss();
            Executors.newSingleThreadExecutor().execute(() -> {
                try {
                    AppDatabase db = ChatRepository.getInstance(getApplicationContext()).getDatabase();
                    db.quizDao().deleteProgress(item.key, difficulty);
                    runOnUiThread(() -> {
                        switch (difficulty) {
                            case "easy":
                                item.easyDone = 0;
                                break;
                            case "medium":
                                item.mediumDone = 0;
                                break;
                            case "hard":
                                item.hardDone = 0;
                                break;
                        }
                        adapter.notifyDataSetChanged();
                        dialog.dismiss();
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        });

        btnCancel.setOnClickListener(v -> resetDialog.cancel());
        resetDialog.show();
    }

    private void showRulesDialog() {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);

        tvTitle.setText("Earn & CLB Rules");
        tvMessage.setText("📖 How It Works:\n\n" +
                "• You have 3 lives per quiz session.\n" +
                "• If you lose all your lives, you are penalized by losing 20 questions of progress!\n" +
                "• Complete 50 questions in a difficulty to finish it.\n" +
                "• Passing difficulties rewards you with CLB tokens to your wallet.\n" +
                "• Finish all difficulties to unlock special challenges!");
        btnConfirm.setText("Got it");

        AlertDialog rulesDialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (rulesDialog.getWindow() != null) {
            rulesDialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> rulesDialog.dismiss());
        rulesDialog.show();
    }

    private void launchQuiz(LanguageAdapter.LanguageItem item, String difficulty) {
        Intent intent = new Intent(this, QuizActivity.class);
        intent.putExtra("language", item.key);
        intent.putExtra("languageName", item.name);
        intent.putExtra("difficulty", difficulty);
        startActivity(intent);
    }
}
