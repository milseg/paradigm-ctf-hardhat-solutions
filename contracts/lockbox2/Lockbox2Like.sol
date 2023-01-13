// SPDX-License-Identifier: UNLICENSED
import "./Lockbox2.sol";
import "hardhat/console.sol";

pragma solidity 0.8.15;
/*Analysing gas usage*/
contract Lockbox2Like is Lockbox2 {
    function solve() override external {
        uint initialGas = gasleft();
        bool[] memory successes = new bool[](5);
        (successes[0],) = address(this).delegatecall(abi.encodePacked(this.stage1.selector, msg.data[4:]));
        (successes[1],) = address(this).delegatecall(abi.encodePacked(this.stage2.selector, msg.data[4:]));
        (successes[2],) = address(this).delegatecall(abi.encodePacked(this.stage3.selector, msg.data[4:]));
        (successes[3],) = address(this).delegatecall(abi.encodePacked(this.stage4.selector, msg.data[4:]));
        uint256 beforeStage5 = gasleft();
        (successes[4],) = address(this).delegatecall(abi.encodePacked(this.stage5.selector, msg.data[4:]));
        uint256 afterStage5 = gasleft();
        for (uint256 i = 0; i < 5; ++i) {/*require(successes[i]);*/}
        locked = false;
        uint256 finalGas = gasleft();
        uint256 gasSpentStage5 = beforeStage5 - afterStage5;
        uint256 totalGasSpent = initialGas - finalGas;
        uint256 gasSpentBeforeStage5 = initialGas - beforeStage5;
        uint256 gasSpentAfterStage5 = afterStage5 - finalGas;
        //console.log("initialGas %d :: gasSpentBeforeStage5 %d :: gasSpentStage5 %d :: gasSpentAfterStage5 %d", initialGas, gasSpentBeforeStage5, gasSpentStage5, gasSpentAfterStage5);
        console.log("initialGas %d - gasSpentBeforeStage5 %d - gasSpentStage5 %d", initialGas, gasSpentBeforeStage5, gasSpentStage5);
        console.log("gasSpentAfterStage5 %d", gasSpentAfterStage5);
    }
}
//gasLimit = gasSpentBeforeStage5 + x
// (63/64)*x < gasSpentStage5
// (1/64)*x >= gasSpentAfterStage5

//before optimization
//301838 + x
//(63/64)*x < 319068  --> x < 64*319068/63 --> x < 324132.5714285714
//x/64 >= 5964 --> x >= 381696 --> need to reduce gas after cost

//After optimization (access list)
//301838 + x
//(63/64)*x < 319068  --> x < 64*319068/63 --> x < 324132.5714285714
//x/64 >= 3964 --> x >= 253696 --> need to reduce gas after cost
//choose x=300000 --> gasLimit = 301838 + 300000 = 601838 + extra_initial_gas = 601838 + 24150 = 625988