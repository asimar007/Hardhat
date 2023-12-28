// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 <0.9.0;

import "hardhat/console.sol";

contract Token {
    // Token details
    string public name = "Hardhat Token";
    string public symbol = "HHT";
    uint256 public totalSupply = 10000;
    address public owner;

    // Mapping to store balances of token holders
    mapping(address => uint256) balances;

    // Constructor to initialize the contract
    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // Transfer function with debugging logs
    function transferA(address to, uint256 amount) external {
        // Log sender's balance before the transfer
        console.log("** Sender Balance is %s Token **", balances[msg.sender]);
        // Log the transfer details
        console.log(
            "** Sender is sending %s Token to %s address **",
            amount,
            to
        );
        // Check if the sender has enough tokens to transfer
        require(balances[msg.sender] >= amount, "Not Enough Token");
        // Update balances after the transfer
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    // Function to get the balance of a specific account
    function Balanceof(address account) external view returns (uint256) {
        return balances[account];
    }
}
