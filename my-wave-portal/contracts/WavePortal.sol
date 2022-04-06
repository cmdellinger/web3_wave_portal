// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;
    mapping(address => uint) public waveCounts;
    address[] waverAddresses;

    constructor() {
        console.log("In the end, I will say hi!");
    }

    function wave() public {
        // increment total waves
        totalWaves += 1;
        // check if the sender has waved and add to
        // waver addresses if not
        if (waveCounts[msg.sender] == 0){
            waverAddresses.push(msg.sender);
        }
        // keep track of how many times waver has waved
        waveCounts[msg.sender] += 1;

        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
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