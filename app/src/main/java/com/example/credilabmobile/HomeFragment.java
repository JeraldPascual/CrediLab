package com.example.credilabmobile;

import static android.app.Activity.RESULT_OK;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CircleCrop;
import com.example.credilabmobile.data.AchievementData;
import com.example.credilabmobile.databinding.FragmentHomeBinding;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;

public class HomeFragment extends Fragment {
    private static final String TAG = "HomeFragment";
    private FragmentHomeBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;
    private WalletConnectHelper helper;
    private FirebaseAuth firebaseAuth;
    private FirestoreHelper firestoreHelper;
    private GoogleSignInClient googleSignInClient;
    private StorageHelper storageHelper;

    private String firestoreWalletAddress;
    private FirestoreHelper.UserData currentUserData = null;

    private Uri currentPhotoUri;
    private Uri tempCameraUri;
    private ImageView dialogPreviewImageView;

    private final ActivityResultLauncher<Intent> takePictureLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK) {
                    currentPhotoUri = tempCameraUri;
                    if (dialogPreviewImageView != null) {
                        if (getContext() != null) {
                            Glide.with(this).load(currentPhotoUri).transform(new CircleCrop())
                                    .into(dialogPreviewImageView);
                        }
                    }
                }
            });

    private final ActivityResultLauncher<String> pickGalleryLauncher = registerForActivityResult(
            new ActivityResultContracts.GetContent(),
            uri -> {
                if (uri != null) {
                    currentPhotoUri = uri;
                    if (dialogPreviewImageView != null) {
                        if (getContext() != null) {
                            Glide.with(this).load(currentPhotoUri).transform(new CircleCrop())
                                    .into(dialogPreviewImageView);
                        }
                    }
                }
            });

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        binding = FragmentHomeBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        firebaseAuth = FirebaseAuth.getInstance();
        FirebaseUser currentUser = firebaseAuth.getCurrentUser();
        if (currentUser == null) {
            requireActivity().startActivity(new Intent(requireActivity(), LoginActivity.class));
            requireActivity().finish();
            return;
        }

        walletManager = WalletManager.getInstance(requireContext());
        web3Helper = new Web3Helper();
        helper = new WalletConnectHelper(requireActivity());
        firestoreHelper = new FirestoreHelper();
        storageHelper = new StorageHelper();

        String webClientId = "940995805838-sgm85vgmibuspul03emh7f4iqr0bemkn.apps.googleusercontent.com";
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(webClientId)
                .requestEmail()
                .build();
        googleSignInClient = GoogleSignIn.getClient(requireActivity(), gso);

        binding.btnAccountDetails.setOnClickListener(v -> showAccountDetailsDialog());

        View aboutHeader = binding.cvAbout.findViewById(R.id.tvHeaderTitle);
        if (aboutHeader instanceof TextView)
            ((TextView) aboutHeader).setText("About");
        View aboutIcon = binding.cvAbout.findViewById(R.id.ivHeaderIcon);
        if (aboutIcon != null)
            aboutIcon.setVisibility(View.GONE);

        View tutorialHeader = binding.cvTutorial.findViewById(R.id.tvHeaderTitle);
        if (tutorialHeader instanceof TextView)
            ((TextView) tutorialHeader).setText("Tutorial");
        View tutorialIcon = binding.cvTutorial.findViewById(R.id.ivHeaderIcon);
        if (tutorialIcon != null)
            tutorialIcon.setVisibility(View.GONE);

        androidx.cardview.widget.CardView cvWallet = binding.getRoot().findViewById(R.id.cvWallet);
        if (cvWallet != null) {
            View walletHeader = cvWallet.findViewById(R.id.tvHeaderTitle);
            if (walletHeader instanceof TextView)
                ((TextView) walletHeader).setText("dWallet");
            View walletIcon = cvWallet.findViewById(R.id.ivHeaderIcon);
            if (walletIcon != null)
                walletIcon.setVisibility(View.GONE);
        }

        binding.cvAbout
                .setOnClickListener(v -> startActivity(new Intent(requireActivity(), AboutActivity.class)));

        binding.cvTutorial
                .setOnClickListener(v -> startActivity(new Intent(requireActivity(), HowToUseActivity.class)));

        binding.btnConnect.setOnClickListener(v -> {
            if (walletManager.isConnected()) {
                disconnect();
            } else {
                helper.connect(getParentFragmentManager());
            }
        });

        binding.btnSend.setOnClickListener(v -> startActivity(new Intent(requireActivity(), SendActivity.class)));
        binding.btnReceive.setOnClickListener(v -> startActivity(new Intent(requireActivity(), ReceiveActivity.class)));
        binding.btnRefresh.setOnClickListener(v -> loadAllData());
        binding.btnClaimTokens.setOnClickListener(v -> showClaimDialog());

        updateUI(walletManager.isConnected());

        helper.setConnectionListener(isConnected -> {
            requireActivity().runOnUiThread(() -> {
                if (isConnected) {
                    updateUI(true);
                    String address = helper.getSessionAddress();
                    if (address == null || address.isEmpty()) {
                        address = walletManager.getWalletAddress();
                    }
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

        loadAllData();
    }

    @Override
    public void onResume() {
        super.onResume();
        try {
            String address = walletManager.getWalletAddress();
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

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (web3Helper != null) {
            web3Helper.shutdown();
        }
        binding = null;
    }

    private void loadAllData() {
        FirebaseUser user = firebaseAuth.getCurrentUser();
        if (user == null || !isAdded())
            return;

        firestoreHelper.getUserData(user.getUid(), new FirestoreHelper.UserDataCallback() {
            @Override
            public void onSuccess(FirestoreHelper.UserData data) {
                currentUserData = data;
                if (!isAdded())
                    return;
                requireActivity().runOnUiThread(() -> {
                    try {
                        binding.tvCredits.setText(String.valueOf(data.credits));
                        binding.tvCredits.setVisibility(View.VISIBLE);
                        binding.tvCreditsLabel.setVisibility(View.VISIBLE);
                        binding.btnClaimTokens.setVisibility(data.credits > 0 ? View.VISIBLE : View.GONE);

                        String displayName = data.getBestName();
                        binding.tvDisplayName.setText(displayName);

                        String photoURL = data.photoURL;
                        if (photoURL == null || photoURL.isEmpty()) {
                            FirebaseUser fbUser = firebaseAuth.getCurrentUser();
                            if (fbUser != null && fbUser.getPhotoUrl() != null) {
                                photoURL = fbUser.getPhotoUrl().toString();
                            }
                        }
                        if (photoURL != null && !photoURL.isEmpty()) {
                            Glide.with(HomeFragment.this)
                                    .load(photoURL)
                                    .transform(new CircleCrop())
                                    .placeholder(R.drawable.ic_launcher_foreground)
                                    .into(binding.ivProfilePhoto);
                        } else {
                            Glide.with(HomeFragment.this)
                                    .load(R.drawable.ic_launcher_foreground)
                                    .transform(new CircleCrop())
                                    .into(binding.ivProfilePhoto);
                        }

                        long totalEarned = data.totalCLBEarned > 0 ? data.totalCLBEarned : data.credits;
                        AchievementData.SkillTier tier = AchievementData.getSkillTier(totalEarned);
                        binding.tvTierIcon.setText(tier.icon);
                        binding.tvTierTitle.setText(tier.title);

                        BadgesHelper badgesHelper = new BadgesHelper(requireActivity());
                        binding.tfvMainProfile.setTierColors(badgesHelper.getTierColors(tier.id));

                        if (data.walletAddress != null && !data.walletAddress.isEmpty()) {
                            firestoreWalletAddress = data.walletAddress;
                            binding.tvWalletAddress.setText(WalletManager.truncateAddress(data.walletAddress));
                            binding.tvWalletAddress.setVisibility(View.VISIBLE);
                            fetchBalance(data.walletAddress);
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "Error updating UI with Firestore data", e);
                    }
                });
            }

            @Override
            public void onFailure(Exception e) {
                if (!isAdded())
                    return;
                requireActivity().runOnUiThread(() -> binding.tvCredits.setText("--"));
            }
        });
    }

    private void updateUI(boolean isConnected) {
        if (!isAdded() || binding == null)
            return;
        try {
            if (isConnected) {
                String address = walletManager.getWalletAddress();
                binding.btnConnect.setText(getString(R.string.disconnect_wallet));
                binding.btnConnect.setBackgroundTintList(
                        getResources().getColorStateList(R.color.error, requireActivity().getTheme()));
                binding.layoutActions.setVisibility(View.VISIBLE);
                binding.btnRefresh.setVisibility(View.VISIBLE);
                binding.tvWalletAddress.setVisibility(View.VISIBLE);
                binding.tvWalletAddress.setText(WalletManager.truncateAddress(address));
            } else {
                binding.tvBalance.setText("--");
                binding.btnConnect.setText(getString(R.string.connect_wallet));
                binding.btnConnect.setBackgroundTintList(
                        getResources().getColorStateList(R.color.primary, requireActivity().getTheme()));
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
        if (walletAddress == null || walletAddress.isEmpty() || !isAdded())
            return;
        binding.tvBalance.setText("...");
        new Thread(() -> {
            try {
                BigDecimal balance = web3Helper.getCLBBalance(walletAddress);
                if (isAdded()) {
                    requireActivity().runOnUiThread(
                            () -> binding.tvBalance.setText(balance.stripTrailingZeros().toPlainString()));
                }
            } catch (Exception e) {
                if (isAdded()) {
                    requireActivity().runOnUiThread(() -> {
                        binding.tvBalance.setText("Error");
                        Toast.makeText(requireContext(), "Failed to fetch balance", Toast.LENGTH_SHORT).show();
                    });
                }
            }
        }).start();
    }

    private void showMessageDialog(String title, String message) {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);

        tvTitle.setText(title);
        tvMessage.setText(message);
        btnConfirm.setText("OK");

        AlertDialog dialog = new AlertDialog.Builder(requireContext())
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
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Claim Tokens");
        tvMessage.setText("Enter amount to claim (max " + currentUserData.credits + ", up to 500 CLB):");
        btnConfirm.setText("Claim");
        btnCancel.setVisibility(View.VISIBLE);

        final android.widget.EditText input = new android.widget.EditText(requireContext());
        input.setInputType(android.text.InputType.TYPE_CLASS_NUMBER);
        input.setTextColor(ContextCompat.getColor(requireContext(), R.color.text_primary));
        input.setHintTextColor(ContextCompat.getColor(requireContext(), R.color.text_secondary));
        input.setBackgroundTintList(
                android.content.res.ColorStateList.valueOf(ContextCompat.getColor(requireContext(), R.color.primary)));

        android.widget.FrameLayout container = new android.widget.FrameLayout(requireContext());
        android.widget.FrameLayout.LayoutParams params = new android.widget.FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        params.leftMargin = 50;
        params.rightMargin = 50;
        input.setLayoutParams(params);
        container.addView(input);

        android.widget.LinearLayout rootLayout = (android.widget.LinearLayout) customView;
        rootLayout.addView(container, 2);

        AlertDialog dialog = new AlertDialog.Builder(requireContext())
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
                if (amount <= 0 || amount > currentUserData.credits || amount > 500) {
                    showMessageDialog("Invalid Amount", "Invalid claim amount.");
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
        TextView tvTitle = loadingView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = loadingView.findViewById(R.id.tvDialogMessage);
        loadingView.findViewById(R.id.btnConfirm).setVisibility(View.GONE);

        tvTitle.setText("Claiming tokens...");
        tvMessage.setText("Please wait while the transaction is processed on the blockchain.");

        AlertDialog loadingDialog = new AlertDialog.Builder(requireContext())
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
                    if (isAdded()) {
                        requireActivity().runOnUiThread(() -> {
                            if (loadingDialog.isShowing())
                                loadingDialog.dismiss();
                            showMessageDialog("Success", "Tokens claimed successfully!");
                            loadAllData();
                        });
                    }
                }

                @Override
                public void onFailure(int responseCode, String message) {
                    if (isAdded()) {
                        requireActivity().runOnUiThread(() -> {
                            if (loadingDialog.isShowing())
                                loadingDialog.dismiss();
                            showMessageDialog("Claim Failed", "Error processing claim:\n" + message);
                        });
                    }
                }
            });
        }).addOnFailureListener(e -> {
            if (loadingDialog.isShowing())
                loadingDialog.dismiss();
            showMessageDialog("Authentication Error", "Failed to retrieve Firebase ID token.");
        });
    }

    private void showAccountDetailsDialog() {
        View dialogView = getLayoutInflater().inflate(R.layout.dialog_account_details, null);
        TextView tvEmail = dialogView.findViewById(R.id.tvDialogEmail);
        TextView tvWallet = dialogView.findViewById(R.id.tvDialogWallet);
        ImageView btnCopy = dialogView.findViewById(R.id.btnCopyWallet);
        ImageView btnEditProfile = dialogView.findViewById(R.id.btnDialogEditProfile);
        com.google.android.material.button.MaterialButton btnAchievements = dialogView
                .findViewById(R.id.btnDialogAchievements);
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
                Glide.with(this).load(photoURL).transform(new CircleCrop())
                        .placeholder(R.drawable.ic_launcher_foreground).into(ivProfile);
            } else {
                Glide.with(this).load(R.drawable.ic_launcher_foreground).transform(new CircleCrop()).into(ivProfile);
            }
        }

        androidx.appcompat.app.AlertDialog dialog = new androidx.appcompat.app.AlertDialog.Builder(requireContext())
                .setView(dialogView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnCopy.setOnClickListener(v -> {
            if (firestoreWalletAddress != null && !firestoreWalletAddress.isEmpty()) {
                android.content.ClipboardManager clipboard = (android.content.ClipboardManager) requireActivity()
                        .getSystemService(android.content.Context.CLIPBOARD_SERVICE);
                android.content.ClipData clip = android.content.ClipData.newPlainText("Wallet Address",
                        firestoreWalletAddress);
                clipboard.setPrimaryClip(clip);
                Toast.makeText(requireContext(), "Address copied!", Toast.LENGTH_SHORT).show();
            }
        });

        btnEditProfile.setOnClickListener(v -> {
            dialog.dismiss();
            showEditProfileDialog();
        });

        btnAchievements.setOnClickListener(v -> {
            dialog.dismiss();
            startActivity(new Intent(requireActivity(), AchievementsActivity.class));
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
            Toast.makeText(requireContext(), "Still loading user data...", Toast.LENGTH_SHORT).show();
            return;
        }

        View dialogView = getLayoutInflater().inflate(R.layout.dialog_edit_profile, null);
        AlertDialog dialog = new AlertDialog.Builder(requireContext())
                .setView(dialogView)
                .create();

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
        currentPhotoUri = null;

        if (currentUserData.photoURL != null && !currentUserData.photoURL.isEmpty()) {
            Glide.with(this).load(currentUserData.photoURL).transform(new CircleCrop())
                    .placeholder(R.drawable.ic_launcher_foreground).into(dialogPreviewImageView);
        }

        btnTakePhoto.setOnClickListener(v -> {
            try {
                File photoFile = File.createTempFile("profile_", ".jpg",
                        new File(requireActivity().getCacheDir(), "camera_photos"));
                if (!photoFile.getParentFile().exists()) {
                    photoFile.getParentFile().mkdirs();
                }
                tempCameraUri = FileProvider.getUriForFile(requireContext(),
                        requireActivity().getPackageName() + ".provider", photoFile);
                Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, tempCameraUri);
                takePictureLauncher.launch(takePictureIntent);
            } catch (IOException ex) {
                Toast.makeText(requireContext(), "Failed to prep camera", Toast.LENGTH_SHORT).show();
            }
        });

        btnChooseGallery.setOnClickListener(v -> pickGalleryLauncher.launch("image/*"));
        btnCancelEdit.setOnClickListener(v -> dialog.dismiss());
        btnSaveEdit.setOnClickListener(v -> {
            String newNickname = etNickname.getText() != null ? etNickname.getText().toString().trim() : "";
            if (newNickname.isEmpty()) {
                Toast.makeText(requireContext(), "Nickname cannot be empty", Toast.LENGTH_SHORT).show();
                return;
            }

            btnSaveEdit.setEnabled(false);
            btnCancelEdit.setEnabled(false);
            btnTakePhoto.setEnabled(false);
            btnChooseGallery.setEnabled(false);
            progressEditProfile.setVisibility(View.VISIBLE);

            if (currentPhotoUri != null) {
                storageHelper.uploadProfileImage(currentUserData.uid, currentPhotoUri,
                        new StorageHelper.UploadCallback() {
                            @Override
                            public void onSuccess(String downloadUrl) {
                                saveProfileToFirestore(dialog, newNickname, downloadUrl, btnSaveEdit, btnCancelEdit,
                                        btnTakePhoto, btnChooseGallery, progressEditProfile);
                            }

                            @Override
                            public void onFailure(Exception e) {
                                requireActivity().runOnUiThread(() -> {
                                    Toast.makeText(requireContext(), "Image upload failed", Toast.LENGTH_SHORT).show();
                                    resetDialogUI(btnSaveEdit, btnCancelEdit, btnTakePhoto, btnChooseGallery,
                                            progressEditProfile);
                                });
                            }
                        });
            } else {
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
                () -> requireActivity().runOnUiThread(() -> {
                    dialog.dismiss();
                    loadAllData();
                }),
                e -> requireActivity().runOnUiThread(() -> {
                    Toast.makeText(requireContext(), "Failed to update profile", Toast.LENGTH_SHORT).show();
                    resetDialogUI(viewsToReset);
                }));
    }

    private void resetDialogUI(View... views) {
        if (views.length >= 5) {
            views[0].setEnabled(true);
            views[1].setEnabled(true);
            views[2].setEnabled(true);
            views[3].setEnabled(true);
            views[4].setVisibility(View.GONE);
        }
    }

    private void disconnect() {
        View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Disconnect Wallet");
        tvMessage.setText("Are you sure you want to disconnect?");
        btnConfirm.setText("Disconnect");
        btnCancel.setVisibility(View.VISIBLE);

        AlertDialog dialog = new AlertDialog.Builder(requireContext())
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
        }

        btnConfirm.setOnClickListener(v -> {
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
        TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
        TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
        com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
        com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

        tvTitle.setText("Sign Out");
        tvMessage.setText("Are you sure you want to sign out?");
        btnConfirm.setText("Sign Out");
        btnCancel.setVisibility(View.VISIBLE);

        AlertDialog dialog = new AlertDialog.Builder(requireContext())
                .setView(customView)
                .create();

        if (dialog.getWindow() != null) {
            dialog.getWindow().setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(0));
        }

        btnConfirm.setOnClickListener(v -> {
            firebaseAuth.signOut();
            googleSignInClient.signOut().addOnCompleteListener(task -> {
                startActivity(new Intent(requireActivity(), LoginActivity.class));
                dialog.dismiss();
                requireActivity().finish();
            });
        });

        btnCancel.setOnClickListener(v -> dialog.cancel());
        dialog.show();
    }
}
