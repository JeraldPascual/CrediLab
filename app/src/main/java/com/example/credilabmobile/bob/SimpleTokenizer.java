package com.example.credilabmobile.bob;

import android.util.Log;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SimpleTokenizer {
    private static final String TAG = "SimpleTokenizer";
    private Map<String, Integer> vocab;
    private Map<Integer, String> idToVocab;
    private int unkTokenId = 0;
    private int bosTokenId = 1;
    private int eosTokenId = 2;

    // SentencePiece uses a special underscore for spaces: \u2581
    private static final String SPACE_CHAR = "\u2581";
    // Phi-3 / Llama-3 sometimes uses \u0120 (Ġ) for space in byte-level BPE
    private static final String BPE_SPACE_CHAR = "\u0120";

    public SimpleTokenizer(String modelDir) {
        vocab = new HashMap<>();
        idToVocab = new HashMap<>();
        loadTokenizerJson(new File(modelDir, "tokenizer.json"));
    }

    private void loadTokenizerJson(File file) {
        try {
            Log.d(TAG, "Loading tokenizer from: " + file.getAbsolutePath());
            FileInputStream is = new FileInputStream(file);
            byte[] size = new byte[is.available()];
            is.read(size);
            is.close();
            String jsonString = new String(size, StandardCharsets.UTF_8);
            JSONObject json = new JSONObject(jsonString);

            // Parse 'model' -> 'vocab'
            JSONObject modelObj = json.optJSONObject("model");
            if (modelObj != null) {
                JSONObject vocabObj = modelObj.optJSONObject("vocab");
                if (vocabObj != null) {
                    JSONArray names = vocabObj.names();
                    if (names != null) {
                        for (int i = 0; i < names.length(); i++) {
                            String token = names.getString(i);
                            int id = vocabObj.getInt(token);
                            vocab.put(token, id);
                            idToVocab.put(id, token);
                        }
                    }
                }
            } else {
                Log.e(TAG, "Could not find 'model' object in tokenizer.json");
            }

            // Ensure special tokens exist (Add if missing)
            addSpecialToken("<|endoftext|>", 32000);
            addSpecialToken("<|assistant|>", 32001);
            addSpecialToken("<|system|>", 32006);
            addSpecialToken("<|end|>", 32007);
            addSpecialToken("<|user|>", 32010);
            addSpecialToken("<|image_1|>", 32044); // CRITICAL for Vision

            Log.d(TAG, "Loaded vocab size: " + vocab.size());

            // Try to find special token IDs
            if (vocab.containsKey("<|endoftext|>"))
                eosTokenId = vocab.get("<|endoftext|>");
            if (vocab.containsKey("<s>"))
                bosTokenId = vocab.get("<s>");
            if (vocab.containsKey("<unk>"))
                unkTokenId = vocab.get("<unk>");

        } catch (Exception e) {
            Log.e(TAG, "Failed to load tokenizer.json", e);
        }
    }

    private void addSpecialToken(String token, int id) {
        if (!vocab.containsKey(token)) {
            Log.w(TAG, "Adding missing special token: " + token + " -> " + id);
            vocab.put(token, id);
            idToVocab.put(id, token);
        }
    }

    public long[] encode(String text) {
        if (vocab.isEmpty())
            return new long[0];

        List<Integer> tokens = new ArrayList<>();

        // Regex to find special tokens or delimiters
        // Capture group 1 is the delimiter we want to preserve or handle
        Pattern pattern = Pattern.compile("(<\\|user\\|>|<\\|assistant\\|>|<\\|end\\|>|<\\|image_1\\|>|\\n|\\s+)");
        Matcher matcher = pattern.matcher(text);

        int lastEnd = 0;
        while (matcher.find()) {
            int start = matcher.start();
            int end = matcher.end();

            // 1. Process the segment BEFORE the match (the "word" or content)
            if (start > lastEnd) {
                String segment = text.substring(lastEnd, start);
                tokenizeSegment(tokens, segment);
            }

            // 2. Process the delimiter (the match)
            String delimiter = matcher.group();
            tokenizeDelimiter(tokens, delimiter);

            lastEnd = end;
        }

        // Process remaining text
        if (lastEnd < text.length()) {
            String segment = text.substring(lastEnd);
            tokenizeSegment(tokens, segment);
        }

        long[] result = new long[tokens.size()];
        for (int i = 0; i < tokens.size(); i++) {
            result[i] = tokens.get(i);
        }
        return result;
    }

    private void tokenizeDelimiter(List<Integer> tokens, String delimiter) {
        if (vocab.containsKey(delimiter)) {
            tokens.add(vocab.get(delimiter));
        } else if (delimiter.matches("\\s+")) {
            // Handle spaces/newlines
            if (delimiter.contains("\n")) {
                if (vocab.containsKey("<0x0A>")) {
                    tokens.add(vocab.get("<0x0A>"));
                } else if (vocab.containsKey("\n")) {
                    tokens.add(vocab.get("\n"));
                }
            }
            // Plain spaces are usually skipped here because they are implied
            // by the "Space + Word" lookup in tokenizeSegment for the NEXT word.
        } else {
            tokenizeSubwords(tokens, delimiter);
        }
    }

    private void tokenizeSegment(List<Integer> tokens, String segment) {
        // Try to match with leading space (SentencePiece style)
        String wordWithSpace = SPACE_CHAR + segment;

        // Priority:
        // 1. Exact match with space (most common for words in middle of sentence)
        // 2. Exact match without space
        // 3. Subwords

        if (vocab.containsKey(wordWithSpace)) {
            tokens.add(vocab.get(wordWithSpace));
        } else if (vocab.containsKey(segment)) {
            tokens.add(vocab.get(segment));
        } else {
            tokenizeSubwords(tokens, wordWithSpace);
        }
    }

    private void tokenizeSubwords(List<Integer> tokens, String text) {
        // Greedy longest-match
        int start = 0;
        while (start < text.length()) {
            boolean found = false;
            // Try to find longest substring starting at 'start' that is in vocab
            for (int end = text.length(); end > start; end--) {
                String sub = text.substring(start, end);
                if (vocab.containsKey(sub)) {
                    tokens.add(vocab.get(sub));
                    start = end;
                    found = true;
                    break;
                }
            }
            if (!found) {
                // If absolutely no match found (even single char), use UNK or skip
                // Ideally single bytes should exist in vocab
                tokens.add(unkTokenId);
                start++;
            }
        }
    }

    public String decode(long[] ids) {
        StringBuilder sb = new StringBuilder();
        for (long id : ids) {
            String token = idToVocab.get((int) id);
            if (token != null) {
                sb.append(token);
            }
        }
        String decoded = sb.toString();
        // Replace special chars
        decoded = decoded.replace(SPACE_CHAR, " ");
        decoded = decoded.replace(BPE_SPACE_CHAR, " ");
        decoded = decoded.replace("<|endoftext|>", "");
        decoded = decoded.replace("<s>", "");
        return decoded.trim();
    }

    public String decodeLastToken(long id) {
        String token = idToVocab.get((int) id);
        if (token == null)
            return "";
        return token.replace(SPACE_CHAR, " ")
                .replace(BPE_SPACE_CHAR, " ")
                .replace("<0x0A>", "\n");
    }
}
