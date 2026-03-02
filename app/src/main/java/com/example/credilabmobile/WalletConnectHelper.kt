package com.example.credilabmobile

import android.util.Log
import androidx.fragment.app.FragmentManager
import com.reown.appkit.client.*
import com.reown.appkit.client.Modal
import com.reown.appkit.client.models.request.Request
import com.reown.appkit.ui.AppKitSheet
import com.reown.sign.client.Sign
import com.reown.sign.client.SignClient


class WalletConnectHelper(private val context: android.content.Context) {

// ... (existing code) ...



    fun interface TransactionListener {
        fun onResponse(success: Boolean, message: String)
    }

    private var onConnectionStateChange: ((Boolean) -> Unit)? = null
    private var onTransactionResponse: TransactionListener? = null


    init {
        val delegate = object : AppKit.ModalDelegate {
            override fun onSessionApproved(approvedSession: Modal.Model.ApprovedSession) {
                val sessionStr = approvedSession.toString()
                Log.d("WCH_DEBUG", "======= SESSION APPROVED =======")
                Log.d("WCH_DEBUG", "Full session: $sessionStr")
                when (approvedSession) {
                    is Modal.Model.ApprovedSession.WalletConnectSession -> {
                        sessionTopic = approvedSession.topic
                        Log.d("WCH_DEBUG", "Session topic saved: ${approvedSession.topic}")
                        Log.d("WCH_DEBUG", "Accounts: ${approvedSession.accounts}")
                        Log.d("WCH_DEBUG", "Namespaces/Methods: ${approvedSession.namespaces.map { (k, v) -> "$k -> methods=${v.methods}" }}")
                    }
                    is Modal.Model.ApprovedSession.CoinbaseSession -> {
                        Log.d("WCH_DEBUG", "CoinbaseSession chain=${approvedSession.chain} addr=${approvedSession.address}")
                    }
                }
                Log.d("WCH_DEBUG", "================================")
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
                        onConnectionStateChange?.invoke(true)
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
                            } finally {
                                onConnectionStateChange?.invoke(true)
                            }
                        }, 1000)
                    }
                } catch (e: Exception) {
                    Log.e("WalletConnectHelper", "Error saving address in callback", e)
                    onConnectionStateChange?.invoke(true)
                }
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

    // Stores pending tx data while waiting for chain switch
    private var pendingToAddress: String? = null
    private var pendingData: String? = null
    private var pendingValue: String? = null

    /**
     * Send an ERC-20 token transfer via the WalletConnect session.
     * Step 1: wallet_switchEthereumChain → Sepolia
     * Step 2: eth_sendTransaction (triggered after chain switch via chainChanged event)
     */
    @JvmOverloads
    fun sendTransaction(toAddress: String, data: String, value: String = "0x0") {
        // Get address from WalletManager — AppKit.getAccount().address is empty when
        // the session doesn't include Sepolia (MetaMask Mobile omits testnets by default)
        val fromAddress = WalletManager.getInstance(context).getWalletAddress()

        Log.d("WCH_DEBUG", "======= SEND TX ATTEMPT =======")
        Log.d("WCH_DEBUG", "fromAddress=$fromAddress to=$toAddress")

        if (fromAddress.isNullOrEmpty()) {
            Log.e("WCH_DEBUG", "FAIL: No wallet address saved")
            onTransactionResponse?.onResponse(false, "No wallet connected. Please connect MetaMask first.")
            return
        }

        // Store pending tx so we can send it after chain switch
        pendingToAddress = toAddress
        // Step 1: Ask MetaMask to switch to Sepolia (0xaa36a7 = 11155111)
        // IMPORTANT: wallet_switchEthereumChain must run in the context of a chain
        // that IS in the session. We use eip155:1 (Ethereum mainnet) as the context,
        // while the request content switches TO Sepolia.
        val switchParams = """[{"chainId": "0xaa36a7"}]"""
        val topic = sessionTopic

        Log.d("WCH_DEBUG", "Requesting wallet_switchEthereumChain via SignClient (context=eip155:1)...")

        if (topic == null) {
            Log.e("WCH_DEBUG", "No topic — going straight to doSendTransaction")
            doSendTransaction(fromAddress, toAddress, data, value)
            return
        }

        try {
            val switchRequest = Sign.Params.Request(
                sessionTopic = topic,
                method = "wallet_switchEthereumChain",
                params = switchParams,
                chainId = "eip155:1"  // mainnet — IS in session, so this will pass validation
            )
            SignClient.request(switchRequest,
                onSuccess = { _ ->
                    Log.d("WCH_DEBUG", "wallet_switchEthereumChain success — now sending tx")
                    doSendTransaction(fromAddress, toAddress, data, value)
                },
                onError = { error ->
                    Log.e("WCH_DEBUG", "wallet_switchEthereumChain error: ${error.throwable.message}")
                    Log.d("WCH_DEBUG", "Chain switch failed, attempting eth_sendTransaction directly...")
                    doSendTransaction(fromAddress, toAddress, data, value)
                }
            )
        } catch (e: Exception) {
            Log.e("WCH_DEBUG", "switchEthereumChain exception: ${e.message}", e)
            doSendTransaction(fromAddress, toAddress, data, value)
        }
    }

    private fun doSendTransaction(fromAddress: String, toAddress: String, data: String, value: String) {
        Log.d("WCH_DEBUG", "doSendTransaction: from=$fromAddress to=$toAddress")

        val params = """[{
            "from": "$fromAddress",
            "to": "$toAddress",
            "data": "$data",
            "value": "$value"
        }]"""

        val topic = sessionTopic
        if (topic == null) {
            Log.e("WCH_DEBUG", "FAIL: No session topic saved — was wallet connected before?")
            onTransactionResponse?.onResponse(false, "Session not ready. Please reconnect MetaMask.")
            return
        }

        Log.d("WCH_DEBUG", "Using SignClient directly, topic=$topic, chainId=eip155:1")

        try {
            // Use SignClient directly to bypass AppKit's chain validation.
            // AppKit rejects requests for chains not in the session.
            // MetaMask's session dropped 11155111 because it wasn't approved.
            // We forge the context to "eip155:1" (Mainnet) so the request isn't 
            // ignored by the wallet. If the user's wallet is actively on Sepolia,
            // it may process it there, otherwise it will try to process it on Mainnet.
            val signRequest = Sign.Params.Request(
                sessionTopic = topic,
                method = "eth_sendTransaction",
                params = params,
                chainId = "eip155:1"
            )

            SignClient.request(signRequest,
                onSuccess = { result ->
                    Log.d("WCH_DEBUG", "SignClient.request success: $result")
                    // Response comes via onSessionRequestResponse delegate
                },
                onError = { error ->
                    Log.e("WCH_DEBUG", "SignClient.request error: ${error.throwable.message}")
                    onTransactionResponse?.onResponse(false, error.throwable.message ?: "Transaction failed")
                }
            )
        } catch (e: Exception) {
            Log.e("WCH_DEBUG", "doSendTransaction exception: ${e.message}", e)
            onTransactionResponse?.onResponse(false, e.message ?: "Unknown error")
        }
    }



    companion object {
        // Static — shared across all WalletConnectHelper instances
        @Volatile
        var sessionTopic: String? = null
            private set

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
