const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-web3");
require("hardhat-contract-sizer"); //yarn run hardhat size-contracts
require("solidity-coverage"); // $ npx hardhat coverage
require("hardhat-log-remover");
require("hardhat-gas-reporter");
require("hardhat-docgen");
require("hardhat-abi-exporter");

module.exports = {
	solidity: {
		version: "0.5.17",
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	abiExporter: {
		path: "./abi",
		clear: true,
		flat: false,
		only: [],
		except: [],
		spacing: 4,
	},
	contractSizer: {
		alphaSort: false,
		runOnCompile: false,
		disambiguatePaths: false,
	},
	networks: {
		hardhat: {
			blockGasLimit: 6800000,
		},
	},
	paths: {
		sources: "./contracts",
		tests: "./tests",
	},
	mocha: {
		timeout: 800000,
	},
	docgen: {
		path: "./docs",
		clear: true,
	},
	gasReporter: {
		enabled: true,
	},
};
