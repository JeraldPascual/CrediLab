package com.example.credilabmobile

import androidx.fragment.app.FragmentManager
import com.walletconnect.web3.modal.client.Modal
import com.walletconnect.web3.modal.client.Web3Modal
import com.walletconnect.web3.modal.ui.Web3ModalSheet

object WalletConnectHelper {

    /**
     * Opens the WalletConnect modal.
     */
    fun connect(fragmentManager: FragmentManager) {
        try {
             val sheet = Web3ModalSheet()
             sheet.show(fragmentManager, "Web3Modal")
        } catch (e: Exception) {
            android.util.Log.e("WalletConnectHelper", "Error opening modal", e)
        }
    }
    
    fun getSessionAddress(): String? {
        return Web3Modal.getAccount()?.address
    }
    
    fun disconnect() {
        Web3Modal.disconnect(
            onSuccess = { android.util.Log.d("WalletConnectHelper", "Disconnected") },
            onError = { error: Throwable -> android.util.Log.e("WalletConnectHelper", "Disconnect error", error) }
        )
    }

    fun sendTransaction(
        to: String,
        data: String,
        valueHex: String,
        onSuccess: (String) -> Unit,
        onError: (Throwable) -> Unit
    ) {
        // Implementation delayed until SignClient API is verified.
        // For now, prompt user that signing via WalletConnect is pending.
        onError(Exception("WalletConnect signing not yet fully implemented."))
    }
}
