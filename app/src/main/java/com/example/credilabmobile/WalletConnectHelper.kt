package com.example.credilabmobile

import android.util.Log
import androidx.fragment.app.FragmentManager
import com.reown.appkit.client.*
import com.reown.appkit.client.Modal
import com.reown.appkit.ui.AppKitSheet


class WalletConnectHelper(private val context: android.content.Context) {

// ... (existing code) ...



    fun interface TransactionListener {
        fun onResponse(success: Boolean, message: String)
    }

    private var onConnectionStateChange: ((Boolean) -> Unit)? = null
    private var onTransactionResponse: TransactionListener? = null
    private var sessionTopic: String? = null


    init {
        val delegate = object : AppKit.ModalDelegate {
            override fun onSessionApproved(approvedSession: Modal.Model.ApprovedSession) {
                val sessionStr = approvedSession.toString()
                Log.d("WalletConnectHelper", "Session Approved: $sessionStr")
                // sessionTopic = approvedSession.topic // topic property not available directly
                try {
                    var address: String? = null

                    // Method 1: Parse 0x address from the session string representation
                    val regex = Regex("0x[a-fA-F0-9]{40}")
                    val match = regex.find(sessionStr)
                    if (match != null) {
                        address = match.value
                        Log.d("WalletConnectHelper", "Address from session string: $address")
                    }

                    // Method 2: Try AppKit.getAccount() directly
                    if (address.isNullOrEmpty()) {
                        val account = AppKit.getAccount()
                        Log.d("WalletConnectHelper", "AppKit.getAccount(): $account")
                        if (account != null) {
                            address = account.address
                            if (address?.contains(":") == true) {
                                address = address.substringAfterLast(":")
                            }
                        }
                    }

                    if (!address.isNullOrEmpty()) {
                        Log.d("WalletConnectHelper", "Saving wallet address: $address")
                        WalletManager.getInstance(context).setWalletAddress(address)
                    } else {
                        Log.w("WalletConnectHelper", "Could not extract address, scheduling retry")
                        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                            try {
                                val account = AppKit.getAccount()
                                if (account != null) {
                                    var addr = account.address
                                    if (addr.contains(":")) addr = addr.substringAfterLast(":")
                                    Log.d("WalletConnectHelper", "Delayed address: $addr")
                                    WalletManager.getInstance(context).setWalletAddress(addr)
                                }
                            } catch (e: Exception) {
                                Log.e("WalletConnectHelper", "Delayed getAccount failed", e)
                            }
                        }, 1000)
                    }
                } catch (e: Exception) {
                    Log.e("WalletConnectHelper", "Error saving address in callback", e)
                }
                onConnectionStateChange?.invoke(true)
            }

            override fun onSessionRejected(rejectedSession: Modal.Model.RejectedSession) {
                Log.d("WalletConnectHelper", "Session Rejected")
            }

            override fun onSessionUpdate(updatedSession: Modal.Model.UpdatedSession) {
                Log.d("WalletConnectHelper", "Session Updated")
            }

            override fun onSessionEvent(sessionEvent: Modal.Model.SessionEvent) {
                Log.d("WalletConnectHelper", "Session Event: $sessionEvent")
            }

            override fun onSessionDelete(deletedSession: Modal.Model.DeletedSession) {
                Log.d("WalletConnectHelper", "Session Deleted")
                sessionTopic = null
                onConnectionStateChange?.invoke(false)
            }

            override fun onSessionRequestResponse(response: Modal.Model.SessionRequestResponse) {
                Log.d("WalletConnectHelper", "Session Request Response: $response")
                when (response.result) {
                    is Modal.Model.JsonRpcResponse.JsonRpcResult -> {
                        val result = (response.result as Modal.Model.JsonRpcResponse.JsonRpcResult).result
                        Log.d("WalletConnectHelper", "Transaction success: $result")
                        onTransactionResponse?.onResponse(true, result.toString())
                    }
                    is Modal.Model.JsonRpcResponse.JsonRpcError -> {
                        val error = (response.result as Modal.Model.JsonRpcResponse.JsonRpcError)
                        Log.e("WalletConnectHelper", "Transaction error: ${error.message}")
                        onTransactionResponse?.onResponse(false, error.message)
                    }
                }
            }

            override fun onConnectionStateChange(state: Modal.Model.ConnectionState) {
                Log.d("WalletConnectHelper", "Connection State: $state")
            }

            override fun onProposalExpired(proposal: Modal.Model.ExpiredProposal) {
                Log.d("WalletConnectHelper", "Proposal Expired")
            }

            override fun onRequestExpired(request: Modal.Model.ExpiredRequest) {
                Log.d("WalletConnectHelper", "Request Expired")
            }

            override fun onSessionExtend(session: Modal.Model.Session) {
                Log.d("WalletConnectHelper", "Session Extended")
            }

            override fun onError(error: Modal.Model.Error) {
                Log.e("WalletConnectHelper", "Delegate error: ${error.throwable}")
            }
        }

        try {
            AppKit.setDelegate(delegate)
        } catch (e: Exception) {
            Log.e("WalletConnectHelper", "Failed to set delegate", e)
        }
    }

    fun setConnectionListener(listener: (Boolean) -> Unit) {
        onConnectionStateChange = listener
    }

    fun setTransactionResponseListener(listener: TransactionListener) {
        onTransactionResponse = listener
    }

    /**
     * Opens the AppKit modal (formerly Web3Modal).
     */
    fun connect(fragmentManager: FragmentManager) {
        try {
            val sheet = AppKitSheet()
            sheet.show(fragmentManager, "AppKit")
        } catch (e: Exception) {
            Log.e("WalletConnectHelper", "Error opening modal", e)
        }
    }

    fun getSessionAddress(): String? {
        return AppKit.getAccount()?.address
    }

    fun disconnect() {
        AppKit.disconnect(
            onSuccess = { Log.d("WalletConnectHelper", "Disconnected") },
            onError = { error: Throwable -> Log.e("WalletConnectHelper", "Disconnect error", error) }
        )
    }

    /**
     * Send an ERC-20 token transfer via the WalletConnect session.
     * MetaMask will receive the request and prompt the user to sign.
     */
    @JvmOverloads
    fun sendTransaction(toAddress: String, data: String, value: String = "0x0") {
        Log.e("WalletConnectHelper", "sendTransaction: Not implemented yet due to SDK version mismatch")
        onTransactionResponse?.onResponse(false, "Feature under construction")
        
        /*
        // Code commented out until AppKit API is verified
        val topic = sessionTopic
        if (topic == null) {
            // ...
        }
        ...
        */
    }


    companion object {
        @JvmStatic
        fun disconnect(onSuccess: () -> Unit, onError: (Throwable) -> Unit) {
            AppKit.disconnect(onSuccess, onError)
        }

        @JvmStatic
        fun getAddress(): String? {
            return AppKit.getAccount()?.address
        }
    }
}
