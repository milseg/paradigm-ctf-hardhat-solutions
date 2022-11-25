pragma solidity 0.8.16;


contract Factorizer {
	
    function factorize(uint n) external pure returns (uint, uint) {
    	uint64[31] memory factors = [uint64(2), 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127];
    	for(uint i = 0; i < factors.length; i++) {
  			if(n%factors[i] == 0) {
  				return (factors[i], n/factors[i]);
  			}
    	}
    	revert("invalid number");
    }
}