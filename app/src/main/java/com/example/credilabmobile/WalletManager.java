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
        // WalletConnect manages the session, but we can store it locally if needed
        // for UI consistency before the session is fully validated
        prefs.edit().putString(Constants.PREF_WALLET_ADDRESS, address).apply();
    }

    public String getWalletAddress() {
        // Try getting from Web3Modal first
        String address = null;
        try {
            if (com.walletconnect.web3.modal.client.Web3Modal.INSTANCE.getAccount() != null) {
                address = com.walletconnect.web3.modal.client.Web3Modal.INSTANCE.getAccount().getAddress();
            }
        } catch (Exception e) {
            android.util.Log.e("WalletManager", "Error getting account from Web3Modal", e);
        }

        // Fallback to local storage if Web3Modal is not ready or returns null
        if (address == null) {
            address = prefs.getString(Constants.PREF_WALLET_ADDRESS, null);
        }
        return address;
    }

    public boolean isConnected() {
        String address = getWalletAddress();
        return address != null && !address.isEmpty();
    }

    public void disconnect() {
        com.walletconnect.web3.modal.client.Web3Modal.INSTANCE.disconnect(
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
