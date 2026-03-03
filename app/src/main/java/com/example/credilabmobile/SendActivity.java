package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivitySendBinding;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;

import java.math.BigDecimal;

public class SendActivity extends AppCompatActivity {
    private static final String TAG = "SendActivity";
    private ActivitySendBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;
    private WalletConnectHelper walletConnectHelper;

    private final ActivityResultLauncher<Intent> qrScannerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    String scannedAddress = result.getData()
                            .getStringExtra(QrScannerActivity.EXTRA_SCAN_RESULT);
                    if (scannedAddress != null) {
                        binding.etRecipient.setText(scannedAddress);
                    }
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySendBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        walletManager = WalletManager.getInstance(this);
        web3Helper = new Web3Helper();
        walletConnectHelper = new WalletConnectHelper(this);

        // Listen for transaction responses from MetaMask
        // Transaction listener removed - using deep links

        binding.btnBack.setOnClickListener(v -> finish());
        binding.tilRecipient.setEndIconOnClickListener(v -> scanQrCode());

        binding.btnSendToken.setOnClickListener(v -> sendToken());

        fetchBalance();
    }

    private void scanQrCode() {
        Intent intent = new Intent(this, QrScannerActivity.class);
        qrScannerLauncher.launch(intent);
    }

    private void fetchBalance() {
        new Thread(() -> {
            try {
                BigDecimal balance = web3Helper.getCLBBalance(
                        walletManager.getWalletAddress());
                String formatted = balance.stripTrailingZeros().toPlainString();
                runOnUiThread(() -> binding.tvCurrentBalance
                        .setText("Your balance: " + formatted + " CLB (send up to 999 CLB)"));
            } catch (Exception e) {
                runOnUiThread(() -> binding.tvCurrentBalance.setText("Your balance: unavailable (send up to 999 CLB)"));
            }
        }).start();
    }

    private void sendToken() {
        String recipient = binding.etRecipient.getText() != null ? binding.etRecipient.getText().toString().trim() : "";
        String amountStr = binding.etAmount.getText() != null ? binding.etAmount.getText().toString().trim() : "";

        if (!WalletManager.isValidAddress(recipient)) {
            Toast.makeText(this, "Invalid recipient address", Toast.LENGTH_SHORT).show();
            return;
        }

        if (amountStr.isEmpty()) {
            Toast.makeText(this, "Enter an amount", Toast.LENGTH_SHORT).show();
            return;
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(amountStr);
            if (amount.compareTo(BigDecimal.ZERO) <= 0) {
                Toast.makeText(this, "Amount must be greater than 0", Toast.LENGTH_SHORT).show();
                return;
            }
            if (amount.compareTo(new BigDecimal("999")) > 0) {
                View customView = getLayoutInflater().inflate(R.layout.dialog_custom, null);
                TextView tvTitle = customView.findViewById(R.id.tvDialogTitle);
                TextView tvMessage = customView.findViewById(R.id.tvDialogMessage);
                com.google.android.material.button.MaterialButton btnConfirm = customView.findViewById(R.id.btnConfirm);
                com.google.android.material.button.MaterialButton btnCancel = customView.findViewById(R.id.btnCancel);

                tvTitle.setText("Transaction Limit Exceeded");
                tvMessage.setText("Maximum limit is 999 CLB per transaction.");
                btnConfirm.setText("Close");
                btnCancel.setVisibility(View.GONE);

                AlertDialog dialog = new AlertDialog.Builder(this)
                        .setView(customView)
                        .create();

                if (dialog.getWindow() != null) {
                    dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);
                }

                btnConfirm.setOnClickListener(d -> dialog.dismiss());
                dialog.show();
                return;
            }
        } catch (NumberFormatException e) {
            Toast.makeText(this, "Invalid amount", Toast.LENGTH_SHORT).show();
            return;
        }

        String from = walletManager.getWalletAddress();
        if (from == null || from.isEmpty()) {
            Toast.makeText(this, "Wallet not connected", Toast.LENGTH_SHORT).show();
            return;
        }

        // Build the ERC-20 transfer function call data
        String transferData = web3Helper.buildTransferData(recipient, amount);
        Log.d(TAG, "Transfer data: " + transferData);

        // Disable button to prevent double-tap
        binding.btnSendToken.setEnabled(false);
        binding.btnSendToken.setText("Sending...");
        binding.tvStatus.setText("Sending request to MetaMask...");
        binding.tvStatus.setVisibility(View.VISIBLE);

        // --- Deep Link Approach ---
        // We are using the HEX format (0xaa36a7) for the Chain ID because MetaMask's
        // decimal parser trunkates 11155111 to 1115511. Passing it as hex might bypass
        // the bug and correctly tell it to switch to Sepolia.
        java.math.BigInteger rawAmount = amount
                .multiply(java.math.BigDecimal.TEN.pow(Constants.TOKEN_DECIMALS))
                .toBigInteger();

        String chainIdHex = "0xaa36a7";

        // Use a timestamp nonce so MetaMask never sees the exact same deep link twice
        // in a row.
        // MetaMask is aggressively caching or ignoring identical deep links sent in
        // the same background session, leading to its broken parsing fallback.
        long nonce = System.currentTimeMillis();

        String transferPath = Constants.CLB_CONTRACT_ADDRESS
                + "@" + chainIdHex
                + "/transfer?address=" + recipient
                + "&uint256=" + rawAmount.toString()
                + "&nonce=" + nonce;

        // The user reported the deep link parsing worked when they spammed the Send
        // button twice.
        // This is a classic React Native "cold start" bug: when the app is fully
        // closed,
        // the first intent gets swallowed while the UI thread initializes, and the
        // transaction is lost.
        // The second tap worked because MetaMask was already running in memory.

        // Fix 1: Add Intent.FLAG_ACTIVITY_NEW_TASK so Android routes the intent to the
        // root activity properly.
        // Fix 2: Prioritize link.metamask.io. Android App Links (HTTPS) are buffered by
        // the OS
        // differently than custom URI schemes (metamask://), which often survives the
        // cold-start drops.

        String[] urls = {
                "https://link.metamask.io/send/" + transferPath,
                "metamask://send/" + transferPath,
                "https://metamask.app.link/send/" + transferPath
        };

        boolean launched = false;
        for (String url : urls) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

                if (url.startsWith("metamask://")) {
                    intent.setPackage("io.metamask");
                }

                if (intent.resolveActivity(getPackageManager()) != null) {
                    startActivity(intent);
                    launched = true;
                    break;
                }
            } catch (Exception e) {
                Log.w(TAG, "Failed URL: " + url + " / " + e.getMessage());
            }
        }

        if (!launched) {
            try {
                startActivity(new Intent(Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://link.metamask.io/send/" + transferPath)));
                launched = true;
            } catch (Exception e) {
                Toast.makeText(this, "MetaMask not installed", Toast.LENGTH_LONG).show();
            }
        }

        binding.tvStatus.setText(launched
                ? "MetaMask opened — check the transaction."
                : "Could not open MetaMask.");
        binding.btnSendToken.setText("Send CLB");
        binding.btnSendToken.setEnabled(true);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        web3Helper.shutdown();
    }
}
