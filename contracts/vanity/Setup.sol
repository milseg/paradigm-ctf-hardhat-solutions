// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.7.6;

import "./Challenge.sol";

contract SetupVanity {
    ChallengeVanity public immutable challenge;

    constructor() {
        challenge = new ChallengeVanity();
    }

    function isSolved() external view returns (bool) {
        return challenge.bestScore() >= 16;
    }
}
