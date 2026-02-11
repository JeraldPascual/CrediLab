package com.example.credilabmobile

import androidx.fragment.app.FragmentManager
import com.walletconnect.web3.modal.client.Modal
import com.walletconnect.web3.modal.client.Web3Modal
import com.walletconnect.web3.modal.ui.Web3ModalSheet

class WalletConnectHelper {

    private var onConnectionStateChange: ((Boolean) -> Unit)? = null



    init {
        // Initialize Delegate to listen for session events
        // Trying Web3Modal.ModalDelegate if available, or just check documentation structure
        // In recent versions, it might be Web3Modal.setDelegate(...)
        
        // The error said "Web3Modal.ModalDelegate was expected", so it must exist on Web3Modal class.
        val delegate = object : Web3Modal.ModalDelegate {
            override fun onSessionApproved(approvedSession: Modal.Model.ApprovedSession) {
                // approvedSession might not have .topic directly. 
                // It usually has .topic or .session.topic
                // Let's print the object to debug if we can't find property.
                // Or try approvedSession.topic if available (it should be).
                // "Unresolved reference: topic" suggests it might be named differently or inside a nested object.
                // Trying approvedSession.sessionTopic just in case, or just logging the object.
                android.util.Log.d("WalletConnectHelper", "Session Approved: $approvedSession")
                onConnectionStateChange?.invoke(true)
            }

            override fun onSessionRejected(rejectedSession: Modal.Model.RejectedSession) {
                 android.util.Log.d("WalletConnectHelper", "Session Rejected")
            }

            override fun onSessionUpdate(updatedSession: Modal.Model.UpdatedSession) {
                // handle update
            }

            override fun onSessionEvent(sessionEvent: Modal.Model.SessionEvent) {
                // handle event
            }

            override fun onSessionDelete(deletedSession: Modal.Model.DeletedSession) {
                 android.util.Log.d("WalletConnectHelper", "Session Deleted")
                 onConnectionStateChange?.invoke(false)
            }

            override fun onSessionRequestResponse(response: Modal.Model.SessionRequestResponse) {
                // Handle response
            }
            
            override fun onConnectionStateChange(state: Modal.Model.ConnectionState) {
                android.util.Log.d("WalletConnectHelper", "Connection State: $state")
            }
            
            override fun onProposalExpired(proposal: Modal.Model.ExpiredProposal) {
                android.util.Log.d("WalletConnectHelper", "Proposal Expired")
            }

            override fun onRequestExpired(request: Modal.Model.ExpiredRequest) {
                android.util.Log.d("WalletConnectHelper", "Request Expired")
            }
            
            override fun onSessionExtend(session: Modal.Model.Session) {
                android.util.Log.d("WalletConnectHelper", "Session Extended")
            }
            
            override fun onError(error: Modal.Model.Error) {
                 android.util.Log.e("WalletConnectHelper", "Delegate error: ${error.throwable}")
            }
        }

        try {
             Web3Modal.setDelegate(delegate)
        } catch (e: Exception) {
             android.util.Log.e("WalletConnectHelper", "Failed to set delegate", e)
        }
    }

    fun setConnectionListener(listener: (Boolean) -> Unit) {
        onConnectionStateChange = listener
    }

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
