const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const amount = new BN(web3.utils.toWei('1')); // <-- Change ETH value to be tested here
const one = new BN('1');
const two = new BN('2');
const five = new BN('5');
const ten = new BN('10');
const amountByTwo = amount.div(two);
const amountByTen = amount.div(ten);
const twoEtherInWei = new BN(web3.utils.toWei("2"));

contract('Splitter', (accounts) => {

  var SplitterInstance;
  var accountOne, accountTwo, accountThree;

  before("Preparing Accounts and Initial Checks", async function() {
    assert.isAtLeast(accounts.length, 3, "Atleast three accounts required");

    // Setup 3 accounts.
    [accountOne, accountTwo, accountThree] = accounts;

    //Checking if all accounts have atleast 2 ETH or more for test
    assert.isTrue((new BN(await web3.eth.getBalance(accountOne))).gt(twoEtherInWei));
    assert.isTrue((new BN(await web3.eth.getBalance(accountTwo))).gt(twoEtherInWei));
    assert.isTrue((new BN(await web3.eth.getBalance(accountThree))).gt(twoEtherInWei));
  })

  beforeEach(async function() {
    splitterInstance = await Splitter.new({ from: accountOne});
  });

  it('Should split the coin correctly', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount});

    // Get final balances of the two accounts in Contract.
    let accountTwoContractEndingBalance = await splitterInstance.getBalanceOf.call(accountTwo);
    let accountThreeContractEndingBalance = await splitterInstance.getBalanceOf.call(accountThree);

    // Check if the results are correct or not
    assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
  });

  it('Should split odd numbers currectly as well', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount.add(one)});

    // Get final balances of the two accounts in Contract.
    let accountOneContractEndingBalance = await splitterInstance.getBalanceOf.call(accountOne);
    let accountTwoContractEndingBalance = await splitterInstance.getBalanceOf.call(accountTwo);
    let accountThreeContractEndingBalance = await splitterInstance.getBalanceOf.call(accountThree);

    // Check if the results are correct or not
    assert.isTrue(accountOneContractEndingBalance.eq(one), "Amount wasn't correctly received by Account 1");
    assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
  })

  it('Should Only work if two address are given', async () => {
    try
    {
      await splitterInstance.split(accountTwo, {from: accountOne, value: amount.add(one)});
    }
    catch (err)
    {
      console.log(err.reason);
      assert.equal(err.reason, 'invalid address');
    }
  })

});
