import { ethers } from "hardhat";
import { expect } from "chai";



describe("[Challenge] Vanity", function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        let challengeAbi = [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "signer",
                  "type": "address"
                },
                {
                  "internalType": "bytes",
                  "name": "signature",
                  "type": "bytes"
                }
              ],
              "name": "solve",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
        ];

        const SetupFactory = await ethers.getContractFactory(
            "SetupVanity",
            deployer
        );
        this.setup = await SetupFactory.deploy();
        this.challenge = new ethers.Contract(await this.setup.challenge(), challengeAbi, attacker);

        expect(await this.setup.isSolved()).to.equal(false);
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        
        const precompiledSha256 = '0x0000000000000000000000000000000000000002' //signer -- see https://ethereum.stackexchange.com/questions/15479/list-of-pre-compiled-contracts
        const sig = '0x8cf1a8bb'
        //1. Bruteforce valid signature with sha256 (scripts/vanityBruteForce.ts)
        //2. Call solve with bruteforced signature
        await this.challenge.solve(precompiledSha256, sig);
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(await this.setup.isSolved()).to.equal(true);
    });
});