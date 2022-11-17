import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";


describe("[Challenge] Sourcecode", function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const SetupFactory = await ethers.getContractFactory(
            "SetupSourcecode",
            deployer
        );

        const ChallengeFactory = await ethers.getContractFactory(
            "Challenge",
            deployer
        );
        this.setup = await SetupFactory.deploy();
        this.challenge = await ChallengeFactory.attach(await this.setup.challenge());

        expect(await this.setup.isSolved()).to.equal(false);
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        let code = '0x7f80607f60005360015260215260416000f36d000000000000000000000000000080607f60005360015260215260416000f36d0000000000000000000000000000';
        /*const ExploitFactory = await ethers.getContractFactory(
            "ExploitSourcecode",
            deployer
        );
        this.exploit = await ExploitFactory.deploy(code);*/
        await this.challenge.solve(code);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await this.setup.isSolved()).to.equal(true);
    });
});