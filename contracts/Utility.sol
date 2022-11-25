pragma solidity 0.8.16;


contract Utility {
    function getCode(address addr) external view returns (bytes memory) {
    	return addr.code;
    }

    function getCodeHash(address addr) external view returns (bytes32)  {
    	return addr.codehash;
    }
}