package com.example.credilabmobile

import android.app.Application
import com.walletconnect.android.Core
import com.walletconnect.android.CoreClient
import com.walletconnect.android.relay.ConnectionType
import com.walletconnect.web3.modal.client.Modal
import com.walletconnect.web3.modal.client.Web3Modal

class CrediLabApp : Application() {
    override fun onCreate() {
        super.onCreate()

        val projectId = Constants.WALLETCONNECT_PROJECT_ID
        // In recent versions, explicitly construct the relay URL
        val relayUrl = "wss://relay.walletconnect.com?projectId=$projectId"
        val connectionType = ConnectionType.AUTOMATIC
        
        val appMetaData = Core.Model.AppMetaData(
            name = "CrediLab",
            description = "CrediLab Wallet App",
            url = "https://walletconnect.com", // Must be a valid, live URL to avoid validation errors
            icons = listOf("https://avatars.githubusercontent.com/u/37784886"), // Generic valid icon
            redirect = "credilab://request"
        )

        CoreClient.initialize(
            metaData = appMetaData,
            relayServerUrl = relayUrl,
            connectionType = connectionType,
            application = this,
            onError = { error ->
                android.util.Log.e("CrediLabApp", "CoreClient error: ${error.throwable.stackTraceToString()}")
            }
        )

        // Web3Modal V2 / AppKit often uses 'presets' or just Chain objects
        // Assuming Modal.Model.Token constructor is standard for v1.5.0
        val token = Modal.Model.Token(name = "Ether", symbol = "ETH", decimal = 18)
        
        val sepolia = Modal.Model.Chain(
            chainName = "Sepolia",
            chainNamespace = "eip155",
            chainReference = "11155111",
            requiredMethods = listOf("eth_sendTransaction", "personal_sign"),
            optionalMethods = listOf("eth_accounts"), // optional
            events = listOf("chainChanged", "accountsChanged"),
            token = token,
            rpcUrl = Constants.SEPOLIA_RPC_URL,
            blockExplorerUrl = "https://sepolia.etherscan.io"
        )
        
        Log.d("CrediLabApp", "Initializing Web3Modal...")
        Web3Modal.initialize(
            init = Modal.Params.Init(core = CoreClient),
            onSuccess = {
                Log.d("CrediLabApp", "Web3Modal Initialized Successfully") // Added logging
                try {
                     // Check if setChains expects varargs or list
                     Web3Modal.setChains(listOf(sepolia))
                } catch (e: Exception) {
                     android.util.Log.w("CrediLabApp", "setChains exception: ${e.message}")
                }
            },
            onError = { error ->
                Log.e("CrediLabApp", "Web3Modal Initialization Error: ${error.throwable.message}") // Changed logging
            }
        )
    }
}
