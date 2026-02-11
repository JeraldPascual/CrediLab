package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivityMainBinding;
import com.google.android.material.textfield.TextInputEditText;

import java.math.BigDecimal;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        walletManager = new WalletManager(this);
        web3Helper = new Web3Helper();

        binding.btnConnect.setOnClickListener(v -> {
            if (walletManager.isConnected()) {
                disconnect();
            } else {
                showConnectDialog();
            }
        });

        binding.btnSend.setOnClickListener(v -> {
            startActivity(new Intent(this, SendActivity.class));
        });

        binding.btnReceive.setOnClickListener(v -> {
            startActivity(new Intent(this, ReceiveActivity.class));
        });

        binding.btnRefresh.setOnClickListener(v -> fetchBalance());

        updateUI();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (walletManager.isConnected()) {
            fetchBalance();
        }
    }

    private void showConnectDialog() {
        View dialogView = getLayoutInflater().inflate(
                android.R.layout.simple_list_item_1, null);

        TextInputEditText input = new TextInputEditText(this);
        input.setHint("0x...");
        input.setTextSize(14);
        int padding = (int) (20 * getResources().getDisplayMetrics().density);
        input.setPadding(padding, padding, padding, padding);

        new AlertDialog.Builder(this)
                .setTitle("Connect Wallet")
                .setMessage("Paste your MetaMask wallet address:")
                .setView(input)
                .setPositiveButton("Connect", (dialog, which) -> {
                    String address = input.getText() != null ? input.getText().toString().trim() : "";
                    if (WalletManager.isValidAddress(address)) {
                        walletManager.saveWalletAddress(address);
                        updateUI();
                        fetchBalance();
                    } else {
                        Toast.makeText(this, "Invalid Ethereum address",
                                Toast.LENGTH_SHORT).show();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void disconnect() {
        new AlertDialog.Builder(this)
                .setTitle("Disconnect Wallet")
                .setMessage("Are you sure you want to disconnect?")
                .setPositiveButton("Disconnect", (dialog, which) -> {
                    walletManager.disconnect();
                    updateUI();
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void updateUI() {
        if (walletManager.isConnected()) {
            String address = walletManager.getWalletAddress();
            binding.tvWalletAddress.setText(WalletManager.truncateAddress(address));
            binding.btnConnect.setText("Disconnect");
            binding.btnConnect.setBackgroundTintList(
                    getResources().getColorStateList(R.color.error, getTheme()));
            binding.layoutActions.setVisibility(View.VISIBLE);
            binding.btnRefresh.setVisibility(View.VISIBLE);
        } else {
            binding.tvBalance.setText("--");
            binding.tvWalletAddress.setText("Not connected");
            binding.btnConnect.setText("Connect Wallet");
            binding.btnConnect.setBackgroundTintList(
                    getResources().getColorStateList(R.color.primary, getTheme()));
            binding.layoutActions.setVisibility(View.GONE);
            binding.btnRefresh.setVisibility(View.GONE);
        }
    }

    private void fetchBalance() {
        binding.tvBalance.setText("...");
        new Thread(() -> {
            try {
                BigDecimal balance = web3Helper.getCLBBalance(
                        walletManager.getWalletAddress());
                runOnUiThread(() -> binding.tvBalance.setText(balance.stripTrailingZeros().toPlainString()));
            } catch (Exception e) {
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
        super.onDestroy();
        web3Helper.shutdown();
    }
}
