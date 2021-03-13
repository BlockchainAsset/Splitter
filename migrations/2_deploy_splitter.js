const Splitter = artifacts.require("Splitter");

module.exports = function(deployer, network, accounts) {
  console.log("network:", network);
  deployer.deploy(Splitter);
};
