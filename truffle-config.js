const ganache = require("ganache-core");

module.exports = {
	contracts_directory: "./contracts",
	contracts_build_directory: "./build/contracts",
	test_directory: "./test",

  networks: {
    development: { // This one is optional and reduces the scope for failing fast
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      //gas: 500000,
			provider: ganache.provider({
				gasLimit: 6800000,
				gasPrice: 20000000000,
				default_balance_ether: 10000000000000000000,
			}),
    },
    ropsten: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 3
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
