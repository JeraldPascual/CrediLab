package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivityMainBinding;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.math.BigDecimal;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private ActivityMainBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;
    private WalletConnectHelper helper;
    private FirebaseAuth firebaseAuth;
    private FirestoreHelper firestoreHelper;
    private GoogleSignInClient googleSignInClient;

    // Wallet address from Firestore (single source of truth)
    private String firestoreWalletAddress;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "========== MainActivity onCreate START ==========");
        super.onCreate(savedInstanceState);

        try {
            Log.d(TAG, "Getting FirebaseAuth instance...");
            firebaseAuth = FirebaseAuth.getInstance();

            // Check auth — redirect to login if not signed in
            FirebaseUser currentUser = firebaseAuth.getCurrentUser();
            Log.d(TAG, "Current user: " + (currentUser != null ? currentUser.getEmail() : "null (not signed in)"));

            if (currentUser == null) {
                Log.d(TAG, "Not signed in — redirecting to LoginActivity");
                startActivity(new Intent(this, LoginActivity.class));
                finish();
                return;
            }

            Log.d(TAG, "User authenticated: " + currentUser.getUid());

            Log.d(TAG, "Inflating main layout...");
            binding = ActivityMainBinding.inflate(getLayoutInflater());
            setContentView(binding.getRoot());
            Log.d(TAG, "Main layout inflated successfully");

            Log.d(TAG, "Initializing WalletManager...");
            walletManager = WalletManager.getInstance(this);
            Log.d(TAG, "WalletManager initialized");

            Log.d(TAG, "Initializing Web3Helper...");
            web3Helper = new Web3Helper();
            Log.d(TAG, "Web3Helper initialized");

            Log.d(TAG, "Initializing WalletConnectHelper...");
            helper = new WalletConnectHelper(this);
            Log.d(TAG, "WalletConnectHelper initialized");

            Log.d(TAG, "Initializing FirestoreHelper...");
            firestoreHelper = new FirestoreHelper();
            Log.d(TAG, "FirestoreHelper initialized");

            // Set up Google Sign-In client for sign-out
            String webClientId = "940995805838-sgm85vgmibuspul03emh7f4iqr0bemkn.apps.googleusercontent.com";
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(webClientId)
                    .requestEmail()
                    .build();
            googleSignInClient = GoogleSignIn.getClient(this, gso);
            Log.d(TAG, "GoogleSignInClient initialized for sign-out");

            // Display user info
            Log.d(TAG, "Setting user email: " + currentUser.getEmail());
            binding.tvUserEmail.setText(currentUser.getEmail());

            binding.btnConnect.setOnClickListener(v -> {
                Log.d(TAG, "btnConnect clicked. isConnected: " + walletManager.isConnected());
                if (walletManager.isConnected()) {
                    disconnect();
                } else {
                    helper.connect(getSupportFragmentManager());
                }
            });

            binding.btnSend.setOnClickListener(v -> {
                Log.d(TAG, "btnSend clicked");
                startActivity(new Intent(this, SendActivity.class));
            });

            binding.btnReceive.setOnClickListener(v -> {
                Log.d(TAG, "btnReceive clicked");
                startActivity(new Intent(this, ReceiveActivity.class));
            });

            binding.btnEarn.setOnClickListener(v -> {
                Log.d(TAG, "btnEarn clicked");
                startActivity(new Intent(this, EarnActivity.class));
            });

            binding.btnRefresh.setOnClickListener(v -> {
                Log.d(TAG, "btnRefresh clicked");
                loadAllData();
            });

            binding.btnSignOut.setOnClickListener(v -> {
                Log.d(TAG, "btnSignOut clicked");
                signOut();
            });

            Log.d(TAG, "Calling updateUI...");
            updateUI(walletManager.isConnected());

            // Listen for WalletConnect session changes
            Log.d(TAG, "Setting up WalletConnect connection listener...");
            helper.setConnectionListener(isConnected -> {
                runOnUiThread(() -> {
                    Log.d(TAG, "WalletConnect connection state changed: " + isConnected);
                    if (isConnected) {
                        updateUI(true);
                        String address = helper.getSessionAddress();
                        Log.d(TAG, "WalletConnect session address: " + address);
                        if (address != null) {
                            binding.tvWalletAddress.setText(address);
                            fetchBalance(address);
                        }
                    } else {
                        updateUI(false);
                    }
                });
                return kotlin.Unit.INSTANCE;
            });

            // Load Firestore data + on-chain balance
            Log.d(TAG, "Loading all data...");
            loadAllData();

            Log.d(TAG, "========== MainActivity onCreate END ==========");
        } catch (Exception e) {
            Log.e(TAG, "FATAL: MainActivity onCreate crashed!", e);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume called");
        try {
            String address = walletManager.getWalletAddress();
            Log.d(TAG, "onResume - WalletManager address: " + address);

            if (address != null && !address.isEmpty()) {
                updateUI(true);
                binding.tvWalletAddress.setText(address);
                fetchBalance(address);
            } else if (walletManager.isConnected()) {
                updateUI(true);
                loadAllData();
            }
        } catch (Exception e) {
            Log.e(TAG, "onResume crashed!", e);
        }
    }

    /**
     * Load all data: Firestore user profile, credit pool, and on-chain balance.
     */
    private void loadAllData() {
        Log.d(TAG, "loadAllData called");
        FirebaseUser user = firebaseAuth.getCurrentUser();
        if (user == null) {
            Log.w(TAG, "loadAllData: No user signed in, skipping");
            return;
        }
        Log.d(TAG, "loadAllData: Loading data for UID: " + user.getUid());

        // Load user data from Firestore
        firestoreHelper.getUserData(user.getUid(), new FirestoreHelper.UserDataCallback() {
            @Override
            public void onSuccess(FirestoreHelper.UserData data) {
                Log.d(TAG, "Firestore user data loaded — wallet: " + data.walletAddress + ", credits: " + data.credits);
                runOnUiThread(() -> {
                    try {
                        // Display Firestore credits
                        binding.tvCredits.setText(String.valueOf(data.credits));
                        binding.tvCredits.setVisibility(View.VISIBLE);
                        binding.tvCreditsLabel.setVisibility(View.VISIBLE);

                        // Use Firestore wallet address for on-chain balance
                        if (data.walletAddress != null && !data.walletAddress.isEmpty()) {
                            firestoreWalletAddress = data.walletAddress;
                            Log.d(TAG, "Using Firestore wallet address: " + data.walletAddress);
                            binding.tvWalletAddress.setText(WalletManager.truncateAddress(data.walletAddress));
                            binding.tvWalletAddress.setVisibility(View.VISIBLE);
                            fetchBalance(data.walletAddress);
                        } else {
                            Log.w(TAG, "No wallet address found in Firestore for this user");
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error updating UI with Firestore data", e);
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Firestore getUserData FAILED", e);
                runOnUiThread(() -> {
                    binding.tvCredits.setText("--");
                });
            }
        });

        // Load credit pool
        Log.d(TAG, "Loading credit pool...");
        firestoreHelper.getCreditPool(new FirestoreHelper.CreditPoolCallback() {
            @Override
            public void onSuccess(FirestoreHelper.CreditPool pool) {
                Log.d(TAG, "Credit pool loaded — remaining: " + pool.remaining + ", total: " + pool.total);
                runOnUiThread(() -> {
                    try {
                        binding.tvPoolRemaining.setText(pool.remaining + " CLB remaining in pool");
                        binding.tvPoolRemaining.setVisibility(View.VISIBLE);
                    } catch (Exception e) {
                        Log.e(TAG, "Error updating credit pool UI", e);
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Firestore getCreditPool FAILED", e);
                runOnUiThread(() -> {
                    binding.tvPoolRemaining.setVisibility(View.GONE);
                });
            }
        });
    }

    private void openWalletConnect() {
        helper.connect(getSupportFragmentManager());
    }

    private void disconnect() {
        new AlertDialog.Builder(this)
                .setTitle("Disconnect Wallet")
                .setMessage("Are you sure you want to disconnect?")
                .setPositiveButton("Disconnect", (dialog, which) -> {
                    Log.d(TAG, "Disconnecting wallet...");
                    walletManager.disconnect();
                    walletManager.setWalletAddress("");
                    updateUI(false);
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void signOut() {
        new AlertDialog.Builder(this)
                .setTitle("Sign Out")
                .setMessage("Are you sure you want to sign out?")
                .setPositiveButton("Sign Out", (dialog, which) -> {
                    Log.d(TAG, "Signing out...");
                    firebaseAuth.signOut();
                    googleSignInClient.signOut().addOnCompleteListener(task -> {
                        Log.d(TAG, "Google sign-out complete. Navigating to LoginActivity.");
                        startActivity(new Intent(this, LoginActivity.class));
                        finish();
                    });
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void updateUI(boolean isConnected) {
        Log.d(TAG, "updateUI called with isConnected: " + isConnected);
        try {
            if (isConnected) {
                String address = walletManager.getWalletAddress();
                Log.d(TAG, "updateUI: Connected. Address: " + address);
                binding.btnConnect.setText(getString(R.string.disconnect_wallet));
                binding.btnConnect.setBackgroundTintList(
                        getResources().getColorStateList(R.color.error, getTheme()));
                binding.layoutActions.setVisibility(View.VISIBLE);
                binding.btnRefresh.setVisibility(View.VISIBLE);
                binding.tvWalletAddress.setVisibility(View.VISIBLE);
                binding.tvWalletAddress.setText(WalletManager.truncateAddress(address));
            } else {
                Log.d(TAG, "updateUI: Disconnected");
                binding.tvBalance.setText("--");
                binding.btnConnect.setText(getString(R.string.connect_wallet));
                binding.btnConnect.setBackgroundTintList(
                        getResources().getColorStateList(R.color.primary, getTheme()));
                binding.layoutActions.setVisibility(View.GONE);
                binding.btnRefresh.setVisibility(View.GONE);
                binding.tvWalletAddress.setVisibility(View.GONE);
                binding.tvWalletAddress.setText("");
            }
        } catch (Exception e) {
            Log.e(TAG, "updateUI crashed!", e);
        }
    }

    private void fetchBalance(String walletAddress) {
        if (walletAddress == null || walletAddress.isEmpty()) {
            Log.w(TAG, "fetchBalance: walletAddress is null/empty, skipping");
            return;
        }
        Log.d(TAG, "fetchBalance: Fetching for address: " + walletAddress);
        binding.tvBalance.setText("...");
        new Thread(() -> {
            try {
                BigDecimal balance = web3Helper.getCLBBalance(walletAddress);
                Log.d(TAG, "fetchBalance: Got balance: " + balance.toPlainString());
                runOnUiThread(() -> binding.tvBalance.setText(balance.stripTrailingZeros().toPlainString()));
            } catch (Exception e) {
                Log.e(TAG, "fetchBalance FAILED", e);
                runOnUiThread(() -> {
                    binding.tvBalance.setText("Error");
                    Toast.makeText(this, "Failed to fetch balance: " + e.getMessage(),
                            Toast.LENGTH_LONG).show();
                });
            }
        }).start();
    }

    @Override
    protected void onDestroy() {
        Log.d(TAG, "onDestroy called");
        super.onDestroy();
        web3Helper.shutdown();
    }

    // --- Gesture Detection ---
    private android.view.GestureDetector gestureDetector;

    @Override
    protected void onStart() {
        super.onStart();
        Log.d(TAG, "onStart called");
        gestureDetector = new android.view.GestureDetector(this, new SwipeListener());
    }

    @Override
    public boolean dispatchTouchEvent(android.view.MotionEvent ev) {
        if (gestureDetector != null) {
            gestureDetector.onTouchEvent(ev);
        }
        return super.dispatchTouchEvent(ev);
    }

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
                    return false;

                float diffX = e2.getX() - e1.getX();
                if (diffX < -SWIPE_THRESHOLD && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    Intent intent = new Intent(MainActivity.this, ChatActivity.class);
                    startActivity(intent);
                    overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left);
                    return true;
                }
            } catch (Exception exception) {
                Log.e(TAG, "Swipe gesture error", exception);
            }
            return false;
        }
    }
}
