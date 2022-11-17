// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.15;

import "./Random.sol";

contract SetupRandom {

    Random public random;

    constructor() {
        random = new Random();
    }

    function isSolved() public view returns (bool) {
        return random.solved();
    }
}
