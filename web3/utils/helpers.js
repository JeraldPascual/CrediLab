/**
 * Web3 Utility Helpers
 *
 * Purpose: Shared helpers for Ethereum/web3 operations.
 * Owner: Student B
 *
 * Status: Scaffold — Student B will expand or revise as needed
 */

/**
 * Generate a SHA-256 hash of a string (for code hash verification).
 * Uses the Web Crypto API (no extra dependencies needed).
 * @param {string} text - The text to hash
 * @returns {Promise<string>} The hex-encoded SHA-256 hash
 */
export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Shorten a wallet address for display (e.g., 0x1234...abcd).
 * @param {string} address - Full wallet address
 * @param {number} chars - Number of characters to show on each side (default: 4)
 * @returns {string} Shortened address
 */
export function shortenAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Check if MetaMask (or any Ethereum provider) is available in the browser.
 * @returns {boolean}
 */
export function isWeb3Available() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}
