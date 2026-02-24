package com.example.credilabmobile;

import android.os.Handler;
import android.os.Looper;

import androidx.annotation.NonNull;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CrediLabApiClient {

    private static final String BASE_URL = "https://credi-lab.vercel.app";
    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .writeTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .build();
    private static final Gson gson = new Gson();
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final Handler mainHandler = new Handler(Looper.getMainLooper());

    public interface ApiCallback {
        void onSuccess(String responseBody);

        void onFailure(int responseCode, String message);
    }

    /**
     * Endpoint 1: Quiz Rewards
     * POST /api/reward-student
     */
    public static void rewardStudent(String idToken, String challengeId, int rewardAmount, ApiCallback callback) {
        String url = BASE_URL + "/api/reward-student";

        JsonObject jsonBody = new JsonObject();
        jsonBody.addProperty("challengeId", challengeId);
        jsonBody.addProperty("rewardAmount", rewardAmount);

        RequestBody body = RequestBody.create(jsonBody.toString(), JSON);

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + idToken)
                .post(body)
                .build();

        executeRequest(request, callback);
    }

    /**
     * Endpoint 2: Cash Out / Claim Pending Credits
     * POST /api/claim-tokens
     */
    public static void claimTokens(String idToken, int amount, ApiCallback callback) {
        String url = BASE_URL + "/api/claim-tokens";

        JsonObject jsonBody = new JsonObject();
        jsonBody.addProperty("amount", amount);

        RequestBody body = RequestBody.create(jsonBody.toString(), JSON);

        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + idToken)
                .post(body)
                .build();

        executeRequest(request, callback);
    }

    private static void executeRequest(Request request, ApiCallback callback) {
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(@NonNull Call call, @NonNull IOException e) {
                mainHandler.post(() -> {
                    if (callback != null) {
                        callback.onFailure(0, "Network error: " + e.getMessage());
                    }
                });
            }

            @Override
            public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                final int code = response.code();
                final String responseBody = response.body() != null ? response.body().string() : "";

                mainHandler.post(() -> {
                    if (callback != null) {
                        if (response.isSuccessful()) {
                            callback.onSuccess(responseBody);
                        } else {
                            callback.onFailure(code, responseBody);
                        }
                    }
                });
            }
        });
    }
}
