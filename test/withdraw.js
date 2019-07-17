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

  it('Should withdraw the amount correctly', async () => {
    // Get initial balances of the two accounts.
    let accountTwoStartingBalance = await web3.eth.getBalance(accountTwo);
    let accountThreeStartingBalance = await web3.eth.getBalance(accountThree);

    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: web3.utils.toWei(amount)});

    // Withdraw complete amount from accountTwo
    await splitterInstance.withdraw(web3.utils.toWei(amountByTwo), {from: accountTwo});
    await splitterInstance.withdraw(web3.utils.toWei(amountByTwo), {from: accountThree});

    // Get balances of all two accounts after the transactions.
    let accountTwoEndingBalance = await web3.eth.getBalance(accountTwo);
    let accountThreeEndingBalance = await web3.eth.getBalance(accountThree);

    // Check if the results are correct or not
    assert(accountTwoEndingBalance > accountTwoStartingBalance, "Amount wasn't correctly received by Account 2");
    assert(accountThreeEndingBalance > accountThreeStartingBalance, "Amount wasn't correctly received by Account 3");
  });

});
