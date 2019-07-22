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

  it('Should withdraw the amount correctly', async () => {
    // Get initial balances of the two accounts.
    let accountTwoStartingBalance = new BN(await web3.eth.getBalance(accountTwo));
    let accountThreeStartingBalance = new BN(await web3.eth.getBalance(accountThree));

    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: amount});

    // Withdraw amountByTwo amount from accountTwo
    let accountTwoWithdrawTxReceipt = await splitterInstance.withdraw(amountByTwo, {from: accountTwo});
    let accountTwoWithdrawGasUsed = new BN(accountTwoWithdrawTxReceipt.receipt.gasUsed);
    let accountTwoWithdrawGasPrice = new BN((await web3.eth.getTransaction(accountTwoWithdrawTxReceipt.tx)).gasPrice);

    // Withdraw amountByTen amount from accountThree
    let accountThreeWithdrawTxReceipt = await splitterInstance.withdraw(amountByTen, {from: accountThree});
    let accountThreeWithdrawGasUsed = new BN(accountThreeWithdrawTxReceipt.receipt.gasUsed);
    let accountThreeWithdrawGasPrice = new BN((await web3.eth.getTransaction(accountThreeWithdrawTxReceipt.tx)).gasPrice);

    // Get balances of all two accounts after the transactions.
    let accountTwoEndingBalance = new BN(await web3.eth.getBalance(accountTwo));
    let accountThreeEndingBalance = new BN(await web3.eth.getBalance(accountThree));

    let accountTwoStartAmountGas = amountByTwo.add(accountTwoStartingBalance).sub(accountTwoWithdrawGasUsed.mul(accountTwoWithdrawGasPrice));
    let accountThreeStartAmountGas = amountByTen.add(accountThreeStartingBalance).sub(accountThreeWithdrawGasUsed.mul(accountThreeWithdrawGasPrice));

    // Check if the results are correct or not
    assert.isTrue(accountTwoEndingBalance.eq(accountTwoStartAmountGas), "Amount wasn't correctly received by Account 2");
    assert.isTrue(accountThreeEndingBalance.eq(accountThreeStartAmountGas), "Amount wasn't correctly received by Account 3");
  });

});
