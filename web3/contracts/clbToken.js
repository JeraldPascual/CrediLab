/**
 * CLB Token Contract Interaction Layer
 *
 * Purpose: Interface with the CLB ERC-20 token deployed on Sepolia testnet.
 * Owner: Student A (Web App) - integrates with Student B's deployed contract
 *
 * Security Notes:
 * - getCLBBalance() is frontend-safe (read-only, no private key needed)
 * - transferCLB() MUST only run on backend (requires system wallet private key)
 * - NEVER expose VITE_SYSTEM_WALLET_PRIVATE_KEY to frontend code
 */

import { ethers } from 'ethers';

// Standard ERC-20 ABI (only the functions we need)
const CLB_ABI = [
  // Read functions (frontend-safe)
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",

  // Write functions (backend-only, requires private key)
  "function transfer(address to, uint256 amount) returns (bool)",

  // Events (for monitoring)
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Environment variables (from .env)
const CONTRACT_ADDRESS = import.meta.env.VITE_CLB_CONTRACT_ADDRESS;
const SEPOLIA_RPC = import.meta.env.VITE_SEPOLIA_RPC_URL;
const SYSTEM_WALLET_PRIVATE_KEY = import.meta.env.VITE_SYSTEM_WALLET_PRIVATE_KEY; // Backend only!

/**
 * Get CLB token balance for a wallet address (FRONTEND SAFE - READ ONLY)
 * @param {string} walletAddress - The Ethereum address to check
 * @returns {Promise<string>} Balance in CLB (formatted, e.g., "50.0")
 */
export async function getCLBBalance(walletAddress) {
  try {
    // Validate inputs
    if (!CONTRACT_ADDRESS) {
      throw new Error('CLB contract address not configured. Check .env');
    }
    if (!SEPOLIA_RPC) {
      throw new Error('Sepolia RPC URL not configured. Check .env');
    }
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      throw new Error('Invalid wallet address');
    }

    // Create read-only provider (no private key needed)
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

    // Create contract instance (read-only)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CLB_ABI, provider);

    // Query balance (returns BigNumber)
    const balanceWei = await contract.balanceOf(walletAddress);

    // Convert from wei to CLB (18 decimals)
    const balanceCLB = ethers.formatEther(balanceWei);

    return balanceCLB;
  } catch (error) {
    console.error('Error fetching CLB balance:', error);
    throw new Error(`Failed to fetch CLB balance: ${error.message}`);
  }
}

/**
 * Transfer CLB tokens using MetaMask (FRONTEND - USER SIGNS TRANSACTION)
 * @param {string} toAddress - Recipient wallet address
 * @param {number} amount - Amount in CLB (will be converted to wei)
 * @returns {Promise<object>} Transaction receipt {hash, blockNumber, from, to, amount}
 */
export async function transferCLBWithMetaMask(toAddress, amount) {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask not detected. Please install MetaMask.');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('CLB contract address not configured');
    }

    if (!ethers.isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }

    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Create provider from MetaMask
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Create contract instance with signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CLB_ABI, signer);

    // Convert amount to wei (18 decimals)
    const amountWei = ethers.parseEther(amount.toString());

    // Send transaction (MetaMask will prompt user to sign)
    console.log(`Initiating CLB transfer: ${amount} CLB to ${toAddress}`);
    const tx = await contract.transfer(toAddress, amountWei);

    console.log(`Transaction sent: ${tx.hash}`);
    console.log('Waiting for confirmation...');

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    return {
      hash: receipt.hash,
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: toAddress,
      amount: amount,
      status: receipt.status === 1 ? 'success' : 'failed'
    };
  } catch (error) {
    console.error('Error transferring CLB with MetaMask:', error);

    // Handle specific errors
    if (error.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected by user');
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('Insufficient CLB balance');
    } else {
      throw new Error(`Transfer failed: ${error.message}`);
    }
  }
}

/**
 * Get system wallet CLB balance (for displaying pool remaining)
 * @returns {Promise<string>} System wallet balance in CLB
 */
export async function getSystemPoolBalance() {
  const systemWalletAddress = import.meta.env.VITE_SYSTEM_WALLET_ADDRESS;

  if (!systemWalletAddress) {
    throw new Error('System wallet address not configured');
  }

  return getCLBBalance(systemWalletAddress);
}

/**
 * Transfer CLB tokens from system wallet to student wallet
 * ⚠️ BACKEND ONLY - This function requires private key access
 * ⚠️ NEVER call this from frontend code
 *
 * @param {string} toAddress - Recipient wallet address
 * @param {number} amount - Amount of CLB to transfer (e.g., 50)
 * @returns {Promise<Object>} Transaction details { hash, from, to, amount }
 */
export async function transferCLB(toAddress, amount) {
  try {
    // Validate this is running in backend environment
    if (typeof window !== 'undefined') {
      throw new Error('SECURITY VIOLATION: transferCLB() called from frontend. This function must only run on backend.');
    }

    // Validate inputs
    if (!CONTRACT_ADDRESS || !SEPOLIA_RPC || !SYSTEM_WALLET_PRIVATE_KEY) {
      throw new Error('Blockchain configuration incomplete. Check environment variables.');
    }
    if (!toAddress || !ethers.isAddress(toAddress)) {
      throw new Error('Invalid recipient address');
    }
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount. Must be positive number.');
    }

    // Create provider
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);

    // Create wallet (signs transactions)
    const wallet = new ethers.Wallet(SYSTEM_WALLET_PRIVATE_KEY, provider);

    // Create contract instance with signer
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CLB_ABI, wallet);

    // Convert amount to wei (18 decimals)
    const amountWei = ethers.parseEther(amount.toString());

    // Send transaction
    console.log(`[CLB Transfer] Sending ${amount} CLB to ${toAddress}...`);
    const tx = await contract.transfer(toAddress, amountWei);

    // Wait for confirmation
    console.log(`[CLB Transfer] Transaction sent: ${tx.hash}. Waiting for confirmation...`);
    const receipt = await tx.wait();

    console.log(`[CLB Transfer] Confirmed in block ${receipt.blockNumber}`);

    return {
      hash: tx.hash,
      from: wallet.address,
      to: toAddress,
      amount: amount,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'success' : 'failed'
    };
  } catch (error) {
    console.error('Error transferring CLB:', error);

    // Parse common errors
    if (error.code === 'INSUFFICIENT_FUNDS') {
      throw new Error('System wallet has insufficient ETH for gas fees');
    }
    if (error.message?.includes('insufficient balance')) {
      throw new Error('System wallet has insufficient CLB tokens');
    }

    throw new Error(`CLB transfer failed: ${error.message}`);
  }
}

/**
 * Get contract metadata (for debugging/verification)
 * @returns {Promise<Object>} Contract info { name, symbol, decimals, totalSupply }
 */
export async function getContractInfo() {
  try {
    if (!CONTRACT_ADDRESS || !SEPOLIA_RPC) {
      throw new Error('Contract not configured');
    }

    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CLB_ABI, provider);

    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);

    return {
      address: CONTRACT_ADDRESS,
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: ethers.formatEther(totalSupply),
      network: 'Sepolia Testnet'
    };
  } catch (error) {
    console.error('Error fetching contract info:', error);
    throw error;
  }
}

/**
 * Validate blockchain configuration (useful for startup checks)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateConfig() {
  const errors = [];

  if (!CONTRACT_ADDRESS) {
    errors.push('VITE_CLB_CONTRACT_ADDRESS not set');
  } else if (!ethers.isAddress(CONTRACT_ADDRESS)) {
    errors.push('VITE_CLB_CONTRACT_ADDRESS is not a valid Ethereum address');
  }

  if (!SEPOLIA_RPC) {
    errors.push('VITE_SEPOLIA_RPC_URL not set');
  } else if (!SEPOLIA_RPC.startsWith('http')) {
    errors.push('VITE_SEPOLIA_RPC_URL must be a valid HTTP(S) URL');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
