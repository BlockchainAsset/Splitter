const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const value = 1; // <-- Change ETH value to be tested here
const amount = value.toString();
const amountByTen = (value/10).toString();
const amountByTwo = (value/2).toString();

contract('Splitter', (accounts) => {

  // Setup 3 accounts.
  const accountOne = accounts[0];
  const accountTwo = accounts[1];
  const accountThree = accounts[2];
  var SplitterInstance;

  beforeEach(async function() {
    splitterInstance = await Splitter.deployed();
  });

  it('Should split the coin correctly', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: web3.utils.toWei(amount)});

    // Get final balances of the two accounts in Contract.
    const accountTwoContractEndingBalance = web3.utils.fromWei(await splitterInstance.getBalanceOf.call(accountTwo));
    const accountThreeContractEndingBalance = web3.utils.fromWei(new BN(await splitterInstance.getBalanceOf.call(accountThree)));

    // Check if the results are correct or not
    assert.equal(accountTwoContractEndingBalance, amount/2, "Amount wasn't correctly received by Account 2");
    assert.equal(accountThreeContractEndingBalance, amount/2, "Amount wasn't correctly received by Account 3");
  });

});
