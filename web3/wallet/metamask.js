/**
 * MetaMask Wallet Connection
 *
 * Handles MetaMask wallet linking for CLB token transfers on Sepolia testnet.
 * Used by ProfilePage to connect wallets and by the reward system to send CLB.
 *
 * Exports:
 *   connectMetaMask()      → prompts user, returns wallet address
 *   onWalletChange(cb)     → listens for account switches
 *   getCurrentWallet()     → silent check, no prompt
 *   ensureSepoliaNetwork() → auto-switch to Sepolia testnet
 */

// Sepolia Testnet configuration
const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in decimal
const SEPOLIA_NETWORK = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Testnet',
  rpcUrls: ['https://sepolia.infura.io/v3/', 'https://rpc.sepolia.org'],
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18
  },
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

/**
 * Ensure user is connected to Sepolia testnet.
 * If on wrong network, prompts user to switch.
 * @returns {Promise<boolean>} True if on Sepolia, false otherwise
 */
export async function ensureSepoliaNetwork() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

    // Already on Sepolia
    if (chainId === SEPOLIA_CHAIN_ID) {
      return true;
    }

    // Try to switch to Sepolia
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      return true;
    } catch (switchError) {
      // Network doesn't exist in MetaMask, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_NETWORK]
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          throw new Error('Please add Sepolia testnet to MetaMask manually');
        }
      }

      // User rejected the switch
      if (switchError.code === 4001) {
        throw new Error('Please switch to Sepolia testnet in MetaMask');
      }

      throw switchError;
    }
  } catch (error) {
    console.error('Network check failed:', error);
    throw error;
  }
}

/**
 * Connect MetaMask wallet and return the selected account address.
 * Ensures user is on Sepolia testnet before connecting.
 * @returns {Promise<string>} The connected wallet address
 */
export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install it from metamask.io');
  }

  // First, ensure user is on Sepolia
  try {
    await ensureSepoliaNetwork();
  } catch (networkError) {
    throw new Error(`Network error: ${networkError.message}`);
  }

  // Then request account access
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
