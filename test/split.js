const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const amount = new BN(web3.utils.toWei('1')); // <-- Change ETH value to be tested here
const two = new BN('2');
const five = new BN('5');
const ten = new BN('10');
const amountByTwo = amount.div(two);
const amountByTen = amount.div(ten);

contract('Splitter', (accounts) => {

  var SplitterInstance;
  var accountOne, accountTwo, accountThree;

  before("Preparing Accounts and Initial Checks", async function() {
    assert.isAtLeast(accounts.length, 3, "Atleast three accounts required");

    // Setup 3 accounts.
    [accountOne, accountTwo, accountThree] = accounts;

    //Checking if all accounts have atleast 2 ETH or more for test
    assert.isTrue((new BN(await web3.eth.getBalance(accountOne))).gt(new BN(web3.utils.toWei("2"))));
    assert.isTrue((new BN(await web3.eth.getBalance(accountTwo))).gt(new BN(web3.utils.toWei("2"))));
    assert.isTrue((new BN(await web3.eth.getBalance(accountThree))).gt(new BN(web3.utils.toWei("2"))));
  })

  beforeEach(async function() {
    splitterInstance = await Splitter.deployed();
  });

  it('Should split the coin correctly', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount});

    // Get final balances of the two accounts in Contract.
    const accountTwoContractEndingBalance = await splitterInstance.getBalanceOf.call(accountTwo);
    const accountThreeContractEndingBalance = await splitterInstance.getBalanceOf.call(accountThree);

    // Check if the results are correct or not
    assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
  });

});
