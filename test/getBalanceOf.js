const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const amount = new BN(web3.utils.toWei('1')); // <-- Change ETH value to be tested here
const two = new BN('2');
const five = new BN('5');
const ten = new BN('10');
const amountByTwo = amount.div(two);
const amountByTen = amount.div(ten);

contract('Splitter', (accounts) => {

  // Setup 3 accounts.
  const accountOne = accounts[0];
  const accountTwo = accounts[1];
  const accountThree = accounts[2];
  var SplitterInstance;

  beforeEach(async function() {
    splitterInstance = await Splitter.deployed();
  });

  it('Should update the withdrawed amount in the contract correctly', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount});

    // Withdraw certain amount from accountTwo
    await splitterInstance.withdraw(amountByTen, {from: accountTwo});

    // Withdraw complete amount from accountTwo
    await splitterInstance.withdraw(amountByTwo, {from: accountThree});

    // Get final balances of the two accounts in Contract.
    let accountTwoContractEndingBalance = await splitterInstance.getBalanceOf.call(accountTwo);
    let accountThreeContractEndingBalance = await splitterInstance.getBalanceOf.call(accountThree);

    assert(accountTwoContractEndingBalance.eq(amount.mul(two).div(five)), "Amount wasn't correctly withdrawn from Account 2");
    assert(accountThreeContractEndingBalance.eq(new BN('0')), "Amount wasn't correctly withdrawn from Account 3");
  });

});
