package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import android.util.Log; // Added import

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.example.credilabmobile.databinding.ActivityMainBinding;
import com.google.android.material.textfield.TextInputEditText;

import java.math.BigDecimal;

public class MainActivity extends AppCompatActivity {
    private ActivityMainBinding binding;
    private WalletManager walletManager;
    private Web3Helper web3Helper;
    private WalletConnectHelper helper; // Added field

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        walletManager = WalletManager.getInstance(this);
        web3Helper = new Web3Helper();
        helper = new WalletConnectHelper(); // Constructor takes no arguments

        binding.btnConnect.setOnClickListener(v -> {
            helper.connect(getSupportFragmentManager());
        });

        binding.btnSend.setOnClickListener(v -> {
            startActivity(new Intent(this, SendActivity.class));
        });

        binding.btnReceive.setOnClickListener(v -> {
            startActivity(new Intent(this, ReceiveActivity.class));
        });

        binding.btnRefresh.setOnClickListener(v -> fetchBalance());

        updateUI(walletManager.isConnected()); // Initial UI update with connection status

        // Listen for WalletConnect session changes
        helper.setConnectionListener(isConnected -> {
            runOnUiThread(() -> {
                Log.d("MainActivity", "Connection state changed: " + isConnected);
                if (isConnected) {
                    updateUI(true);
                    String address = helper.getSessionAddress();
                    if (address != null) {
                        binding.tvWalletAddress.setText(address); // Use binding for UI elements
                        fetchBalance(); // Fetch balance when connected
                    }
                } else {
                    updateUI(false);
                }
            });
            return kotlin.Unit.INSTANCE; // Keep the Kotlin Unit return type
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Check manually on resume in case redirect failed but connection succeeded
        // specially on Xiaomi/MIUI devices
        if (helper != null) {
            String address = helper.getSessionAddress();
            Log.d("MainActivity", "onResume check - Address: " + address);
            if (address != null && !walletManager.isConnected()) { // Only update if not already connected via
                                                                   // walletManager
                walletManager.setWalletAddress(address); // Update walletManager with session address
                updateUI(true);
                binding.tvWalletAddress.setText(address);
                fetchBalance();
            } else if (walletManager.isConnected()) {
                fetchBalance();
            }
        }
    }

    private void openWalletConnect() {
        helper.connect(getSupportFragmentManager()); // Use helper instance
    }

    private void disconnect() {
        new AlertDialog.Builder(this)
                .setTitle("Disconnect Wallet")
                .setMessage("Are you sure you want to disconnect?")
                .setPositiveButton("Disconnect", (dialog, which) -> {
                    walletManager.disconnect();
                    updateUI(false); // Immediate UI update, though session callback is better
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void updateUI(boolean isConnected) {
        if (isConnected) {
            // Assuming connectStatus, connectButton, walletAddress are members of
            // ActivityMainBinding or defined elsewhere
            // Since they are not, I'm mapping them to existing binding elements based on
            // context.
            // This part of the code might need further adjustment if the original intent
            // was different.
            binding.btnConnect.setText(getString(R.string.disconnect_wallet)); // Assuming connectButton maps to
                                                                               // btnConnect
            binding.btnConnect.setBackgroundTintList(
                    getResources().getColorStateList(R.color.error, getTheme()));
            binding.layoutActions.setVisibility(View.VISIBLE);
            binding.btnRefresh.setVisibility(View.VISIBLE);
            binding.tvWalletAddress.setVisibility(View.VISIBLE); // Assuming walletAddress maps to tvWalletAddress
            binding.tvWalletAddress.setText(WalletManager.truncateAddress(walletManager.getWalletAddress())); // Set
                                                                                                              // address
                                                                                                              // when
                                                                                                              // connected
            // connectStatus and its color are not directly mappable without more context,
            // so they are omitted or would require new UI elements.
        } else {
            binding.tvBalance.setText("--");
            binding.btnConnect.setText(getString(R.string.connect_wallet)); // Assuming connectButton maps to btnConnect
            binding.btnConnect.setBackgroundTintList(
                    getResources().getColorStateList(R.color.primary, getTheme()));
            binding.layoutActions.setVisibility(View.GONE);
            binding.btnRefresh.setVisibility(View.GONE);
            binding.tvWalletAddress.setVisibility(View.GONE); // Assuming walletAddress maps to tvWalletAddress
            binding.tvWalletAddress.setText(""); // Clear address when disconnected
            // connectStatus and its color are not directly mappable without more context.
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
