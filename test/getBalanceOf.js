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

  it('Should update the withdrawed amount in the contract correctly', async () => {
    const splitterInstance = await Splitter.deployed();

    // Make transaction from first account to split function.
    await splitterInstance.split(accountTwo, accountThree, {from: accountOne, value: web3.utils.toWei(amount, "ether")});

    // Withdraw certain amount from accountTwo
    await splitterInstance.withdraw(web3.utils.toWei(amountByTen, "ether"), {from: accountTwo});

    // Withdraw complete amount from accountTwo
    await splitterInstance.withdraw(web3.utils.toWei(amountByTwo, "ether"), {from: accountThree});

    // Get final balances of the two accounts in Contract.
    let accountTwoContractEndingBalance = web3.utils.fromWei(await splitterInstance.getBalanceOf.call(accountTwo), "ether");
    let accountThreeContractEndingBalance = web3.utils.fromWei(await splitterInstance.getBalanceOf.call(accountThree), "ether");

    assert.equal(accountTwoContractEndingBalance, (2*amount)/5, "Amount wasn't correctly withdrawn from Account 2");
    assert.equal(accountThreeContractEndingBalance, 0, "Amount wasn't correctly withdrawn from Account 3");
  });

});
