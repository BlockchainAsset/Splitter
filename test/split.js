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

  it('Should split the coin correctly', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount});

    // Get final balances of the two accounts in Contract.
    let accountTwoContractEndingBalance = await splitterInstance.balances(accountTwo);
    let accountThreeContractEndingBalance = await splitterInstance.balances(accountThree);

    // Check if the results are correct or not
    assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
  });

  it('Should split odd numbers currectly as well', async () => {
    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount.add(one)});

    // Get final balances of the two accounts in Contract.
    let accountOneContractEndingBalance = await splitterInstance.balances(accountOne);
    let accountTwoContractEndingBalance = await splitterInstance.balances(accountTwo);
    let accountThreeContractEndingBalance = await splitterInstance.balances(accountThree);

    // Check if the results are correct or not
    assert.isTrue(accountOneContractEndingBalance.eq(one), "Amount wasn't correctly received by Account 1");
    assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
  })

  it('Should Only work if more than 1 Wei is sent to split', async () => {
    try
    {
      await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: one});
    }
    catch (err)
    {
      assert.equal(err.reason, 'amount should be greater than 1 wei');
    }
  })
  
  it('Should only work if two address are given', async () => {
    try
    {
      await splitterInstance.split(accountTwo, {from: accountOne, value: amount.add(one)});
    }
    catch (err)
    {
      assert.equal(err.reason, 'invalid address');
    }
  })

  it('Should Only work if First Address is valid', async () => {
    try
    {
      await splitterInstance.split(zeroAdd, accountThree, {from: accountOne, value: amount.add(one)});
    }
    catch (err)
    {
      assert.equal(err.reason, 'bob should be a valid address');
    }
  })

  it('Should Only work if Second Address is valid', async () => {
    try
    {
      await splitterInstance.split(accountTwo, zeroAdd, {from: accountOne, value: amount.add(one)});
    }
    catch (err)
    {
      assert.equal(err.reason, 'carol should be a valid address');
    }
  })

  it("Should correctly emit the proper event: Splitted", async () => {
    const receipt = await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount.add(one)});
    const log = receipt.logs[0];

    assert.strictEqual(receipt.logs.length, 1);
    assert.strictEqual(log.event, "Splitted");
    assert.strictEqual(log.args._bob, accountTwo);
    assert.strictEqual(log.args._carol, accountThree);
    assert.isTrue(log.args._value.eq(amountByTwo));
  });  

});
