/**
 * WalletConnect Integration (Mobile)
 *
 * Purpose: Connect mobile wallet via WalletConnect QR code.
 * Network: Ethereum Sepolia Testnet
 * Owner: Student B
 *
 * Status: Scaffold — Student B will implement
 *
 * NOTE TO STUDENT B:
 * WalletConnect v2 requires a Project ID from https://cloud.walletconnect.com (free).
 * You'll need to decide on the library (@walletconnect/modal, @web3modal/ethers, etc.)
 * This file is a placeholder for you to build on.
 */

// TODO: Student B — Implement WalletConnect integration
// Key steps:
// 1. Register at https://cloud.walletconnect.com for a free Project ID
// 2. Choose library: @walletconnect/modal or @web3modal/ethers
// 3. Implement connectWalletConnect() that returns a wallet address
// 4. Handle session persistence (user shouldn't have to reconnect every time)

/**
 * Connect mobile wallet via WalletConnect.
 * @returns {Promise<string>} The connected wallet address
 */
export async function connectWalletConnect() {
  // TODO: Student B will implement
  throw new Error('WalletConnect not yet implemented — Student B will set this up');
}

/**
 * Disconnect the WalletConnect session.
 */
export async function disconnectWalletConnect() {
  // TODO: Student B will implement
  throw new Error('WalletConnect not yet implemented — Student B will set this up');
}
