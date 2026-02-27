package com.example.credilabmobile.bob;

import android.util.Log;
import ai.onnxruntime.OnnxTensor;
import ai.onnxruntime.OrtEnvironment;
import ai.onnxruntime.OrtException;
import ai.onnxruntime.OrtSession;
import ai.onnxruntime.OnnxValue;
import ai.onnxruntime.NodeInfo;
import ai.onnxruntime.TensorInfo;
import android.graphics.Bitmap;
import java.util.Set;

import java.io.File;
import java.nio.FloatBuffer;
import java.nio.LongBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LLMEngine {
    private static final String TAG = "LLMEngine";
    private OrtEnvironment env;
    private OrtSession textEmbeddingSession; // For converting IDs to Embeddings (Vision Flow)
    private OrtSession embeddingSession; // Vision Encoder
    private OrtSession llmSession; // Main PHI-3 Model
    private SimpleTokenizer tokenizer;

    // Generation Parameters
    private static final int MAX_GEN_LEN = 1024;

    // Cached empty past_key_values for initialization
    private Map<String, OnnxTensor> initialPastKeyValues;
    private Map<String, OnnxTensor> conversationPastKeyValues = null; // Persisted between runInference calls
    private int conversationSeqLength = 0; // Track total tokens in history

    private volatile boolean isCancelled = false;

    public void cancelGeneration() {
        this.isCancelled = true;
    }

    public boolean isCancelled() {
        return this.isCancelled;
    }

    public LLMEngine() {
        this.env = OrtEnvironment.getEnvironment();
    }

    public void resetState() {
        Log.d(TAG, "Resetting LLM Context State.");
        if (conversationPastKeyValues != null) {
            for (OnnxTensor t : conversationPastKeyValues.values()) {
                if (initialPastKeyValues == null || !initialPastKeyValues.containsValue(t)) {
                    try {
                        t.close();
                    } catch (Exception e) {
                    }
                }
            }
            conversationPastKeyValues = null;
        }
        conversationSeqLength = 0;
    }

    private String currentModelType = "NONE"; // "TEXT" or "VISION"

    public void initialize(String embeddingModelPath, String llmModelPath) {
        // Legacy method, defaults to loading as TEXT
        loadModel(embeddingModelPath, llmModelPath, null, "TEXT");
    }

    private String systemPrompt = "";

    public void setSystemPrompt(String systemPrompt) {
        this.systemPrompt = systemPrompt;
    }

    public void loadTextModel(String embeddingPath, String llmPath) {
        if (!currentModelType.equals("TEXT")) {
            close(); // Close existing (Vision) session
            loadModel(embeddingPath, llmPath, null, "TEXT");
        }
    }

    // Updated for 3-part model (Vision Embed + Text Embed + LLM)
    public void loadVisionModel(String visionEmbedPath, String llmPath, String textEmbedPath) {
        if (!currentModelType.equals("VISION")) {
            close(); // Close existing session
            loadModel(visionEmbedPath, llmPath, textEmbedPath, "VISION");
        }
    }

    private void loadModel(String embeddingModelPath, String llmModelPath, String textEmbedPath, String type) {
        try {
            Log.d(TAG, "Initializing ONNX sessions for type: " + type);
            OrtSession.SessionOptions options = new OrtSession.SessionOptions();
            options.setIntraOpNumThreads(4);
            options.setExecutionMode(OrtSession.SessionOptions.ExecutionMode.SEQUENTIAL);

            // 1. Load Vision Embedding Model (Vision Encoder)
            if (embeddingModelPath != null) {
                Log.d(TAG, "Loading Vision Embed Model: " + embeddingModelPath);
                this.embeddingSession = env.createSession(embeddingModelPath, options);
            } else {
                this.embeddingSession = null;
            }

            // 2. Load Text Embedding Model (Optional, needed for Vision split)
            if (textEmbedPath != null) {
                Log.d(TAG, "Loading Text Embed Model: " + textEmbedPath);
                this.textEmbeddingSession = env.createSession(textEmbedPath, options);
            } else {
                this.textEmbeddingSession = null;
            }

            // 3. Load Main LLM Model
            Log.d(TAG, "Loading LLM Model: " + llmModelPath);
            this.llmSession = env.createSession(llmModelPath, options);

            // 4. Initialize Tokenizer
            String parentDir = new File(llmModelPath).getParent();
            this.tokenizer = new SimpleTokenizer(parentDir);

            // 5. Pre-compute initial past_key_values
            this.initialPastKeyValues = createInitialPastKeyValues(llmSession);

            this.currentModelType = type;
            Log.d(TAG, "Sessions initialized successfully for " + type);
        } catch (OrtException e) {
            Log.e(TAG, "Error creating ONNX session", e);
            currentModelType = "NONE";
        }
    }

    // ... createInitialPastKeyValues remains same ...

    private Map<String, OnnxTensor> createInitialPastKeyValues(OrtSession session) throws OrtException {
        Map<String, OnnxTensor> pastKeyValues = new HashMap<>();

        for (Map.Entry<String, NodeInfo> entry : session.getInputInfo().entrySet()) {
            String name = entry.getKey();
            if (name.contains("past_key_values")) {
                NodeInfo nodeInfo = entry.getValue();
                if (nodeInfo.getInfo() instanceof TensorInfo) {
                    TensorInfo tensorInfo = (TensorInfo) nodeInfo.getInfo();
                    long[] shape = tensorInfo.getShape();
                    long[] zeroShape = new long[shape.length];
                    for (int i = 0; i < shape.length; i++) {
                        if (i == 0) {
                            zeroShape[i] = (shape[i] == -1) ? 1 : shape[i];
                        } else if (i == 2) {
                            zeroShape[i] = 0;
                        } else {
                            zeroShape[i] = (shape[i] == -1) ? 1 : shape[i];
                        }
                    }
                    FloatBuffer emptyBuffer = FloatBuffer.allocate(0);
                    OnnxTensor tensor = OnnxTensor.createTensor(env, emptyBuffer, zeroShape);
                    pastKeyValues.put(name, tensor);
                }
            }
        }
        return pastKeyValues;
    }

    public String runVisionInference(String prompt, Bitmap image, TokenCallback callback) {
        if (llmSession == null || embeddingSession == null || tokenizer == null) {
            return "Error: Vision Engine not initialized.";
        }
        if (textEmbeddingSession == null) {
            // If we don't have text embedder, we can't build inputs_embeds
            return "Error: Text Embedding Model missing for Vision flow.";
        }

        try {
            Log.d(TAG, "Starting Vision Inference...");

            // 1. Preprocess Image -> Tensor
            FloatBuffer singleImageBuffer = ImageUtils.bitmapToFloatBuffer(image);
            int singleImageSize = singleImageBuffer.remaining();
            FloatBuffer doubleImageBuffer = FloatBuffer.allocate(singleImageSize * 2);
            doubleImageBuffer.put(singleImageBuffer);
            singleImageBuffer.rewind();
            doubleImageBuffer.put(singleImageBuffer);
            doubleImageBuffer.flip();

            long[] imageShape = new long[] { 1, 2, 3, 336, 336 };
            OnnxTensor imageTensor = OnnxTensor.createTensor(env, doubleImageBuffer, imageShape);

            // 2. Run Vision Embedding (Vision Encoder)
            Map<String, OnnxTensor> visionInputs = new HashMap<>();
            String pixelValuesName = "pixel_values";
            for (String name : embeddingSession.getInputNames()) {
                if (!name.equals("image_sizes")) {
                    pixelValuesName = name;
                    break;
                }
            }
            visionInputs.put(pixelValuesName, imageTensor);

            long[] originalSize = new long[] { 336, 336 };
            long[] sizeShape = new long[] { 1, 2 };
            java.nio.LongBuffer sizeBuffer = java.nio.LongBuffer.wrap(originalSize);
            OnnxTensor sizeTensor = OnnxTensor.createTensor(env, sizeBuffer, sizeShape);
            visionInputs.put("image_sizes", sizeTensor);

            OrtSession.Result embedResult = embeddingSession.run(visionInputs);
            OnnxTensor imageEmbeddings = (OnnxTensor) embedResult.get(0); // [1, 577, 3072]

            // 3. Construct Full Prompt IDs
            String fullPrompt = "<|user|>\n<|image_1|>\n" + prompt + "<|end|>\n<|assistant|>\n";
            long[] inputIds = tokenizer.encode(fullPrompt);

            // Store temporarily for injection
            this.pendingImageEmbeddings = imageEmbeddings;

            // DIRECTLY call inference
            return runInference(inputIds, callback);

        } catch (Exception e) {
            Log.e(TAG, "Vision Inference Failed", e);
            return "Error: " + e.getMessage();
        }
    }

    private OnnxTensor pendingImageEmbeddings = null;

    // Public entry point for Text Inference (handles tokenization and formatting)
    public String runInference(String prompt, TokenCallback callback) {
        return runInference(prompt, callback, true);
    }

    public String runInference(String prompt, TokenCallback callback, boolean saveState) {
        this.isCancelled = false;
        if (llmSession == null || tokenizer == null) {
            return "Error: Engines not initialized.";
        }

        try {
            Log.d(TAG, "Starting Inference [" + currentModelType + "]...");

            // ... (Standard tokenization logic same as before)
            boolean isFirstTurn = (conversationPastKeyValues == null || conversationPastKeyValues.isEmpty());
            long[] promptIds = tokenizer.encode(prompt);

            // Calculate required size
            long[] systemIds = null;
            int requiredSize = promptIds.length + 50; // Base overhead for tags

            if (isFirstTurn) {
                String sys = (this.systemPrompt != null && !this.systemPrompt.isEmpty()) ? this.systemPrompt
                        : "You are a helpful AI assistant.";
                systemIds = tokenizer.encode(sys);
                requiredSize += systemIds.length + 50; // System overhead
            }

            LongBuffer buffer = LongBuffer.allocate(requiredSize);

            if (isFirstTurn && systemIds != null) {
                buffer.put(1);
                buffer.put(32006);
                buffer.put(13);
                buffer.put(systemIds);
                buffer.put(32007);
                buffer.put(13);
            } else if (!isFirstTurn) {
                // Fix: The previous turn stopped at the EOS token and skipped feeding it into
                // the KV cache.
                // We must inject it here to structurally close the previous assistant's
                // response in history.
                buffer.put(32007);
                buffer.put(13);
            }
            buffer.put(32010);
            buffer.put(13);
            buffer.put(promptIds);
            buffer.put(32007);
            buffer.put(13);
            buffer.put(32001);
            buffer.put(13);

            buffer.flip();
            long[] inputIds = new long[buffer.limit()];
            buffer.get(inputIds);

            return runInferenceInternal(inputIds, callback, saveState);

        } catch (Exception e) {
            Log.e(TAG, "Inference Failed", e);
            return "Error: " + e.getMessage();
        }
    }

    public String runInference(long[] inputIds, TokenCallback callback) {
        this.isCancelled = false;
        if (llmSession == null || tokenizer == null)
            return "Error: Engines not initialized.";
        try {
            return runInferenceInternal(inputIds, callback, true);
        } catch (Exception e) {
            Log.e(TAG, "Inference Failed", e);
            return "Error: " + e.getMessage();
        }
    }

    private String runInferenceInternal(long[] inputIds, TokenCallback callback, boolean saveState) throws Exception {
        if (inputIds.length == 0)
            return "Error: Empty input IDs.";

        boolean isFirstTurn = (conversationPastKeyValues == null || conversationPastKeyValues.isEmpty());
        long[] currentInputIds = inputIds;
        Map<String, OnnxTensor> currentPastKeyValues = isFirstTurn ? new HashMap<>(initialPastKeyValues)
                : new HashMap<>(conversationPastKeyValues);
        int currentSeqLength = isFirstTurn ? 0 : conversationSeqLength;
        StringBuilder responseBuilder = new StringBuilder();
        StringBuilder pendingTokens = new StringBuilder();
        boolean isFirstRun = true;

        for (int i = 0; i < MAX_GEN_LEN; i++) {
            if (isCancelled) {
                Log.d(TAG, "Inference Cancelled by set flag.");
                break;
            }
            int inputLen = currentInputIds.length;
            int totalSeqLen = currentSeqLength + inputLen;

            long[] shape = new long[] { 1, inputLen };
            Map<String, OnnxTensor> llmInputs = new HashMap<>();
            OnnxTensor inputsEmbeds = null;

            // KEY LOGIC CHECK: Does model accept inputs_embeds ONLY?
            // If we have pendingImageEmbeddings (Vision Flow) OR textEmbeddingSession is
            // active, we might prefer embeddings
            boolean useEmbeddings = (textEmbeddingSession != null);

            if (useEmbeddings) {
                // 1. Convert Text IDs -> Text Embeddings
                OnnxTensor textIdsTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(currentInputIds), shape);
                OrtSession.Result textEmbedResult = textEmbeddingSession
                        .run(Collections.singletonMap("input_ids", textIdsTensor));
                OnnxTensor textEmbeddings = (OnnxTensor) textEmbedResult.get(0); // [1, len, 3072]
                float[][][] textEmbedData = (float[][][]) textEmbeddings.getValue();

                // 2. Merge with Image Embeddings (if present and <|image_1|> token found)
                // Simplified: If first run and we have image, we assume structure <|image_1|>
                // needs replacing
                // BUT currentInputIds might be complex.
                // For robustness: We will build final embedding buffer.

                // If just text generation (next token), it's simple passthrough.
                // If first run with image, we need splicing.

                FloatBuffer finalEmbedBuffer;
                long[] finalParams; // [1, finalLen, 3072]

                if (pendingImageEmbeddings != null && isFirstRun) {
                    // Check for <|image_1|> (32044) in currentInputIds
                    int imageTokenIdx = -1;
                    for (int k = 0; k < currentInputIds.length; k++) {
                        if (currentInputIds[k] == 32044) {
                            imageTokenIdx = k;
                            break;
                        }
                    }

                    if (imageTokenIdx != -1) {
                        // Splice: Text[0..idx] + Image + Text[idx+1..end]
                        float[][][] imgEmbedData = (float[][][]) pendingImageEmbeddings.getValue(); // [1, 577, 3072]
                        int imgLen = imgEmbedData[0].length;
                        int totalLen = inputLen - 1 + imgLen; // Remove 1 token, add 577

                        int hiddenSize = 3072;
                        finalEmbedBuffer = FloatBuffer.allocate(totalLen * hiddenSize);

                        // Part 1: Text before
                        for (int k = 0; k < imageTokenIdx; k++)
                            finalEmbedBuffer.put(textEmbedData[0][k]);

                        // Part 2: Image
                        for (int k = 0; k < imgLen; k++)
                            finalEmbedBuffer.put(imgEmbedData[0][k]);

                        // Part 3: Text after
                        for (int k = imageTokenIdx + 1; k < inputLen; k++)
                            finalEmbedBuffer.put(textEmbedData[0][k]);

                        finalParams = new long[] { 1, totalLen, hiddenSize };
                        finalEmbedBuffer.flip();

                        // Update Sequence Length tracking because we injected many tokens effectively
                        // Actually, model sees 577 tokens? Yes.
                        // So we must update totalSeqLen for mask!
                        // But 'inputLen' in loop logic is just count of passed tokens?
                        // We need to adjust mask size.

                        // Re-calculate mask
                        totalSeqLen = currentSeqLength + totalLen; // Update logic

                        pendingImageEmbeddings.close();
                        pendingImageEmbeddings = null;

                    } else {
                        // No image token found? Just use text (weird if pending exists)
                        finalEmbedBuffer = FloatBuffer.wrap(flatten(textEmbedData));
                        finalParams = new long[] { 1, inputLen, 3072 };
                    }
                } else {
                    // Standard Text Step
                    finalEmbedBuffer = FloatBuffer.wrap(flatten(textEmbedData));
                    finalParams = new long[] { 1, inputLen, 3072 };
                }

                textIdsTensor.close();
                textEmbeddings.close();
                textEmbedResult.close();

                // Create inputs_embeds tensor
                // Create inputs_embeds tensor
                inputsEmbeds = OnnxTensor.createTensor(env, finalEmbedBuffer, finalParams);
                llmInputs.put("inputs_embeds", inputsEmbeds); // Use correct name found earlier? "inputs_embeds" is
                                                              // standard.

                // We do NOT pass input_ids

                // Update Mask
                long[] maskData = new long[totalSeqLen];
                Arrays.fill(maskData, 1);
                long[] maskShape = new long[] { 1, totalSeqLen };
                OnnxTensor maskTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(maskData), maskShape);
                llmInputs.put("attention_mask", maskTensor);

                // Adjust currentSeqLength for next iter if we expanded
                // The loop adds 'inputLen' at end. We need to force it match valid expansion.
                // We can't change 'inputLen' var, but we update 'currentSeqLength' manualy?
                // No, at end of loop: currentSeqLength += inputLen;
                // If we embedded 577 tokens but inputLen was 10, we are off.
                // We must allow 'inputLen' to track actual embedded length.

                // Let's store actual length used
                inputLen = (int) finalParams[1];

            } else {
                // NORMAL TEXT MODE (No Text Embedder) -> Pass IDs
                OnnxTensor inputTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(currentInputIds), shape);
                // Input Name Resolution
                String inputName = "input_ids";
                for (String name : llmSession.getInputNames()) {
                    if (name.contains("input_ids"))
                        inputName = name;
                }
                llmInputs.put(inputName, inputTensor);

                long[] maskData = new long[totalSeqLen];
                Arrays.fill(maskData, 1);
                long[] maskShape = new long[] { 1, totalSeqLen };
                OnnxTensor maskTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(maskData), maskShape);
                llmInputs.put("attention_mask", maskTensor);
            }

            // 3. Position IDs (Optional)
            // ... Skip for brevity if not strictly needed or re-calc based on new length
            if (llmSession.getInputNames().contains("position_ids")) {
                // Recalculate positions based on potentially expanded length
                long[] posData = new long[inputLen]; // inputLen is updated above if needed
                for (int j = 0; j < inputLen; j++) {
                    posData[j] = currentSeqLength + j;
                }
                long[] posShape = new long[] { 1, inputLen };
                OnnxTensor posTensor = OnnxTensor.createTensor(env, LongBuffer.wrap(posData), posShape);
                llmInputs.put("position_ids", posTensor);
            }

            // 4. Past Key Values
            llmInputs.putAll(currentPastKeyValues);

            // Debug check counts
            // Log.d(TAG, "Inputs Count: " + llmInputs.size());

            // B. Run LLM
            OrtSession.Result llmResult = llmSession.run(llmInputs);

            // C. Update KV Cache
            Map<String, OnnxTensor> nextPastKeyValues = new HashMap<>();
            for (Map.Entry<String, OnnxValue> output : llmResult) {
                String outName = output.getKey();
                if (outName.contains("present")) {
                    String inName = outName.replace("present", "past_key_values");
                    if (initialPastKeyValues.containsKey(inName)) {
                        nextPastKeyValues.put(inName, (OnnxTensor) output.getValue());
                    }
                }
            }

            // Close OLD cache tensors
            if (!isFirstRun) {
                for (OnnxTensor t : currentPastKeyValues.values()) {
                    if (!initialPastKeyValues.containsValue(t)) {
                        t.close();
                    }
                }
            }

            // D. Process Logits
            OnnxTensor outputTensor = null;
            for (Map.Entry<String, OnnxValue> output : llmResult) {
                if (!output.getKey().contains("present")) {
                    outputTensor = (OnnxTensor) output.getValue();
                    break;
                }
            }

            float[][][] logits = (float[][][]) outputTensor.getValue();
            float[] lastTokenLogits = logits[0][logits[0].length - 1];
            int nextTokenId = argmax(lastTokenLogits);

            // Check EOS
            if (nextTokenId == 32000 || nextTokenId == 32007 || nextTokenId == 2 || nextTokenId == 30751
                    || nextTokenId == 32001 || nextTokenId == 32010 || nextTokenId == 32006) {
                Log.d(TAG, "EOS Token detected: " + nextTokenId);
                outputTensor.close();
                // Close inputs
                for (OnnxValue v : llmInputs.values())
                    ((OnnxTensor) v).close();

                currentPastKeyValues = nextPastKeyValues;
                currentSeqLength += inputLen;
                break;
            }

            String tokenStr = tokenizer.decodeLastToken(nextTokenId);
            Log.d(TAG, "Gen Token: [" + nextTokenId + "] -> '" + tokenStr + "'");

            // ... Anti Garbage Logic same ...
            pendingTokens.append(tokenStr);
            String pending = pendingTokens.toString();
            boolean exactMatch = pending.contains("<|end|>") || pending.contains("<|assistant|>")
                    || pending.contains("<|user|>");
            boolean partialMatch = "<|end|>".startsWith(pending) || "<|assistant|>".startsWith(pending)
                    || "<|user|>".startsWith(pending);

            if (exactMatch) {
                Log.d(TAG, "Stop Token Detected: " + pending);
                outputTensor.close();
                for (OnnxValue v : llmInputs.values())
                    ((OnnxTensor) v).close();
                currentPastKeyValues = nextPastKeyValues;
                currentSeqLength += inputLen;
                break;
            }

            if (!partialMatch) {
                boolean isPrefix = false;
                for (String stop : new String[] { "<|end|>", "<|assistant|>", "<|user|>" }) {
                    if (stop.startsWith(pending))
                        isPrefix = true;
                }
                if (!isPrefix) {
                    responseBuilder.append(pending);
                    if (callback != null)
                        callback.onToken(pending);
                    pendingTokens.setLength(0);
                }
            }

            // Setup Next Loop
            isFirstRun = false;
            currentInputIds = new long[] { nextTokenId };
            currentSeqLength += inputLen;
            currentPastKeyValues = nextPastKeyValues;

            outputTensor.close();
            for (Map.Entry<String, OnnxTensor> entry : llmInputs.entrySet()) {
                // Close inputs we created (mask, tensor etc)
                // DO NOT close KV cache as they are re-used/persisted or managed separately
                if (!entry.getKey().contains("past_key_values")) {
                    OnnxTensor v = entry.getValue();
                    if (v != inputsEmbeds) {
                        try {
                            v.close();
                        } catch (Exception e) {
                        }
                    }
                }
            }
            if (useEmbeddings && inputsEmbeds != null)
                inputsEmbeds.close();
        }

        if (saveState) {
            if (conversationPastKeyValues != null && conversationPastKeyValues != currentPastKeyValues) {
                for (OnnxTensor t : conversationPastKeyValues.values()) {
                    if (initialPastKeyValues == null || !initialPastKeyValues.containsValue(t)) {
                        try {
                            t.close();
                        } catch (Exception e) {
                        }
                    }
                }
            }
            conversationPastKeyValues = currentPastKeyValues;
            conversationSeqLength = currentSeqLength;
            Log.d(TAG, "Inference Complete. State Saved. SeqLen: " + conversationSeqLength);
        } else {
            // Close the ephemeral state we built up
            // currentPastKeyValues contains the latest tensors from the summary generation.
            // We must NOT return them to the caller or cache, assuming the loop closed
            // previous steps.
            // The only ones remaining are the final set in currentPastKeyValues.
            for (OnnxTensor t : currentPastKeyValues.values()) {
                if (!initialPastKeyValues.containsValue(t) &&
                        (conversationPastKeyValues == null || !conversationPastKeyValues.containsValue(t))) {
                    t.close();
                }
            }
            // Be careful not to close conversationPastKeyValues if we started from them!
            // Logic check:
            // If !saveState, we kept 'conversationPastKeyValues' (null or valid) intact.
            // 'currentPastKeyValues' was initialized as a COPY of the map.
            // Inside the loop: 'if (!isFirstRun) { ... close(currentPastKeyValues) }'
            // So if we ran at least 2 steps, the original conv tensors tracked by current
            // are closed?
            // WAIT.
            // Line 451: 'if (!isFirstRun) { ... t.close() }'
            // If we entered loop with 'currentPastKeyValues' pointing to
            // 'conversationPastKeyValues' tensors.
            // Loop 1 (isFirstRun=true): We generate Next. We do NOT close Current.
            // Loop 2 (isFirstRun=false): Current is now Next (from Loop 1). We close
            // Current (Loop 1 output).
            // So the original 'conversationPastKeyValues' referents are NEVER closed by the
            // loop.
            // So it is safe.

            Log.d(TAG, "Inference Complete. State Discarded.");
        }

        String finalResponse = responseBuilder.toString().trim();
        finalResponse = finalResponse.replaceAll("(?m)^[-=_]{3,}\\s*$", "");
        finalResponse = finalResponse.replaceAll("(?i)(User:|Assistant:|System:)\\s*$", "");
        return finalResponse.trim();
    }

    private float[] flatten(float[][][] data) {
        int d1 = data.length;
        int d2 = data[0].length;
        int d3 = data[0][0].length;
        float[] res = new float[d1 * d2 * d3];
        int idx = 0;
        for (int i = 0; i < d1; i++)
            for (int j = 0; j < d2; j++)
                for (int k = 0; k < d3; k++)
                    res[idx++] = data[i][j][k];
        return res;
    }

    public void close() {
        try {
            if (llmSession != null) {
                llmSession.close();
                llmSession = null;
            }
            if (embeddingSession != null) {
                embeddingSession.close();
                embeddingSession = null;
            }
            if (textEmbeddingSession != null) {
                textEmbeddingSession.close();
                textEmbeddingSession = null;
            }
            // env is shared/singleton often, but if we created it locally in constructor...
            // logic checks: static env vs instance. Constructor says:
            // OrtEnvironment.getEnvironment()
            // Usually we don't close environment unless app exit, but sessions yes.

            // CRITICAL: Clear cache when switching/closing models
            if (conversationPastKeyValues != null) {
                for (OnnxTensor t : conversationPastKeyValues.values()) {
                    if (initialPastKeyValues == null || !initialPastKeyValues.containsValue(t)) {
                        try {
                            t.close();
                        } catch (Exception e) {
                        }
                    }
                }
                conversationPastKeyValues = null;
            }
            conversationSeqLength = 0;

            Log.d(TAG, "Sessions closed and Cache cleared.");
        } catch (OrtException e) {
            Log.e(TAG, "Error closing sessions", e);
        }
    }

    private int argmax(float[] probabilities) {
        int maxIdx = 0;
        float maxVal = probabilities[0];
        for (int i = 1; i < probabilities.length; i++) {
            if (probabilities[i] > maxVal) {
                maxVal = probabilities[i];
                maxIdx = i;
            }
        }
        return maxIdx;
    }

    public interface TokenCallback {
        void onToken(String token);
    }
}
