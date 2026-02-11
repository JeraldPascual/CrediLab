package com.example.credilabmobile;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivitySendBinding;

import androidx.activity.result.ActivityResultLauncher;
import com.journeyapps.barcodescanner.ScanContract;
import com.journeyapps.barcodescanner.ScanOptions;

import java.math.BigDecimal;

public class SendActivity extends AppCompatActivity {
    private ActivitySendBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;

    private final ActivityResultLauncher<ScanOptions> barcodeLauncher = registerForActivityResult(new ScanContract(),
            result -> {
                if (result.getContents() == null) {
                    Toast.makeText(this, "Cancelled", Toast.LENGTH_LONG).show();
                } else {
                    binding.etRecipient.setText(result.getContents());
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivitySendBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        walletManager = WalletManager.getInstance(this);
        web3Helper = new Web3Helper();

        binding.btnBack.setOnClickListener(v -> finish());
        binding.tilRecipient.setEndIconOnClickListener(v -> scanQrCode());

        binding.btnSendToken.setOnClickListener(v -> sendToken());

        fetchBalance();
    }

    private void scanQrCode() {
        ScanOptions options = new ScanOptions();
        options.setPrompt("Scan a wallet address");
        options.setBeepEnabled(false);
        options.setOrientationLocked(false);
        barcodeLauncher.launch(options);
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

        String transferData = web3Helper.buildTransferData(recipient, amount);

        String metamaskUrl = "metamask://send/"
                + Constants.CLB_CONTRACT_ADDRESS
                + "@" + Constants.CHAIN_ID
                + "?value=0"
                + "&data=" + transferData;

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(metamaskUrl));
            startActivity(intent);
            binding.tvStatus.setText("Opening MetaMask to sign transaction...");
            binding.tvStatus.setVisibility(View.VISIBLE);
        } catch (Exception e) {
            Toast.makeText(this,
                    "MetaMask not installed. Please install MetaMask.",
                    Toast.LENGTH_LONG).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        web3Helper.shutdown();
    }
}
