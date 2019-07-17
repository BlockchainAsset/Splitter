const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const value = 1; // <-- Change ETH value to be tested here
const amount = value.toString();
const amountByTen = (value/10).toString();
const amountByTwo = (value/2).toString();

const amountByTenWei = web3.utils.toWei(amountByTen);
const amountByTwoWei = web3.utils.toWei(amountByTwo);

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
    let accountTwoStartingBalance = parseInt(await web3.eth.getBalance(accountTwo),10);
    let accountThreeStartingBalance = parseInt(await web3.eth.getBalance(accountThree),10);

    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: web3.utils.toWei(amount)});

    // Withdraw amountByTwo amount from accountTwo
    let accountTwoWithdrawTxReceipt = await splitterInstance.withdraw(amountByTwoWei, {from: accountTwo});
    let accountTwoWithdrawGasUsed = accountTwoWithdrawTxReceipt.receipt.gasUsed;
    let accountTwoWithdrawGasPrice = ((await web3.eth.getTransaction(accountTwoWithdrawTxReceipt.tx)).gasPrice);

    // Withdraw amountByTen amount from accountThree
    let accountThreeWithdrawTxReceipt = await splitterInstance.withdraw(amountByTenWei, {from: accountThree});
    let accountThreeWithdrawGasUsed = accountThreeWithdrawTxReceipt.receipt.gasUsed;
    let accountThreeWithdrawGasPrice = ((await web3.eth.getTransaction(accountThreeWithdrawTxReceipt.tx)).gasPrice);

    // Get balances of all two accounts after the transactions.
    let accountTwoEndingBalance = await web3.eth.getBalance(accountTwo);
    let accountThreeEndingBalance = await web3.eth.getBalance(accountThree);

    let accountTwoStartAmountGas = amountByTwoWei - (accountTwoWithdrawGasUsed * accountTwoWithdrawGasPrice) + accountTwoStartingBalance;
    let accountThreeStartAmountGas = amountByTenWei - (accountThreeWithdrawGasUsed * accountThreeWithdrawGasPrice) + accountThreeStartingBalance;

    // Check if the results are correct or not
    assert.equal(accountTwoEndingBalance, accountTwoStartAmountGas, "Amount wasn't correctly received by Account 2");
    assert.equal(accountThreeEndingBalance, accountThreeStartAmountGas, "Amount wasn't correctly received by Account 3");
  });

});
