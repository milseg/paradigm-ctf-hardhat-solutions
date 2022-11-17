// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;

contract DeployerCode {
    constructor() { }

    fallback() external payable{

    	assembly { 
    		mstore(0, extcodehash(address()))
    		return (0, 0x20)
    	}
    }
}