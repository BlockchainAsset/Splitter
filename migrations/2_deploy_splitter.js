const Splitter = artifacts.require("Splitter");

module.exports = function(deployer, network, accounts) {
  console.log("network:", network);
  console.log("accounts:", accounts);
  deployer.deploy(Splitter, true);
};
