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
                runOnUiThread(() -> binding.tvCurrentBalance.setText("Your balance: " + formatted + " CLB"));
            } catch (Exception e) {
                runOnUiThread(() -> binding.tvCurrentBalance.setText("Your balance: unavailable"));
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

        // Send via WalletConnect session
        // Deep Link Implementation (V2 - HTTPS Format)
        // Calculate raw amount (18 decimals)
        java.math.BigInteger rawAmount = amount.multiply(java.math.BigDecimal.TEN.pow(18)).toBigInteger();

        // Use
        // https://metamask.app.link/send/{contract}@{chain}/transfer?address={recipient}&uint256={amount}
        // Sepolia Chain ID: 11155111
        String uriString = "https://metamask.app.link/send/" +
                Constants.CLB_CONTRACT_ADDRESS +
                "@11155111" +
                "/transfer?address=" + recipient +
                "&uint256=" + rawAmount.toString();

        Log.d(TAG, "Opening Deep Link: " + uriString);

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, android.net.Uri.parse(uriString));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(intent);

            // Assume success in launching intent
            runOnUiThread(() -> {
                binding.tvStatus.setText("Request sent to MetaMask. Please check your wallet.");
                binding.tvStatus.setVisibility(View.VISIBLE);
                binding.btnSendToken.setText("Check Wallet");
                binding.btnSendToken.setEnabled(true);
            });
        } catch (android.content.ActivityNotFoundException e) {
            runOnUiThread(() -> {
                binding.tvStatus.setText("MetaMask not found!");
                binding.tvStatus.setVisibility(View.VISIBLE);
                binding.btnSendToken.setText("Send via MetaMask");
                binding.btnSendToken.setEnabled(true);
                Toast.makeText(this, "MetaMask app not found", Toast.LENGTH_LONG).show();
            });
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        web3Helper.shutdown();
    }
}
