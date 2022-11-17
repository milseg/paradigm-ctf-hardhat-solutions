import { Contract } from "@ethersproject/contracts";
// We require the Hardhat Runtime Environment explicitly here. This is optional but useful for running the
// script in a standalone fashion through `node <script>`. When running the script with `hardhat run <script>`,
// you'll find the Hardhat Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

import { CustomERC721__factory, ERC721Store__factory, ERC721ShopStake__factory } from "../typechain";

async function main(): Promise<void> {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);  

  const ERC721Store: ERC721Store__factory = await ethers.getContractFactory("ERC721Store");
  let erc721StoreContract: Contract = await ERC721Store.deploy();
  erc721StoreContract = await erc721StoreContract.deployed();
  console.log("ERC721Store deployed to: ", erc721StoreContract.address);


  const ERC721ShopStake: ERC721ShopStake__factory = await ethers.getContractFactory("ERC721ShopStake");
  let erc721ShopStakeContract = await ERC721ShopStake.deploy(erc721StoreContract.address);
  erc721ShopStakeContract = await erc721ShopStakeContract.deployed();
  console.log("ERC721ShopStake deployed to: ", erc721ShopStakeContract.address);

  //await erc721StoreContract.createERC721("Test Token", "TT");
  //const tokenAddress = await erc721StoreContract.ownerContracts(deployer.address, 0);
  //console.log("CustomERC721 deployed to: ", tokenAddress);
}

// We recommend this pattern to be able to use async/await everywhere and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
