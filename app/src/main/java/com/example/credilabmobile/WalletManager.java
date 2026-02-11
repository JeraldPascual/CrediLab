package com.example.credilabmobile;

import android.content.Context;
import android.content.SharedPreferences;

public class WalletManager {
    private final SharedPreferences prefs;

    public WalletManager(Context context) {
        prefs = context.getSharedPreferences(Constants.PREFS_NAME, Context.MODE_PRIVATE);
    }

    public void saveWalletAddress(String address) {
        prefs.edit().putString(Constants.PREF_WALLET_ADDRESS, address).apply();
    }

    public String getWalletAddress() {
        return prefs.getString(Constants.PREF_WALLET_ADDRESS, null);
    }

    public boolean isConnected() {
        String address = getWalletAddress();
        return address != null && !address.isEmpty();
    }

    public void disconnect() {
        prefs.edit().remove(Constants.PREF_WALLET_ADDRESS).apply();
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
