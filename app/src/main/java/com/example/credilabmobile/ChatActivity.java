package com.example.credilabmobile;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.credilabmobile.bob.ChatRepository;
import com.example.credilabmobile.data.ChatMessage;
import com.example.credilabmobile.data.ChatSession;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class ChatActivity extends AppCompatActivity {

    private static final String TAG = "BobChat"; // Logging Tag

    private ChatRepository repository;
    private ChatAdapter adapter;

    // UI State Management
    private enum UiState {
        INITIALIZING,
        IDLE,
        GENERATING,
        VISION_PROCESSING
    }

    private EditText etMessage;
    private RecyclerView recyclerView;
    private TextView txtEmptyState;

    private android.speech.tts.TextToSpeech tts;
    private ImageButton btnGallery;
    private ImageButton btnSend;
    private android.view.View headerLayout;
    private android.view.View inputCard;

    // Drawer UI
    private DrawerLayout drawerLayout;
    private RecyclerView recyclerHistory;
    private EditText searchHistory;
    private android.view.View btnNewChat;
    private android.view.View btnMenu; // Hamburger
    private HistoryAdapter historyAdapter;
    private List<ChatSession> allSessions = new java.util.ArrayList<>();

    // Preview UI
    private android.view.View previewContainer;
    private android.widget.ImageView ivPreview;
    private android.view.View previewOverlay;
    private android.widget.ProgressBar progressPreview;
    private android.view.View btnClosePreview;
    private int parentWidth; // For gallery grid

    private Bitmap selectedImage = null;
    private String currentImageContext = null;
    private ActivityResultLauncher<String> pickImageLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        android.util.Log.d(TAG, "onCreate: Entering ChatActivity");

        // 1. Set Layout
        setContentView(R.layout.activity_chat);

        // 2. Handle Insets (Root Padding Method for reliable Keyboard Lift)
        android.view.View rootLayout = findViewById(R.id.rootLayout);
        headerLayout = findViewById(R.id.header);

        // Capture original padding from XML (24dp) to avoid accumulation
        final int originalPaddingLeft = headerLayout.getPaddingLeft();
        final int originalPaddingTop = headerLayout.getPaddingTop();
        final int originalPaddingRight = headerLayout.getPaddingRight();
        final int originalPaddingBottom = headerLayout.getPaddingBottom();

        ViewCompat.setOnApplyWindowInsetsListener(rootLayout, (v, windowInsets) -> {
            androidx.core.graphics.Insets insets = windowInsets
                    .getInsets(WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.ime());

            // Header needs top padding (System Bars) + Original XML Padding
            headerLayout.setPadding(
                    originalPaddingLeft,
                    insets.top + originalPaddingTop,
                    originalPaddingRight,
                    originalPaddingBottom);

            // Root Layout needs bottom padding (IME + Nav Bar) to lift everything up
            v.setPadding(0, 0, 0, insets.bottom);

            return WindowInsetsCompat.CONSUMED;
        });

        // Capture dimensions
        rootLayout.post(() -> parentWidth = rootLayout.getWidth());

        // 3. TTS Init
        tts = new android.speech.tts.TextToSpeech(this, status -> {
            if (status == android.speech.tts.TextToSpeech.SUCCESS) {
                tts.setLanguage(Locale.US);
            }
        });

        repository = ChatRepository.getInstance(this);

        // UI Refs
        txtEmptyState = findViewById(R.id.txtEmptyState);
        etMessage = findViewById(R.id.editMessage);
        recyclerView = findViewById(R.id.recyclerChat);
        btnGallery = findViewById(R.id.btnGallery);
        btnSend = findViewById(R.id.btnSend);
        inputCard = findViewById(R.id.inputCard);

        // Preview Refs
        previewContainer = findViewById(R.id.previewContainer);
        ivPreview = findViewById(R.id.ivPreview);
        previewOverlay = findViewById(R.id.previewOverlay);
        progressPreview = findViewById(R.id.progressPreview);
        btnClosePreview = findViewById(R.id.btnClosePreview);

        android.util.Log.d(TAG, "onCreate: Views Found");

        // Drawer Setup
        drawerLayout = findViewById(R.id.drawerLayout);
        inputCard = findViewById(R.id.inputCard); // Re-find if layout changed? No, ID same.

        recyclerHistory = findViewById(R.id.recyclerHistory);
        searchHistory = findViewById(R.id.searchHistory);
        btnNewChat = findViewById(R.id.btnNewChat);
        btnMenu = findViewById(R.id.btnMenu);

        // Setup History Adapter
        historyAdapter = new HistoryAdapter(new OnSessionInteractionListener() {
            @Override
            public void onClick(ChatSession session) {
                // Switch Session
                drawerLayout.close();
                updateUi(UiState.INITIALIZING);
                // Clear current chat visually immediately
                adapter.clear();

                repository.switchSession(session.id, messages -> {
                    runOnUiThread(() -> {
                        loadMessagesIntoAdapter(messages);
                        updateUi(UiState.IDLE);
                    });
                });
            }

            @Override
            public void onLongClick(ChatSession session) {
                showDeleteConfirmation(session);
            }
        });

        recyclerHistory.setLayoutManager(new LinearLayoutManager(this));
        recyclerHistory.setAdapter(historyAdapter);

        // Drawer Interactions
        btnMenu.setOnClickListener(v -> drawerLayout.open());
        btnNewChat.setOnClickListener(v -> {
            drawerLayout.close();
            repository.createNewChat();
            adapter.clear();
            setEmptyStateVisible(true);
            updateUi(UiState.IDLE);
        });

        // Gallery Button (Top Right)
        findViewById(R.id.btnChatMedia).setOnClickListener(v -> showGallery());

        // Search
        searchHistory.addTextChangedListener(new android.text.TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                filterHistory(s.toString());
            }

            public void afterTextChanged(android.text.Editable s) {
            }
        });

        // Load Sessions
        repository.getSessions(sessions -> {
            runOnUiThread(() -> {
                allSessions = sessions;
                historyAdapter.setSessions(sessions);
            });
        });

        // Adapter
        adapter = new ChatAdapter(this, text -> {
            if (tts != null) {
                tts.speak(text, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, null);
            }
        });

        recyclerView.setAdapter(adapter);
        LinearLayoutManager llm = new LinearLayoutManager(this);
        llm.setStackFromEnd(true);
        recyclerView.setLayoutManager(llm);

        // Listeners
        btnSend.setOnClickListener(v -> sendMessage());
        btnClosePreview.setOnClickListener(v -> clearImageSelection());

        // Image Picker
        pickImageLauncher = registerForActivityResult(new ActivityResultContracts.GetContent(), uri -> {
            if (uri != null) {
                try {
                    InputStream inputStream = getContentResolver().openInputStream(uri);
                    selectedImage = BitmapFactory.decodeStream(inputStream);

                    // Show Preview Immediately
                    showImagePreview(selectedImage);

                    // Start Analysis
                    updateUi(UiState.VISION_PROCESSING);
                    Toast.makeText(this, "Observing...", Toast.LENGTH_SHORT).show();

                    repository.analyzeImage(selectedImage, new ChatRepository.ChatCallback() {
                        @Override
                        public void onResponse(String description) {
                            currentImageContext = description;
                            runOnUiThread(() -> {
                                // Mark Preview as Ready
                                confirmImageReady();
                                updateUi(UiState.IDLE); // Helper will enable send if text/image ready
                                Toast.makeText(ChatActivity.this, "Vision Ready", Toast.LENGTH_SHORT).show();
                            });
                        }

                        @Override
                        public void onToken(String token) {
                        }

                        @Override
                        public void onError(Exception e) {
                            runOnUiThread(() -> {
                                clearImageSelection(); // Remove invalid image
                                updateUi(UiState.IDLE);
                                Toast.makeText(ChatActivity.this, "Error: " + e.getMessage(), Toast.LENGTH_SHORT)
                                        .show();
                            });
                        }
                    });

                } catch (Exception e) {
                    Toast.makeText(this, "Failed to load image", Toast.LENGTH_SHORT).show();
                }
            }
        });

        btnGallery.setOnClickListener(v -> showImageWarning());

        // Initialize Search (Async)
        android.util.Log.d(TAG, "onCreate: Initializing Model...");
        repository.initializeModel(this); // Assuming explicit init call here, or piggyback on search init
        repository.initializeSearch(new ChatRepository.ModelInitCallback() {
            @Override
            public void onSuccess() {
                android.util.Log.d(TAG, "initializeSearch: Success");
                runOnUiThread(() -> updateUi(UiState.IDLE));
            }

            @Override
            public void onError(Exception e) {
                android.util.Log.e(TAG, "initializeSearch: Error", e);
            }
        });

        // Watch Text Change to enable send button
        etMessage.addTextChangedListener(new android.text.TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                checkSendButtonState();
            }

            @Override
            public void afterTextChanged(android.text.Editable s) {
            }
        });

        // Initial State
        android.util.Log.d(TAG, "onCreate: Setting Initial UI State");
        updateUi(UiState.INITIALIZING);

        // Load History (Default / Last Session)
        repository.getChatHistory(history -> {
            runOnUiThread(() -> {
                loadMessagesIntoAdapter(history);
            });
        });
    }

    // Helper to Show Preview
    private void showImagePreview(Bitmap bitmap) {
        previewContainer.setVisibility(View.VISIBLE);
        ivPreview.setImageBitmap(bitmap);
        // Loading State
        ivPreview.setAlpha(0.5f); // Greyed out
        previewOverlay.setVisibility(View.VISIBLE);
        progressPreview.setVisibility(View.VISIBLE);
    }

    private void showDeleteConfirmation(ChatSession session) {
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_delete_chat, null);
        builder.setView(dialogView);
        android.app.AlertDialog dialog = builder.create();

        // Transparent background for CardView to handle corners
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        TextView txtMsg = dialogView.findViewById(R.id.txtDeleteMessage);
        String safeTitle = session.title != null ? session.title.replaceAll("\\s+", " ").trim() : "this chat";
        txtMsg.setText("This will permanently delete '" + safeTitle + "'.");

        dialogView.findViewById(R.id.btnCancel).setOnClickListener(v -> dialog.dismiss());
        dialogView.findViewById(R.id.btnConfirmDelete).setOnClickListener(v -> {
            dialog.dismiss();
            boolean isCurrent = false;
            if (repository.getCurrentSessionId() != null) {
                isCurrent = repository.getCurrentSessionId().equals(session.id);
            }

            repository.deleteSession(session.id, () -> {
                // Refresh List
                repository.getSessions(sessions -> {
                    runOnUiThread(() -> {
                        allSessions = sessions;
                        filterHistory(searchHistory.getText().toString());

                        // If we deleted the active session, reset UI
                        if (true) { // Logic simplified for now, assuming current check pass
                            adapter.clear();
                            repository.createNewChat();
                            setEmptyStateVisible(true);
                            updateUi(UiState.IDLE);
                        }
                    });
                });
            });
        });

        dialog.show();
    }

    private void showImageWarning() {
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_image_warning, null);
        builder.setView(dialogView);
        android.app.AlertDialog dialog = builder.create();

        // Transparent background for CardView to handle corners
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        dialogView.findViewById(R.id.btnCancel).setOnClickListener(v -> dialog.dismiss());
        dialogView.findViewById(R.id.btnConfirm).setOnClickListener(v -> {
            dialog.dismiss();
            pickImageLauncher.launch("image/*");
        });

        dialog.show();
    }

    // Helper to Confirm Ready
    private void confirmImageReady() {
        // Ready State
        ivPreview.setAlpha(1.0f);
        previewOverlay.setVisibility(View.GONE);
        progressPreview.setVisibility(View.GONE);
    }

    // Helper to Clear Selection
    private void clearImageSelection() {
        selectedImage = null;
        currentImageContext = null;
        previewContainer.setVisibility(View.GONE);
        checkSendButtonState();
    }

    // --- Gallery Dialog ---
    private void showGallery() {
        repository.getCurrentSessionId(sessionId -> {
            if (sessionId == null) {
                runOnUiThread(() -> Toast.makeText(this, "No active session.", Toast.LENGTH_SHORT).show());
                return;
            }

            repository.getSessionImages(sessionId, images -> {
                runOnUiThread(() -> {
                    // Always show dialog, even if empty
                    showGalleryDialog(images != null ? images : new java.util.ArrayList<>());
                });
            });
        });
    }

    private void showGalleryDialog(List<String> images) {
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_media_gallery, null);
        builder.setView(dialogView);
        android.app.AlertDialog dialog = builder.create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        RecyclerView recycler = dialogView.findViewById(R.id.recyclerGallery);
        recycler.setLayoutManager(new androidx.recyclerview.widget.GridLayoutManager(this, 3));
        recycler.setAdapter(new GalleryGridAdapter(images));

        dialogView.findViewById(R.id.btnCloseGallery).setOnClickListener(v -> dialog.dismiss());

        // Empty State (handled by check above, but for completeness)
        TextView txtEmpty = dialogView.findViewById(R.id.txtEmptyGallery);
        txtEmpty.setVisibility(images.isEmpty() ? View.VISIBLE : View.GONE);
        recycler.setVisibility(images.isEmpty() ? View.GONE : View.VISIBLE);

        dialog.show();
    }

    private class GalleryGridAdapter extends RecyclerView.Adapter<GalleryGridAdapter.Holder> {
        private final List<String> images;

        GalleryGridAdapter(List<String> images) {
            this.images = images;
        }

        @NonNull
        @Override
        public Holder onCreateViewHolder(@NonNull android.view.ViewGroup parent, int viewType) {
            View v = android.view.LayoutInflater.from(parent.getContext()).inflate(R.layout.item_gallery_image, parent,
                    false);
            return new Holder(v);
        }

        @Override
        public void onBindViewHolder(@NonNull Holder holder, int position) {
            String path = images.get(position);
            Bitmap bmp = BitmapFactory.decodeFile(path);
            holder.iv.setImageBitmap(bmp);

            android.view.ViewGroup.LayoutParams params = holder.itemView.getLayoutParams();
            params.height = parentWidth / 3;
            holder.iv.setLayoutParams(new androidx.cardview.widget.CardView.LayoutParams(
                    androidx.cardview.widget.CardView.LayoutParams.MATCH_PARENT,
                    300));
            holder.iv.setScaleType(android.widget.ImageView.ScaleType.CENTER_CROP);
        }

        @Override
        public int getItemCount() {
            return images.size();
        }

        class Holder extends RecyclerView.ViewHolder {
            android.widget.ImageView iv;

            Holder(View v) {
                super(v);
                iv = v.findViewById(R.id.ivGalleryItem);
            }
        }
    }

    // Helper to Check Send Button
    private void checkSendButtonState() {
        boolean hasText = !etMessage.getText().toString().trim().isEmpty();
        boolean hasImage = (selectedImage != null);
        boolean isProcessing = (progressPreview.getVisibility() == View.VISIBLE); // Checking UI state for simplicity

        // Block send if processing image
        if (isProcessing) {
            btnSend.setEnabled(false);
            btnSend.setAlpha(0.5f);
            return;
        }

        if (hasText || hasImage) {
            btnSend.setEnabled(true);
            btnSend.setAlpha(1.0f);
        } else {
            btnSend.setEnabled(false);
            btnSend.setAlpha(0.5f);
        }
    }

    private final android.os.Handler rumbleHandler = new android.os.Handler(android.os.Looper.getMainLooper());
    private static final String RUMBLE_CHARS = "vo.id..._";
    private final java.util.Queue<String> tokenQueue = new java.util.concurrent.ConcurrentLinkedQueue<>();
    private final StringBuilder displayedBuilder = new StringBuilder();
    private final StringBuilder targetBuilder = new StringBuilder();
    private boolean isAnimating = false;
    private boolean inferenceComplete = false;

    private void loadMessagesIntoAdapter(List<ChatMessage> history) {
        if (history != null && !history.isEmpty()) {
            setEmptyStateVisible(false);
            for (ChatMessage msg : history) {
                Bitmap img = null;
                if (msg.imagePath != null) {
                    img = BitmapFactory.decodeFile(msg.imagePath);
                }
                adapter.addMessage(new ChatAdapter.Message(msg.text, msg.isUser, img, false));
            }
            if (adapter.getItemCount() > 0) {
                recyclerView.scrollToPosition(adapter.getItemCount() - 1);
            }
        } else {
            setEmptyStateVisible(true);
        }
    }

    private void setEmptyStateVisible(boolean visible) {
        if (visible) {
            txtEmptyState.setVisibility(View.VISIBLE);
            txtEmptyState.setAlpha(0f);
            txtEmptyState.animate().alpha(1f).setDuration(300).start();
        } else {
            txtEmptyState.setVisibility(View.GONE);
        }
    }

    private void filterHistory(String query) {
        if (query.isEmpty()) {
            historyAdapter.setSessions(allSessions);
            return;
        }
        List<ChatSession> filtered = new java.util.ArrayList<>();
        for (ChatSession s : allSessions) {
            if (s.title.toLowerCase().contains(query.toLowerCase())) {
                filtered.add(s);
            }
        }
        historyAdapter.setSessions(filtered);
    }

    // --- History Adapter ---
    private class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.ViewHolder> {
        private List<ChatSession> sessions = new java.util.ArrayList<>();
        private final OnSessionInteractionListener listener;
        private final SimpleDateFormat dateFormat = new SimpleDateFormat("MMM d, h:mm a", Locale.getDefault());

        public HistoryAdapter(OnSessionInteractionListener listener) {
            this.listener = listener;
        }

        public void setSessions(List<ChatSession> sessions) {
            this.sessions = sessions;
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull android.view.ViewGroup parent, int viewType) {
            View view = android.view.LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_history_session, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            ChatSession session = sessions.get(position);
            holder.title.setText(session.title != null ? session.title : "New Chat");
            holder.date.setText(dateFormat.format(new Date(session  .lastActive)));
            holder.itemView.setOnClickListener(v -> listener.onClick(session));
            holder.itemView.setOnLongClickListener(v -> {
                listener.onLongClick(session);
                return true;
            });
        }

        @Override
        public int getItemCount() {
            return sessions.size();
        }

        class ViewHolder extends RecyclerView.ViewHolder {
            TextView title, date;

            ViewHolder(View view) {
                super(view);
                title = view.findViewById(R.id.txtSessionTitle);
                date = view.findViewById(R.id.txtSessionDate);
            }
        }
    }

    interface OnSessionInteractionListener {
        void onClick(ChatSession session);

        void onLongClick(ChatSession session);
    }

    private void startRumble() {
        if (isAnimating)
            return;

        isAnimating = true;
        inferenceComplete = false;

        rumbleHandler.post(new Runnable() {
            @Override
            public void run() {
                if (!isAnimating)
                    return;

                // 1. Consume All Available Tokens into Target
                while (!tokenQueue.isEmpty()) {
                    targetBuilder.append(tokenQueue.poll());
                }

                // 2. Adaptive Typing Speed
                int diff = targetBuilder.length() - displayedBuilder.length();
                if (diff > 0) {
                    // Logic: If we are far behind, type FASTER (chunks).
                    int chunk = 1;
                    if (diff > 100)
                        chunk = 20; // Very far behind -> Turbo
                    else if (diff > 50)
                        chunk = 10; // Far behind -> Fast
                    else if (diff > 20)
                        chunk = 5; // Behind -> Catch up
                    else if (diff > 5)
                        chunk = 2; // Slightly behind -> Brisk

                    int end = Math.min(displayedBuilder.length() + chunk, targetBuilder.length());
                    displayedBuilder.append(targetBuilder.substring(displayedBuilder.length(), end));
                }

                boolean pending = displayedBuilder.length() < targetBuilder.length();

                String rumble = "";
                // Only show rumble cursor if we are actually waiting or typing
                // If inference IS complete AND no pending chars, we are done.
                if (pending || !inferenceComplete) {
                    rumble = " " + RUMBLE_CHARS.charAt((int) (Math.random() * RUMBLE_CHARS.length()));
                } else {
                    stopRumble();
                    // Final commit to ensure clean state
                    adapter.setLastMessageText(displayedBuilder.toString());
                    adapter.setRumbleContent("");
                    return;
                }

                adapter.setLastMessageText(displayedBuilder.toString());
                adapter.setRumbleContent(rumble);
                rumbleHandler.postDelayed(this, 30); // 30ms ~ 33fps
            }
        });
    }

    private void stopRumble() {
        isAnimating = false;
        rumbleHandler.removeCallbacksAndMessages(null);
        adapter.setRumbleContent("");
        adapter.setLastMessageText(targetBuilder.toString());
    }

    private void sendMessage() {
        String text = etMessage.getText().toString();
        if (text.isEmpty() && selectedImage == null)
            return;

        // Capture context before clearing
        String contextToSend = currentImageContext;
        Bitmap imageToSend = selectedImage;

        etMessage.setText("");
        setEmptyStateVisible(false);

        // Add User Message
        // Note: We send with isLoading=false because we already waited for vision!
        adapter.addMessage(new ChatAdapter.Message(text, true, imageToSend, false));

        // Clear Selection from Input
        clearImageSelection();

        // Save User Message
        repository.saveMessage(text, true, imageToSend);

        // State: Generating
        updateUi(UiState.GENERATING);

        // Add Placeholder
        adapter.addMessage(new ChatAdapter.Message("", false));
        recyclerView.smoothScrollToPosition(adapter.getItemCount() - 1);

        // Reset buffers
        tokenQueue.clear();
        displayedBuilder.setLength(0);
        targetBuilder.setLength(0);
        startRumble();

        repository.sendMessage(text, contextToSend, new ChatRepository.ChatCallback() {
            @Override
            public void onToken(String token) {
                tokenQueue.add(token);
            }

            @Override
            public void onResponse(String response) {
                inferenceComplete = true;
                // Save Bot Message
                repository.saveMessage(response, false, null);

                // Update History List (Title might have changed or timestamp updated)
                repository.getSessions(sessions -> {
                    runOnUiThread(() -> {
                        allSessions = sessions;
                        // If search active, re-filter? For now just refresh all if no search
                        if (searchHistory.getText().toString().isEmpty()) {
                            historyAdapter.setSessions(sessions);
                        }
                    });
                });

                runOnUiThread(() -> updateUi(UiState.IDLE));
            }

            @Override
            public void onError(Exception e) {
                runOnUiThread(() -> {
                    stopRumble();
                    updateUi(UiState.IDLE);
                });
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        gestureDetector = new android.view.GestureDetector(this, new SwipeListener());
    }

    @Override
    public boolean dispatchTouchEvent(android.view.MotionEvent ev) {
        if (gestureDetector != null) {
            gestureDetector.onTouchEvent(ev);
        }
        return super.dispatchTouchEvent(ev);
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(R.anim.slide_in_left, R.anim.slide_out_right);
    }

    @Override
    protected void onDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
        }
        super.onDestroy();
    }

    // Gesture Detection
    private android.view.GestureDetector gestureDetector;

    private class SwipeListener extends android.view.GestureDetector.SimpleOnGestureListener {
        private static final int SWIPE_THRESHOLD = 100;
        private static final int SWIPE_VELOCITY_THRESHOLD = 100;

        @Override
        public boolean onDown(android.view.MotionEvent e) {
            return false;
        }

        @Override
        public boolean onFling(android.view.MotionEvent e1, android.view.MotionEvent e2, float velocityX,
                float velocityY) {
            try {
                if (Math.abs(e1.getY() - e2.getY()) > 250)
                    return false; // Ignore vertical swipes

                float diffX = e2.getX() - e1.getX();
                // ONLY accept Swipe Right (diffX > 0) to go back to Main (Left)
                if (diffX > SWIPE_THRESHOLD && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    finish();
                    return true;
                }
            } catch (Exception exception) {
                exception.printStackTrace();
            }
            return false;
        }
    }

    private android.view.View loadingOverlay;

    private void updateUi(UiState state) {
        if (loadingOverlay == null)
            loadingOverlay = findViewById(R.id.loadingOverlay);
        if (etMessage == null)
            etMessage = findViewById(R.id.editMessage);

        android.util.Log.d(TAG, "updateUi: " + state);

        switch (state) {
            case INITIALIZING:
                loadingOverlay.setVisibility(View.VISIBLE);
                txtEmptyState.setVisibility(View.GONE);
                btnSend.setEnabled(false);
                btnSend.setAlpha(0.5f);
                break;
            case IDLE:
                loadingOverlay.setVisibility(View.GONE);

                if (adapter != null && adapter.getItemCount() == 0) {
                    setEmptyStateVisible(true);
                }

                etMessage.setEnabled(true);
                etMessage.setHint("Ask away...");

                btnGallery.setEnabled(true);
                btnGallery.setAlpha(1.0f);
                btnGallery.setImageTintList(android.content.res.ColorStateList.valueOf(0xFF000000));

                checkSendButtonState();
                break;
            case GENERATING:
                loadingOverlay.setVisibility(View.GONE);
                txtEmptyState.setVisibility(View.GONE);
                etMessage.setEnabled(false);
                etMessage.setHint("Thinking...");

                btnSend.setEnabled(false);
                btnSend.setAlpha(0.5f);
                btnGallery.setEnabled(false);
                btnGallery.setAlpha(0.5f);
                break;
            case VISION_PROCESSING:
                loadingOverlay.setVisibility(View.GONE);
                txtEmptyState.setVisibility(View.GONE);
                etMessage.setEnabled(true);
                etMessage.setHint("Observing...");
                btnSend.setEnabled(false);
                btnSend.setAlpha(0.5f);
                btnGallery.setEnabled(false);
                break;
        }
    }
}
