/**
 * MetaMask Wallet Connection (Desktop)
 *
 * Purpose: Connect user's MetaMask wallet for credential verification.
 * Network: Ethereum Sepolia Testnet (zero gas costs)
 * Owner: Student B (integration with Student A's UI)
 *
 * Status: Scaffold — Student B will finalize implementation
 *
 * NOTE TO STUDENT B:
 * This is a starting point. Feel free to rewrite, reorganize, or replace entirely.
 * The key requirement is:
 * - connectMetaMask() returns a wallet address
 * - onWalletChange() fires when the user switches wallets
 */

/**
 * Connect MetaMask wallet and return the selected account address.
 * @returns {Promise<string>} The connected wallet address
 */
export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it from metamask.io');
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });

  return accounts[0];
}

/**
 * Listen for wallet account changes (e.g., user switches account in MetaMask).
 * @param {function} callback - Called with the new wallet address (or null if disconnected)
 */
export function onWalletChange(callback) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      callback(accounts[0] || null);
    });
  }
}

/**
 * Get the currently connected wallet address (without prompting).
 * @returns {Promise<string|null>} The connected address or null
 */
export async function getCurrentWallet() {
  if (!window.ethereum) return null;

  const accounts = await window.ethereum.request({
    method: 'eth_accounts'
  });

  return accounts[0] || null;
}
