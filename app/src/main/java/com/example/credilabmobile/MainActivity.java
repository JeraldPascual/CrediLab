package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.example.credilabmobile.data.AchievementData;
import com.example.credilabmobile.databinding.ActivityMainBinding;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.math.BigDecimal;

import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;
import java.io.File;
import java.io.IOException;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;

public class MainActivity extends AppCompatActivity {
    private static final String TAG = "MainActivity";
    private ActivityMainBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;
    private WalletConnectHelper helper;
    private FirebaseAuth firebaseAuth;
    private FirestoreHelper firestoreHelper;
    private GoogleSignInClient googleSignInClient;
    private StorageHelper storageHelper;

    // Wallet address from Firestore (single source of truth)
    private String firestoreWalletAddress;
    private FirestoreHelper.UserData currentUserData = null;

    // Image Upload State
    private Uri currentPhotoUri; // The URI of the picked/captured photo
    private Uri tempCameraUri; // Temporary URI for camera capture
    private ImageView dialogPreviewImageView; // Reference to the ImageView inside the dialog

    private final ActivityResultLauncher<Intent> takePictureLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    currentPhotoUri = tempCameraUri;
                    if (dialogPreviewImageView != null) {
                        Glide.with(this).load(currentPhotoUri).transform(new CircleCrop()).into(dialogPreviewImageView);
                    }
                }
            });

    private final ActivityResultLauncher<String> pickGalleryLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    currentPhotoUri = uri;
                    if (dialogPreviewImageView != null) {
                        Glide.with(this).load(currentPhotoUri).transform(new CircleCrop()).into(dialogPreviewImageView);
                    }
                }
            });

    private ConnectivityManager.NetworkCallback networkCallback;

    private void setupNetworkListener() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
        if (cm == null)
            return;

        // Check initial state
        boolean isConnected = false;
        Network activeNetwork = cm.getActiveNetwork();
        if (activeNetwork != null) {
            NetworkCapabilities caps = cm.getNetworkCapabilities(activeNetwork);
            isConnected = caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        }

        if (!isConnected && binding.offlineOverlay != null) {
            binding.offlineOverlay.setVisibility(View.VISIBLE);
        }

        NetworkRequest request = new NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .build();

        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(Network network) {
                runOnUiThread(() -> {
                    if (binding.offlineOverlay != null) {
                        if (binding.offlineOverlay.getVisibility() == View.VISIBLE) {
                            loadAllData(); // Refresh data if we just came back online
                        }
                        binding.offlineOverlay.setVisibility(View.GONE);
                    }
                });
            }

            @Override
            public void onLost(Network network) {
                runOnUiThread(() -> {
                    if (binding.offlineOverlay != null) {
                        binding.offlineOverlay.setVisibility(View.VISIBLE);
                    }
                });
            }
        };

        cm.registerNetworkCallback(request, networkCallback);
    }

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

            setupNetworkListener();

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

            Log.d(TAG, "Initializing StorageHelper...");
            storageHelper = new StorageHelper();
            Log.d(TAG, "StorageHelper initialized");

            // Set up Google Sign-In client for sign-out
            String webClientId = "940995805838-sgm85vgmibuspul03emh7f4iqr0bemkn.apps.googleusercontent.com";
            GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                    .requestIdToken(webClientId)
                    .requestEmail()
                    .build();
            googleSignInClient = GoogleSignIn.getClient(this, gso);
            Log.d(TAG, "GoogleSignInClient initialized for sign-out");

            // Open Account Details Dialog
            binding.btnAccountDetails.setOnClickListener(v -> {
                Log.d(TAG, "btnAccountDetails clicked");
                showAccountDetailsDialog();
            });

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

            binding.btnLeaderboard.setOnClickListener(v -> {
                Log.d(TAG, "btnLeaderboard clicked");
                startActivity(new Intent(this, LeaderboardActivity.class));
            });

            binding.btnWeeklyTasks.setOnClickListener(v -> {
                Log.d(TAG, "btnWeeklyTasks clicked");
                startActivity(new Intent(this, WeeklyTasksActivity.class));
            });

            binding.btnHowToUse.setOnClickListener(v -> {
                Log.d(TAG, "btnHowToUse clicked");
                startActivity(new Intent(this, HowToUseActivity.class));
            });

            binding.btnAbout.setOnClickListener(v -> {
                Log.d(TAG, "btnAbout clicked");
                startActivity(new Intent(this, AboutActivity.class));
            });

            binding.btnRefresh.setOnClickListener(v -> {
                Log.d(TAG, "btnRefresh clicked");
                loadAllData();
            });

            binding.btnClaimTokens.setOnClickListener(v -> {
                Log.d(TAG, "btnClaimTokens clicked");
                showClaimDialog();
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

                        // First try helper, then fallback to walletManager which might hold the delayed
                        // address
                        String address = helper.getSessionAddress();
                        if (address == null || address.isEmpty()) {
                            address = walletManager.getWalletAddress();
                        }

                        Log.d(TAG, "WalletConnect session address: " + address);
                        if (address != null && !address.isEmpty()) {
                            binding.tvWalletAddress.setText(address);
                            fetchBalance(address);

                            FirebaseUser fbUser = firebaseAuth.getCurrentUser();
                            if (fbUser != null) {
                                firestoreHelper.updateWalletAddress(fbUser.getUid(), address, null, null);
                            }
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
                currentUserData = data;
                runOnUiThread(() -> {
                    try {
                        // Display Firestore credits
                        binding.tvCredits.setText(String.valueOf(data.credits));
                        binding.tvCredits.setVisibility(View.VISIBLE);
                        binding.tvCreditsLabel.setVisibility(View.VISIBLE);
                        binding.btnClaimTokens.setVisibility(data.credits > 0 ? View.VISIBLE : View.GONE);

                        // --- Profile section ---
                        // Display name
                        String displayName = data.getBestName();
                        binding.tvDisplayName.setText(displayName);

                        // Profile photo (from Google's photoURL)
                        String photoURL = data.photoURL;
                        if (photoURL == null || photoURL.isEmpty()) {
                            // Fall back to Firebase Auth photoURL
                            FirebaseUser fbUser = firebaseAuth.getCurrentUser();
                            if (fbUser != null && fbUser.getPhotoUrl() != null) {
                                photoURL = fbUser.getPhotoUrl().toString();
                            }
                        }
                        if (photoURL != null && !photoURL.isEmpty()) {
                            Glide.with(MainActivity.this)
                                    .load(photoURL)
                                    .transform(new CircleCrop())
                                    .placeholder(R.drawable.ic_launcher_foreground)
                                    .into(binding.ivProfilePhoto);
                        } else {
                            // Use default placeholder if no photo
                            Glide.with(MainActivity.this)
                                    .load(R.drawable.ic_launcher_foreground)
                                    .transform(new CircleCrop())
                                    .into(binding.ivProfilePhoto);
                        }

                        // Skill tier
                        long totalEarned = data.totalCLBEarned > 0 ? data.totalCLBEarned : data.credits;
                        AchievementData.SkillTier tier = AchievementData.getSkillTier(totalEarned);
                        binding.tvTierIcon.setText(tier.icon);
                        binding.tvTierTitle.setText(tier.title);

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
                        binding.cvPoolRemaining.setVisibility(View.VISIBLE);
                    } catch (Exception e) {
                        Log.e(TAG, "Error updating credit pool UI", e);
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Firestore getCreditPool FAILED", e);
                runOnUiThread(() -> {
                    binding.cvPoolRemaining.setVisibility(View.GONE);
                });
            }
        });
    }

    private void showMessageDialog(String title, String message) {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        android.widget.TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        android.widget.TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);

        tvTitle.setText(title);
        tvMessage.setText(message);
        btnConfirm.setText("OK");

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> dialog.dismiss());
        dialog.show();
    }

    private void showClaimDialog() {
        if (currentUserData == null || currentUserData.credits <= 0) {
            showMessageDialog("Error", "No credits available to claim.");
            return;
        }

        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        android.widget.TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        android.widget.TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Claim Tokens");
        tvMessage.setText("Enter amount to claim (max " + currentUserData.credits + ", up to 500 CLB):");
        btnConfirm.setText("Claim");
        btnCancel.setVisibility(View.VISIBLE);

        final android.widget.EditText input = new android.widget.EditText(this);
        input.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        input.setTextColor(ContextCompat.getColor(this, R.color.text_primary));
        input.setHintTextColor(ContextCompat.getColor(this, R.color.text_secondary));
        input.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(ContextCompat.getColor(this, R.color.primary)));

        android.widget.FrameLayout container = new android.widget.FrameLayout(this);
        android.widget.FrameLayout.LayoutParams params = new android.widget.FrameLayout.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        params.leftMargin = 50;
        params.rightMargin = 50;
        input.setLayoutParams(params);
        container.addView(input);

        // Add the EditText to the custom layout (between message and buttons)
        android.widget.LinearLayout rootLayout = (android.widget.LinearLayout) customView;
        rootLayout.addView(container, 2);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> {
            String amountStr = input.getText().toString();
            if (amountStr.isEmpty())
                return;
            try {
                int amount = Integer.parseInt(amountStr);
                if (amount <= 0) {
                    showMessageDialog("Invalid Amount", "Please enter an amount greater than 0.");
                    return;
                }
                if (amount > currentUserData.credits) {
                    showMessageDialog("Invalid Amount",
                            "You only have " + currentUserData.credits + " pending credits.");
                    return;
                }
                if (amount > 500) {
                    showMessageDialog("Limit Exceeded", "You can only claim up to 500 CLB per request.");
                    return;
                }
                dialog.dismiss();
                executeClaim(amount);
            } catch (NumberFormatException e) {
                showMessageDialog("Invalid Amount", "Please enter a valid number.");
            }
        });

        btnCancel.setOnClickListener(v -> dialog.cancel());
        dialog.show();
    }

    private void executeClaim(int amount) {
        FirebaseUser user = firebaseAuth.getCurrentUser();
        if (user == null)
            return;

        View loadingView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        android.widget.TextView tvTitle = loadingView.findViewById(R.id.tvDialogTitle);
        android.widget.TextView tvMessage = loadingView.findViewById(R.id.tvDialogMessage);
        loadingView.findViewById(R.id.btnConfirm).setVisibility(View.GONE);

        tvTitle.setText("Claiming tokens...");
        tvMessage.setText("Please wait while the transaction is processed on the blockchain.");

        AlertDialog loadingDialog = new AlertDialog.Builder(this)
                .setView(loadingView)
                .setCancelable(false)
                .create();

        if (loadingDialog.getWindow() != null) {
            loadingDialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }
        loadingDialog.show();

        user.getIdToken(false).addOnSuccessListener(result -> {
            String idToken = result.getToken();
            CrediLabApiClient.claimTokens(idToken, amount, new CrediLabApiClient.ApiCallback() {
                @Override
                public void onSuccess(String responseBody) {
                    runOnUiThread(() -> {
                        if (loadingDialog.isShowing())
                            loadingDialog.dismiss();
                        showMessageDialog("Success", "Tokens claimed successfully!");
                        loadAllData(); // Refresh UI to show decremented credits & incremented wallet
                    });
                }

                @Override
                public void onFailure(int responseCode, String message) {
                    runOnUiThread(() -> {
                        if (loadingDialog.isShowing())
                            loadingDialog.dismiss();
                        showMessageDialog("Claim Failed", "Error processing claim:\n" + message);
                    });
                }
            });
        }).addOnFailureListener(e -> {
            if (loadingDialog.isShowing())
                loadingDialog.dismiss();
            showMessageDialog("Authentication Error", "Failed to retrieve Firebase ID token.");
        });
    }

    private void showAccountDetailsDialog() {
        android.view.View dialogView = getLayoutInflater().inflate(R.layout.dialog_account_details, null);
        TextView tvEmail = dialogView.findViewById(R.id.tvDialogEmail);
        TextView tvWallet = dialogView.findViewById(R.id.tvDialogWallet);
        ImageView btnCopy = dialogView.findViewById(R.id.btnCopyWallet);
        com.google.android.material.button.MaterialButton btnEditProfile = dialogView
                .findViewById(R.id.btnDialogEditProfile);
        com.google.android.material.button.MaterialButton btnSignOut = dialogView.findViewById(R.id.btnDialogSignOut);
        com.google.android.material.button.MaterialButton btnClose = dialogView.findViewById(R.id.btnDialogClose);
        ImageView ivProfile = dialogView.findViewById(R.id.ivDialogProfilePhoto);
        TextView tvDisplayName = dialogView.findViewById(R.id.tvDialogDisplayName);

        FirebaseUser user = firebaseAuth.getCurrentUser();
        tvEmail.setText(user != null ? user.getEmail() : "No email");
        tvWallet.setText(firestoreWalletAddress != null && !firestoreWalletAddress.isEmpty() ? firestoreWalletAddress
                : "Not connected");

        if (currentUserData != null) {
            tvDisplayName.setText(currentUserData.getBestName());
            String photoURL = currentUserData.photoURL;
            if (photoURL == null || photoURL.isEmpty()) {
                if (user != null && user.getPhotoUrl() != null) {
                    photoURL = user.getPhotoUrl().toString();
                }
            }
            if (photoURL != null && !photoURL.isEmpty()) {
                Glide.with(this)
                        .load(photoURL)
                        .transform(new CircleCrop())
                        .placeholder(R.drawable.ic_launcher_foreground)
                        .into(ivProfile);
            } else {
                Glide.with(this)
                        .load(R.drawable.ic_launcher_foreground)
                        .transform(new CircleCrop())
                        .into(ivProfile);
            }
        }

        androidx.appcompat.app.AlertDialog dialog = new androidx.appcompat.app.AlertDialog.Builder(this)
                .setView(dialogView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnCopy.setOnClickListener(v -> {
            if (firestoreWalletAddress != null && !firestoreWalletAddress.isEmpty()) {
                android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(
                        android.content.Context.CLIPBOARD_SERVICE);
                android.content.ClipData clip = android.content.ClipData.newPlainText("Wallet Address",
                        firestoreWalletAddress);
                clipboard.setPrimaryClip(clip);
                android.widget.Toast.makeText(MainActivity.this, "Address copied!", android.widget.Toast.LENGTH_SHORT)
                        .show();
            }
        });

        btnEditProfile.setOnClickListener(v -> {
            dialog.dismiss();
            showEditProfileDialog();
        });

        btnSignOut.setOnClickListener(v -> {
            dialog.dismiss();
            signOut();
        });

        btnClose.setOnClickListener(v -> dialog.dismiss());

        dialog.show();
    }

    private void showEditProfileDialog() {
        if (currentUserData == null) {
            Toast.makeText(this, "Still loading user data...", Toast.LENGTH_SHORT).show();
            return;
        }

        View dialogView = getLayoutInflater().inflate(R.layout.dialog_edit_profile, null);
        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(dialogView)
                .create();

        // Use transparent background so we see rounded corners of bg_dialog_rounded
        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }

        com.google.android.material.textfield.TextInputEditText etNickname = dialogView.findViewById(R.id.etNickname);
        dialogPreviewImageView = dialogView.findViewById(R.id.ivEditProfilePreview);
        View btnTakePhoto = dialogView.findViewById(R.id.btnTakePhoto);
        View btnChooseGallery = dialogView.findViewById(R.id.btnChooseGallery);
        View progressEditProfile = dialogView.findViewById(R.id.progressEditProfile);
        View btnSaveEdit = dialogView.findViewById(R.id.btnSaveEdit);
        View btnCancelEdit = dialogView.findViewById(R.id.btnCancelEdit);

        etNickname.setText(currentUserData.getBestName());
        currentPhotoUri = null; // Reset current on open

        if (currentUserData.photoURL != null && !currentUserData.photoURL.isEmpty()) {
            Glide.with(this)
                    .load(currentUserData.photoURL)
                    .transform(new CircleCrop())
                    .placeholder(R.drawable.ic_launcher_foreground)
                    .into(dialogPreviewImageView);
        }

        btnTakePhoto.setOnClickListener(v -> {
            try {
                File photoFile = File.createTempFile("profile_", ".jpg", new File(getCacheDir(), "camera_photos"));
                if (!photoFile.getParentFile().exists()) {
                    photoFile.getParentFile().mkdirs();
                }
                tempCameraUri = FileProvider.getUriForFile(this, getPackageName() + ".provider", photoFile);

                Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, tempCameraUri);
                takePictureLauncher.launch(takePictureIntent);
            } catch (IOException ex) {
                Log.e(TAG, "Error creating camera file", ex);
                Toast.makeText(this, "Failed to prep camera", Toast.LENGTH_SHORT).show();
            }
        });

        btnChooseGallery.setOnClickListener(v -> {
            pickGalleryLauncher.launch("image/*");
        });

        dialogView.findViewById(R.id.btnCancelEdit).setOnClickListener(v -> dialog.dismiss());
        btnSaveEdit.setOnClickListener(v -> {
            String newNickname = etNickname.getText() != null ? etNickname.getText().toString().trim() : "";

            if (newNickname.isEmpty()) {
                Toast.makeText(this, "Nickname cannot be empty", Toast.LENGTH_SHORT).show();
                return;
            }

            // Disable buttons and show progress
            btnSaveEdit.setEnabled(false);
            btnCancelEdit.setEnabled(false);
            btnTakePhoto.setEnabled(false);
            btnChooseGallery.setEnabled(false);
            progressEditProfile.setVisibility(View.VISIBLE);

            if (currentPhotoUri != null) {
                // Upload new image first
                storageHelper.uploadProfileImage(currentUserData.uid, currentPhotoUri,
                        new StorageHelper.UploadCallback() {
                            @Override
                            public void onSuccess(String downloadUrl) {
                                saveProfileToFirestore(dialog, newNickname, downloadUrl, btnSaveEdit, btnCancelEdit,
                                        btnTakePhoto, btnChooseGallery, progressEditProfile);
                            }

                            @Override
                            public void onFailure(Exception e) {
                                runOnUiThread(() -> {
                                    Toast.makeText(MainActivity.this, "Image upload failed", Toast.LENGTH_SHORT).show();
                                    resetDialogUI(btnSaveEdit, btnCancelEdit, btnTakePhoto, btnChooseGallery,
                                            progressEditProfile);
                                });
                            }
                        });
            } else {
                // No new image selected, just update nickname
                saveProfileToFirestore(dialog, newNickname, currentUserData.photoURL, btnSaveEdit, btnCancelEdit,
                        btnTakePhoto, btnChooseGallery, progressEditProfile);
            }
        });

        dialog.show();
    }

    private void saveProfileToFirestore(AlertDialog dialog, String nickname, String photoUrl, View... viewsToReset) {
        firestoreHelper.updateUserProfile(
                currentUserData.uid,
                nickname,
                photoUrl,
                () -> {
                    runOnUiThread(() -> {
                        dialog.dismiss();
                        loadAllData(); // Refresh UI
                    });
                },
                e -> {
                    runOnUiThread(() -> {
                        Toast.makeText(this, "Failed to update profile", Toast.LENGTH_SHORT).show();
                        resetDialogUI(viewsToReset);
                    });
                });
    }

    private void resetDialogUI(View... views) {
        if (views.length >= 5) {
            views[0].setEnabled(true); // save
            views[1].setEnabled(true); // cancel
            views[2].setEnabled(true); // take photo
            views[3].setEnabled(true); // gallery
            views[4].setVisibility(View.GONE); // progress
        }
    }

    private void openWalletConnect() {
        helper.connect(getSupportFragmentManager());
    }

    private void disconnect() {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        android.widget.TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        android.widget.TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Disconnect Wallet");
        tvMessage.setText("Are you sure you want to disconnect?");
        btnConfirm.setText("Disconnect");
        btnCancel.setVisibility(View.VISIBLE);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> {
            Log.d(TAG, "Disconnecting wallet...");
            walletManager.disconnect();
            walletManager.setWalletAddress("");
            updateUI(false);
            dialog.dismiss();
        });

        btnCancel.setOnClickListener(v -> dialog.cancel());
        dialog.show();
    }

    private void signOut() {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        android.widget.TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        android.widget.TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Sign Out");
        tvMessage.setText("Are you sure you want to sign out?");
        btnConfirm.setText("Sign Out");
        btnCancel.setVisibility(View.VISIBLE);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> {
            Log.d(TAG, "Signing out...");
            firebaseAuth.signOut();
            googleSignInClient.signOut().addOnCompleteListener(task -> {
                Log.d(TAG, "Google sign-out complete. Navigating to LoginActivity.");
                startActivity(new Intent(this, LoginActivity.class));
                dialog.dismiss();
                finish();
            });
        });

        btnCancel.setOnClickListener(v -> dialog.cancel());
        dialog.show();
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
                    if (e.getMessage() != null && e.getMessage().contains("Unable to resolve host")) {
                        Log.w(TAG, "Offline: skipping fetchBalance toast");
                    } else {
                        Toast.makeText(this, "Failed to fetch balance: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
            }
        }).start();
    }

    @Override
    protected void onDestroy() {
        Log.d(TAG, "onDestroy called");
        super.onDestroy();
        web3Helper.shutdown();
        if (networkCallback != null) {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(
                    android.content.Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                cm.unregisterNetworkCallback(networkCallback);
            }
        }
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
