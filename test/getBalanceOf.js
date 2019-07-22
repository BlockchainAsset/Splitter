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
const zeroAdd = "0x0000000000000000000000000000000000000000";

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

    assert.isTrue(accountTwoContractEndingBalance.eq(amount.mul(two).div(five)), "Amount wasn't correctly withdrawn from Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(new BN('0')), "Amount wasn't correctly withdrawn from Account 3");
  });

  it('Should only work if address is given', async () => {
    try
    {
      await splitterInstance.getBalanceOf({from: accountOne});
    }
    catch (err)
    {
      assert.include(err.toString(), 'Error: Invalid number of parameters for "getBalanceOf". Got 0 expected 1!');
    }
  })

  it('Should only work if address is valid', async () => {
    try
    {
      await splitterInstance.getBalanceOf(zeroAdd, {from: accountOne});
    }
    catch (err)
    {
      assert.include(err.toString(), 'check should be a valid address');
    }
  })

});
