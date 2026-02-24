# Web3 / Blockchain Layer

## Architecture

```
web3/
├── contracts/
│   └── clbToken.js      # CrediLabSystem ERC20+ERC1155 contract interface (ethers.js)
├── wallet/
│   └── metamask.js       # MetaMask connection, Sepolia auto-switch, account listener
├── utils/
│   └── helpers.js        # sha256, shortenAddress, isWeb3Available
└── README.md
```

## Smart Contract

- **Contract:** CrediLabSystem (hybrid ERC20 + ERC1155)
- **Address:** `0xBFDB5f0C96aA9E2eECA9303E71a2b28b7C09Aee4`
- **Network:** Ethereum Sepolia Testnet
- **ERC20 (CLB):** Fungible token awarded for challenge completion
- **ERC1155 (Badges):** Soulbound badges (ID 1-99), transferable frames (ID 100+)

## Integration Points

| Consumer | Function | Purpose |
|---|---|---|
| `ProfilePage.jsx` | `connectMetaMask()`, `getCLBBalance()` | Wallet linking + balance display |
| `api/reward-student.js` | `sendCLBOnChain()` (server-side) | Auto-transfer CLB on challenge completion |
| `api/claim-tokens.js` | `sendCLBOnChain()` (server-side) | Cash out Firestore credits → on-chain |
| `ActivitiesView.jsx` | `shortenAddress()` | Display wallet address |

## Security

- Private key is **NEVER** loaded in frontend code
- System wallet transfers run only in Vercel serverless functions (`api/`)
- Frontend functions are read-only (`getCLBBalance`, `getContractInfo`) or user-signed (`transferCLBWithMetaMask`)

## Dependencies

- `ethers` ^6.16.0 — Ethereum interaction library
- `vite-plugin-node-polyfills` — Buffer/crypto polyfills for browser
