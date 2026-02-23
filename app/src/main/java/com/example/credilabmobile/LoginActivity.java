package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivityLoginBinding;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;

public class LoginActivity extends AppCompatActivity {
    private static final String TAG = "LoginActivity";

    private ActivityLoginBinding binding;
    private FirebaseAuth firebaseAuth;
    private GoogleSignInClient googleSignInClient;

    private final ActivityResultLauncher<Intent> signInLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                Log.d(TAG, "Sign-in result received. ResultCode: " + result.getResultCode());
                Log.d(TAG, "Result data: " + (result.getData() != null ? "present" : "null"));
                Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(result.getData());
                try {
                    GoogleSignInAccount account = task.getResult(ApiException.class);
                    Log.d(TAG, "Google sign-in succeeded! Email: " + account.getEmail());
                    Log.d(TAG, "ID Token present: " + (account.getIdToken() != null));
                    firebaseAuthWithGoogle(account.getIdToken());
                } catch (ApiException e) {
                    Log.e(TAG, "Google sign-in failed: statusCode=" + e.getStatusCode() + " message=" + e.getMessage(),
                            e);
                    showError("Google sign-in failed (" + e.getStatusCode() + ")");
                    setLoading(false);
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "========== LoginActivity onCreate START ==========");
        super.onCreate(savedInstanceState);

        try {
            Log.d(TAG, "Getting FirebaseAuth instance...");
            firebaseAuth = FirebaseAuth.getInstance();
            Log.d(TAG, "FirebaseAuth instance obtained successfully");

            // Auto-skip if already signed in
            FirebaseUser currentUser = firebaseAuth.getCurrentUser();
            Log.d(TAG, "Current user: " + (currentUser != null ? currentUser.getEmail() : "null (not signed in)"));

            if (currentUser != null) {
                Log.d(TAG, "Already signed in — skipping to MainActivity");
                goToMain();
                return;
            }

            Log.d(TAG, "Inflating login layout...");
            binding = ActivityLoginBinding.inflate(getLayoutInflater());
            setContentView(binding.getRoot());
            Log.d(TAG, "Login layout inflated successfully");

            // Get the web client ID from google-services.json oauth_client with client_type
            // 3
            String webClientId = "940995805838-sgm85vgmibuspul03emh7f4iqr0bemkn.apps.googleusercontent.com";
            Log.d(TAG, "Web client ID: " + webClientId);

            Log.d(TAG, "Building GoogleSignInOptions...");
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(webClientId)
                    .requestEmail()
                    .build();
            Log.d(TAG, "GoogleSignInOptions built successfully");

            Log.d(TAG, "Getting GoogleSignInClient...");
            googleSignInClient = GoogleSignIn.getClient(this, gso);
            Log.d(TAG, "GoogleSignInClient obtained successfully");

            binding.btnGoogleSignIn.setOnClickListener(v -> {
                Log.d(TAG, "Sign-in button clicked!");
                setLoading(true);
                Intent signInIntent = googleSignInClient.getSignInIntent();
                Log.d(TAG, "Launching sign-in intent...");
                signInLauncher.launch(signInIntent);
            });

            Log.d(TAG, "========== LoginActivity onCreate END (showing login screen) ==========");
        } catch (Exception e) {
            Log.e(TAG, "FATAL: LoginActivity onCreate crashed!", e);
        }
    }

    private void firebaseAuthWithGoogle(String idToken) {
        Log.d(TAG, "firebaseAuthWithGoogle called. Token: "
                + (idToken != null ? idToken.substring(0, 20) + "..." : "NULL!"));
        AuthCredential credential = GoogleAuthProvider.getCredential(idToken, null);
        firebaseAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, task -> {
                    if (task.isSuccessful()) {
                        FirebaseUser user = firebaseAuth.getCurrentUser();
                        Log.d(TAG, "Firebase auth succeeded! UID: " + (user != null ? user.getUid() : "null"));
                        Log.d(TAG, "Firebase auth email: " + (user != null ? user.getEmail() : "null"));
                        goToMain();
                    } else {
                        Log.e(TAG, "Firebase auth FAILED", task.getException());
                        showError("Authentication failed: "
                                + (task.getException() != null ? task.getException().getMessage() : "unknown error"));
                        setLoading(false);
                    }
                });
    }

    private void goToMain() {
        Log.d(TAG, "Navigating to MainActivity...");
        startActivity(new Intent(this, MainActivity.class));
        finish();
    }

    private void setLoading(boolean loading) {
        Log.d(TAG, "setLoading: " + loading);
        binding.btnGoogleSignIn.setEnabled(!loading);
        binding.progressLoading.setVisibility(loading ? View.VISIBLE : View.GONE);
        if (loading) {
            binding.tvStatus.setVisibility(View.GONE);
        }
    }

    private void showError(String message) {
        Log.e(TAG, "showError: " + message);
        binding.tvStatus.setText(message);
        binding.tvStatus.setVisibility(View.VISIBLE);
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }
}
