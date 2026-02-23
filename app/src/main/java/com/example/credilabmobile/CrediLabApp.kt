package com.example.credilabmobile

import android.app.Application
import android.util.Log
import com.reown.android.Core
import com.reown.android.CoreClient
import com.reown.android.relay.ConnectionType
import com.reown.appkit.client.AppKit
import com.reown.appkit.client.Modal

class CrediLabApp : Application() {
    override fun onCreate() {
        super.onCreate()
        Log.d("CrediLabApp", "========== APPLICATION onCreate START ==========")

        try {
            val projectId = Constants.WALLETCONNECT_PROJECT_ID
            Log.d("CrediLabApp", "ProjectId: $projectId")
            val connectionType = ConnectionType.AUTOMATIC

            val appMetaData = Core.Model.AppMetaData(
                name = "CrediLab",
                description = "CrediLab Wallet App",
                url = "https://credilab.app",
                icons = listOf("https://avatars.githubusercontent.com/u/37784886"),
                redirect = "credilab://request"
            )
            Log.d("CrediLabApp", "AppMetaData created successfully")

            Log.d("CrediLabApp", "Initializing CoreClient...")
            CoreClient.initialize(
                projectId = projectId,
                connectionType = connectionType,
                application = this,
                metaData = appMetaData,
                onError = { error ->
                    Log.e("CrediLabApp", "CoreClient error: ${error.throwable.stackTraceToString()}")
                }
            )
            Log.d("CrediLabApp", "CoreClient.initialize() called (async)")

            Log.d("CrediLabApp", "Initializing AppKit...")
            AppKit.initialize(
                init = Modal.Params.Init(core = CoreClient),
                onSuccess = {
                    Log.d("CrediLabApp", "AppKit Initialized Successfully")
                    try {
                        val token = Modal.Model.Token(name = "Ether", symbol = "ETH", decimal = 18)
                        val sepolia = Modal.Model.Chain(
                            chainName = "Sepolia",
                            chainNamespace = "eip155",
                            chainReference = "11155111",
                            requiredMethods = listOf("eth_sendTransaction", "personal_sign"),
                            optionalMethods = listOf("eth_accounts"),
                            events = listOf("chainChanged", "accountsChanged"),
                            token = token,
                            rpcUrl = Constants.SEPOLIA_RPC_URL,
                            blockExplorerUrl = "https://sepolia.etherscan.io"
                        )
                        AppKit.setChains(listOf(sepolia))
                        Log.d("CrediLabApp", "Chains set successfully")
                    } catch (e: Exception) {
                        Log.w("CrediLabApp", "setChains exception: ${e.message}", e)
                    }
                },
                onError = { error ->
                    Log.e("CrediLabApp", "AppKit Initialization Error: ${error.throwable.message}", error.throwable)
                }
            )
            Log.d("CrediLabApp", "AppKit.initialize() called (async)")
        } catch (e: Exception) {
            Log.e("CrediLabApp", "FATAL: Application onCreate crashed!", e)
        }

        Log.d("CrediLabApp", "========== APPLICATION onCreate END ==========")
    }
}
