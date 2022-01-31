//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    string public name = "My-hard-token";
    string public symbol = "MHT";
    uint public totalSupply  = 1000000;
    address public owner;
    mapping(address => uint) balances;

    constructor(){
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint amount) external {
        console.log("Sender blance if %s tokens", balances[msg.sender]);
        console.log("Trying to send %s tokens to %s", amount, to);

        require( balances[msg.sender] >= amount, "Not enoguhe tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns(uint){
        return balances[account];
    }
}