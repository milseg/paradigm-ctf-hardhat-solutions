import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const chainIds = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3
};

// Ensure that we have all the environment variables we need.
const mnemonic = process.env.MNEMONIC;
const privateKey = process.env.PRIVATE_KEY;



const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
	    hardhat: {
	      allowUnlimitedContractSize: true,
	      initialBaseFeePerGas: 0,
	      gas: 30000000,
          gasPrice: 8000000000,
          blockGasLimit: 300000000,
          accounts: { mnemonic },
          forking: {
		      url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
		      blockNumber: 15596270
		  }
	    },
	    mumbai: {
	      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
	      accounts: {
	        count: 10,
		    initialIndex: 0,
		    mnemonic,
		    path: "m/44'/60'/0'/0"
	      },
	      chainId: 80001
	    }
	},
    solidity: {
		compilers: [
	        { version: "0.8.16" },
	        { version: "0.8.15" }
	    ],
		settings: {
		  optimizer: {
		    enabled: true,
		    runs: 200
		  }
		},
		contractSizer: {
	      alphaSort: true,
	      runOnCompile: true,
	      disambiguatePaths: false
	    }
	}
};

export default config;