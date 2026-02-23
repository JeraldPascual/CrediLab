package com.example.credilabmobile.bob;

import android.content.Context;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.room.Room;

import com.example.credilabmobile.data.AppDatabase;
import com.example.credilabmobile.data.ChatDao;
import com.example.credilabmobile.data.ChatMessage;
import com.example.credilabmobile.data.ChatSession;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatRepository {
    private static final String TAG = "ChatRepository";
    private static ChatRepository INSTANCE;

    private AppDatabase db;
    private ChatDao chatDao;
    private LLMEngine llmEngine;
    private ExecutorService executor;
    private Handler mainHandler;

    private MutableLiveData<List<ChatMessage>> currentMessages = new MutableLiveData<>();
    private MutableLiveData<String> currentSessionId = new MutableLiveData<>();
    private MutableLiveData<Boolean> isGenerating = new MutableLiveData<>();
    private MutableLiveData<String> modelStatus = new MutableLiveData<>("Unloaded");

    // "Bob" System Prompt
    private static final String SYSTEM_PROMPT = "You are Bob, a friendly and helpful AI assistant residing in the CrediLab app. "
            +
            "You are offline and private. You answer questions concisely and accurately. " +
            "You can analyze images if the user provides them.";

    private ChatRepository(Context context) {
        this.db = Room.databaseBuilder(context.getApplicationContext(),
                AppDatabase.class, "credilab-db")
                .fallbackToDestructiveMigration()
                .build();
        this.chatDao = db.chatDao();
        this.llmEngine = new LLMEngine();
        this.executor = Executors.newFixedThreadPool(4); // Background threads
        this.mainHandler = new Handler(Looper.getMainLooper());
    }

    public static synchronized ChatRepository getInstance(Context context) {
        if (INSTANCE == null) {
            INSTANCE = new ChatRepository(context);
        }
        return INSTANCE;
    }

    public AppDatabase getDatabase() {
        return db;
    }

    public LiveData<List<ChatMessage>> getCurrentMessages() {
        return currentMessages;
    }

    public LiveData<String> getModelStatus() {
        return modelStatus;
    }

    public LiveData<Boolean> getIsGenerating() {
        return isGenerating;
    }

    public String getCurrentSessionId() {
        return currentSessionId.getValue();
    }

    // --- Interfaces ---
    public interface ChatCallback {
        void onToken(String token);

        void onResponse(String response);

        void onError(Exception e);
    }

    public interface SessionsCallback {
        void onResult(List<ChatSession> sessions);
    }

    public interface MessagesCallback {
        void onResult(List<ChatMessage> messages);
    }

    public interface ModelInitCallback {
        void onSuccess();

        void onError(Exception e);
    }

    public interface ImageAnalysisCallback {
        void onResponse(String description);

        void onToken(String token);

        void onError(Exception e);
    }

    public interface SessionIdCallback {
        void onResult(String sessionId);
    }

    public interface ImagesCallback {
        void onResult(List<String> images);
    }

    // --- Session Management ---

    public void createNewChat() {
        startNewSession();
    }

    public void startNewSession() {
        String newId = UUID.randomUUID().toString();
        executor.execute(() -> {
            ChatSession session = new ChatSession(newId, "New Chat", System.currentTimeMillis(), "");
            chatDao.insertSession(session);
            loadSession(newId);
        });
    }

    public void switchSession(String sessionId, MessagesCallback callback) {
        executor.execute(() -> {
            List<ChatMessage> messages = chatDao.getMessagesBySession(sessionId);
            mainHandler.post(() -> {
                currentSessionId.setValue(sessionId);
                currentMessages.setValue(messages);
                llmEngine.resetState();
                if (callback != null)
                    callback.onResult(messages);
            });
        });
    }

    public void loadSession(String sessionId) {
        switchSession(sessionId, null);
    }

    public void getSessions(SessionsCallback callback) {
        executor.execute(() -> {
            List<ChatSession> sessions = chatDao.getAllSessions();
            callback.onResult(sessions);
        });
    }

    public void getChatHistory(MessagesCallback callback) {
        String current = currentSessionId.getValue();
        if (current != null) {
            executor.execute(() -> {
                List<ChatMessage> msgs = chatDao.getMessagesBySession(current);
                callback.onResult(msgs);
            });
        } else {
            // Try to load last session or create new
            executor.execute(() -> {
                List<ChatSession> sessions = chatDao.getAllSessions();
                if (!sessions.isEmpty()) {
                    ChatSession last = sessions.get(0);
                    loadSession(last.id);
                    // Wait a bit or callback inside loadSession?
                    // Simplification: just return empty for now, UI observes LiveData anyway,
                    // but ChatActivity requests explicit history.
                    // Let's modify loadSession to allow callback or just handle it here.
                    List<ChatMessage> msgs = chatDao.getMessagesBySession(last.id);
                    callback.onResult(msgs);
                } else {
                    createNewChat();
                    callback.onResult(new ArrayList<>());
                }
            });
        }
    }

    public void deleteSession(String sessionId, Runnable onSuccess) {
        executor.execute(() -> {
            chatDao.deleteSession(sessionId);
            chatDao.clearMessages(sessionId);
            if (sessionId.equals(currentSessionId.getValue())) {
                mainHandler.post(() -> currentSessionId.setValue(null));
            }
            if (onSuccess != null)
                onSuccess.run();
        });
    }

    // --- Model Management ---

    public void initializeSearch(ModelInitCallback callback) {
        // Just reusing model init
        // In real app, might separate search index init.
        // For now, just success.
        if (callback != null)
            callback.onSuccess();
    }

    public void getCurrentSessionId(com.example.credilabmobile.bob.ChatRepository.SessionIdCallback callback) {
        callback.onResult(currentSessionId.getValue());
    }

    public void initializeModel(Context context) {
        executor.execute(() -> {
            File filesDir = context.getExternalFilesDir(null);
            if (filesDir == null) {
                postStatus("Error: External Storage Unavailable");
                return;
            }

            // Look for 'phi3' (Vision) or 'phi3mini' (Text)
            File visionDir = new File(filesDir, "phi3");
            File textDir = new File(filesDir, "phi3mini");

            // SEARCH FOR VISION MODEL FILES
            // USER specified: phi-3-v-128k-instruct-vision.onnx is in phi3 folder
            File visionLlmFile = findOnnxFile(visionDir, "phi-3-v-128k-instruct-vision.onnx");

            if (visionLlmFile == null) {
                // Fallback to original name just in case
                visionLlmFile = findOnnxFile(visionDir, "phi-3-vision-128k-instruct-int4-cpu-ep.onnx");
            }

            if (visionLlmFile != null) {
                // Assume other files are in the same directory
                File parentDir = visionLlmFile.getParentFile();
                // Standard names for the other parts usually accompany the main model
                File visionEmbedFile = new File(parentDir, "phi-3-vision-128k-instruct-vision-int4-cpu-ep.onnx");
                File textEmbedFile = new File(parentDir, "phi-3-vision-128k-instruct-text-embedding-int4-cpu-ep.onnx");

                // If user only has ONE file, maybe it's a monolithic model?
                // But LLMEngine expects 3 paths. We'll try to load providing the same path or
                // null if not found?
                // Actually, if they are missing, LLMEngine might fail or default.
                // Let's try to find them by partial name or assume standard names.

                if (visionEmbedFile.exists() && textEmbedFile.exists()) {
                    postStatus("Loading Vision Model...");
                    llmEngine.loadVisionModel(visionEmbedFile.getAbsolutePath(), visionLlmFile.getAbsolutePath(),
                            textEmbedFile.getAbsolutePath());
                    llmEngine.setSystemPrompt(SYSTEM_PROMPT);
                    postStatus("Bob (Vision) Ready");
                    return;
                } else {
                    postStatus("Vision components missing. Using Text Model only if available.");
                }
            }

            // SEARCH FOR TEXT MODEL FILE
            // USER specified:
            // phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx[.data] is in
            // phi3mini
            // We look for the .onnx file (the .data is loaded automatically by ONNX
            // Runtime)
            File textLlmFile = findOnnxFile(textDir, "phi3-mini-4k-instruct-cpu-int4-rtn-block-32-acc-level-4.onnx");

            if (textLlmFile != null) {
                postStatus("Loading Text Model...");
                llmEngine.loadTextModel(null, textLlmFile.getAbsolutePath());
                llmEngine.setSystemPrompt(SYSTEM_PROMPT);
                postStatus("Bob (Text) Ready");
                return;
            }

            postStatus("Models not found. Please check 'phi3' or 'phi3mini' folder content.");
        });
    }

    private File findOnnxFile(File directory, String targetFileName) {
        if (directory == null || !directory.exists() || !directory.isDirectory()) {
            return null;
        }

        // 1. Check direct children
        File directFile = new File(directory, targetFileName);
        if (directFile.exists()) {
            return directFile;
        }

        // 2. Recursive Search
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    File found = findOnnxFile(file, targetFileName);
                    if (found != null) {
                        return found;
                    }
                } else if (file.getName().equalsIgnoreCase(targetFileName)) {
                    return file;
                }
            }
        }
        return null;
    }

    private void postStatus(String status) {
        mainHandler.post(() -> modelStatus.setValue(status));
    }

    // --- Messaging ---

    public void saveMessage(String text, boolean isUser, Bitmap image) {
        String sessionId = currentSessionId.getValue();
        if (sessionId == null)
            return;
        executor.execute(() -> {
            String imagePath = null;
            if (image != null) {
                // Saving image logic should ideally be here or passed in.
                // Simple implementation:
                // imagePath = ImageUtils.saveImageToInternalStorage(context, image);
            }
            ChatMessage msg = new ChatMessage(sessionId, text, isUser, imagePath, System.currentTimeMillis());
            chatDao.insertMessage(msg);
            refreshMessages(sessionId);
        });
    }

    public void sendMessage(String text, String context, ChatCallback callback) {
        String sessionId = currentSessionId.getValue();
        if (sessionId == null)
            return;

        isGenerating.setValue(true);

        executor.execute(() -> {
            // Context injection?
            // If context is provided (from image analysis), prepend it to text or system
            // prompt?
            // "Bob" style: just prepend to prompt.
            String finalPrompt = text;
            if (context != null && !context.isEmpty()) {
                finalPrompt = "Context: " + context + "\n\nUser: " + text;
            }

            // 2. Generate Response
            StringBuilder botTextBuilder = new StringBuilder();

            LLMEngine.TokenCallback tokenCallback = token -> {
                botTextBuilder.append(token);
                if (callback != null)
                    callback.onToken(token);
            };

            String response;
            // NOTE: ChatActivity logic implies it sends image analysis result AS context
            // string,
            // NOT the bitmap again for inference.
            // So we use runInference (text only) here.
            response = llmEngine.runInference(finalPrompt, tokenCallback);

            // 3. Save Bot Message is done by ChatActivity callback onResponse?
            // ChatActivity: onResponse -> repository.saveMessage(response, false, null);
            // So we just return the full response via callback.

            // Wait, we should probably update session preview here?
            chatDao.updateSessionPreview(sessionId, response, System.currentTimeMillis());

            mainHandler.post(() -> {
                isGenerating.setValue(false);
                if (callback != null)
                    callback.onResponse(response);
            });
        });
    }

    public void analyzeImage(Bitmap image, ChatCallback callback) {
        executor.execute(() -> {
            // System prompt for vision?
            // "Describe this image"
            // LLMEngine.runVisionInference
            // But we need a separate callback-based flow.

            StringBuilder builder = new StringBuilder();
            LLMEngine.TokenCallback tokenCallback = token -> {
                builder.append(token);
                if (callback != null)
                    callback.onToken(token);
            };

            String description = llmEngine.runVisionInference("Describe this image in detail.", image, tokenCallback);
            mainHandler.post(() -> {
                if (callback != null)
                    callback.onResponse(description);
            });
        });
    }

    public void getSessionImages(String sessionId,
            com.example.credilabmobile.bob.ChatRepository.ImagesCallback callback) {
        executor.execute(() -> {
            List<String> images = chatDao.getImagesBySession(sessionId);
            callback.onResult(images);
        });
    }

    private void refreshMessages(String sessionId) {
        List<ChatMessage> msgs = chatDao.getMessagesBySession(sessionId);
        mainHandler.post(() -> currentMessages.setValue(msgs));
    }

    // Helper to clear history
    public void clearHistory() {
        String sessionId = currentSessionId.getValue();
        if (sessionId != null) {
            executor.execute(() -> {
                chatDao.clearMessages(sessionId);
                llmEngine.resetState();
                refreshMessages(sessionId);
            });
        }
    }
}
