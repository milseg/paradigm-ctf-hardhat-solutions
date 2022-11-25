import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";

async function pause(timeout: number) {
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            resolve();
        }, timeout);
    });
}

describe("[Challenge] Trapdooor", function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        this.utility = await (await ethers.getContractFactory(
            "Utility",
            deployer
        )).deploy();

        this.factorizer = await (await ethers.getContractFactory(
            "Factorizer",
            deployer
        )).deploy();


        const SetupFactory = await ethers.getContractFactory(
            "ScriptTrapdooor",
            deployer
        );
        this.challenge = await SetupFactory.deploy();

        expect(await this.challenge.isSolved()).to.equal(false);
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        let primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127];
        let indexA = Math.floor(Math.random()*primes.length) - 1;
        await pause(1000);
        let indexB = Math.floor(Math.random()*primes.length) - 1;
        let n = primes[indexA]*primes[indexB];
        let code = await this.utility.getCode(this.factorizer.address)
        console.log("factorizer code", code)
        console.log("number", n)
        await this.challenge.run(n, code);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await this.challenge.isSolved()).to.equal(true);
    });
});