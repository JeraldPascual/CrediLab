package com.example.credilabmobile;

import android.content.Context;
import android.content.SharedPreferences;

public class WalletManager {
    private final SharedPreferences prefs;

    private static WalletManager instance;

    private WalletManager(Context context) {
        prefs = context.getSharedPreferences(Constants.PREFS_NAME, Context.MODE_PRIVATE);
    }

    public static synchronized WalletManager getInstance(Context context) {
        if (instance == null) {
            instance = new WalletManager(context);
        }
        return instance;
    }

    public void setWalletAddress(String address) {
        // Clean CAIP-10 prefix before storing
        String cleaned = cleanAddress(address);
        prefs.edit().putString(Constants.PREF_WALLET_ADDRESS, cleaned).apply();
    }

    public String getWalletAddress() {
        // Try getting from WalletConnectHelper first
        String address = WalletConnectHelper.getAddress();

        // Fallback to local storage if AppKit returns null or empty
        // (AppKit.getAccount()?.address can return "" right after session approval)
        if (address == null || address.isEmpty()) {
            address = prefs.getString(Constants.PREF_WALLET_ADDRESS, null);
        }
        return cleanAddress(address);
    }

    /**
     * Strips CAIP-10 prefix if present.
     * e.g. "eip155:11155111:0xABC..." -> "0xABC..."
     */
    private static String cleanAddress(String address) {
        if (address == null)
            return null;
        if (address.contains(":")) {
            String[] parts = address.split(":");
            return parts[parts.length - 1];
        }
        return address;
    }

    public boolean isConnected() {
        String address = getWalletAddress();
        return address != null && !address.isEmpty();
    }

    public void disconnect() {
        WalletConnectHelper.disconnect(
                () -> {
                    android.util.Log.d("WalletManager", "Disconnected");
                    return kotlin.Unit.INSTANCE;
                },
                (error) -> {
                    android.util.Log.e("WalletManager", "Disconnect error", error);
                    return kotlin.Unit.INSTANCE;
                });
    }

    public static boolean isValidAddress(String address) {
        return address != null && address.matches("^0x[0-9a-fA-F]{40}$");
    }

    public static String truncateAddress(String address) {
        if (address == null || address.length() < 12)
            return address;
        return address.substring(0, 6) + "..." + address.substring(address.length() - 4);
    }
}
