// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

// HYBRID CONTRACT: Money (ERC20) + Items (ERC1155)
contract CrediLabSystem is ERC20, ERC1155, Ownable {

    // --- CURRENCY LOGIC (CLB) ---
    constructor() ERC20("CrediLab Token", "CLB") ERC1155("https://credilab-placeholder-metadata.vercel.app/api/{id}.json") Ownable(msg.sender) {
        // Initial Supply: 10,000 CLB to the deployer (System Wallet)
        _mint(msg.sender, 10_000 * 10 ** decimals());
    }

    // Refill the Currency Pool
    function mintCurrency(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // --- GAMIFICATION LOGIC (BADGES/FRAMES) ---
    // ID 1-99: Badges (Soulbound - cannot transfer)
    // ID 100+: Frames/Titles (Transferable)

    mapping(uint256 => bool) public isSoulbound;

    function createBadgeType(uint256 id, bool soulbound) external onlyOwner {
        isSoulbound[id] = soulbound;
    }

    function awardBadge(address to, uint256 id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
    }

    // Override safeTransferFrom to enforce Soulbound logic
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public override {
        require(!isSoulbound[id], "CrediLab: This badge is Soulbound and cannot be transferred");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    // Override safeBatchTransferFrom
    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(!isSoulbound[ids[i]], "CrediLab: One of these items is Soulbound");
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}
