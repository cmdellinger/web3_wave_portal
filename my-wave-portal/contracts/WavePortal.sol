// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint) public waveCounts;
    address[] waverAddresses;

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Wave[] waves;

    constructor() payable {
        console.log("In the end, I will say hi!");
    }

    function wave(string memory _message) public {
        // increment total waves
        totalWaves += 1;
        // check if the sender has waved and add to
        // waver addresses if not
        if (waveCounts[msg.sender] == 0){
            waverAddresses.push(msg.sender);
        }
        // keep track of how many times waver has waved
        waveCounts[msg.sender] += 1;

        if (bytes(_message).length != bytes("").length ) {
            waves.push(Wave(msg.sender, _message, block.timestamp));
        }
        console.log("%s has waved!", msg.sender);

        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prizeAmount = 0.0001 ether;
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        require(success, "Failed to withdraw money from contract.");
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getWaverAddresses() public view returns (address [] memory){
        console.log("Retreiving WaverAddresses:");
        return waverAddresses;
    }

    function getWaverCount(address _address) public view returns (uint256){
        console.log("Address %s has waved %d times!", _address, waveCounts[_address]);
        return waveCounts[_address];
    }

}