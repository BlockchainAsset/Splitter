const BN = web3.utils.BN;

const Splitter = artifacts.require("Splitter");

const truffleAssert = require("truffle-assertions");

const amount = new BN(web3.utils.toWei("1")); // <-- Change ETH value to be tested here
const one = new BN("1");
const two = new BN("2");
const five = new BN("5");
const ten = new BN("10");
const amountByTwo = amount.div(two);
const amountByTen = amount.div(ten);
const twoEtherInWei = new BN(web3.utils.toWei("2"));
const zeroAdd = "0x0000000000000000000000000000000000000000";

contract("Splitter", (accounts) => {
	var SplitterInstance;
	var accountOne, accountTwo, accountThree;

	before("Preparing Accounts and Initial Checks", async function () {
		assert.isAtLeast(accounts.length, 3, "Atleast three accounts required");

		// Setup 3 accounts.
		[accountOne, accountTwo, accountThree] = accounts;

		//Checking if all accounts have atleast 2 ETH or more for test
		assert.isTrue(new BN(await web3.eth.getBalance(accountOne)).gt(twoEtherInWei));
		assert.isTrue(new BN(await web3.eth.getBalance(accountTwo)).gt(twoEtherInWei));
		assert.isTrue(new BN(await web3.eth.getBalance(accountThree)).gt(twoEtherInWei));
	});

	beforeEach(async function () {
		splitterInstance = await Splitter.new({ from: accountOne });
	});

	it("Should split the coin correctly", async () => {
		// Make transaction from first account to split function.
		await splitterInstance.split(accountTwo, accountThree, {
			from: accountOne,
			value: amount,
		});

		// Get final balances of the two accounts in Contract.
		let accountTwoContractEndingBalance = await splitterInstance.balances(accountTwo);
		let accountThreeContractEndingBalance = await splitterInstance.balances(accountThree);

		// Check if the results are correct or not
		assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
		assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
	});

	it("Should split odd numbers currectly as well", async () => {
		// Make transaction from first account to split function.
		await splitterInstance.split(accountTwo, accountThree, {
			from: accountOne,
			value: amount.add(one),
		});

		// Get final balances of the two accounts in Contract.
		let accountTwoContractEndingBalance = await splitterInstance.balances(accountTwo);
		let accountThreeContractEndingBalance = await splitterInstance.balances(accountThree);

		// Check if the results are correct or not
		assert.isTrue(accountTwoContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 2");
		assert.isTrue(accountThreeContractEndingBalance.eq(amountByTwo), "Amount wasn't correctly received by Account 3");
	});

	it("Should only work if two address are given", async () => {
		await truffleAssert.fails(
			splitterInstance.split(accountTwo, {
				from: accountOne,
				value: amount.add(one),
			}),
			null,
			"invalid address"
		);
	});

	it("Should correctly emit the proper event: Splitted", async () => {
		const receipt = await splitterInstance.split(accountTwo, accountThree, {
			from: accountOne,
			value: amount.add(one),
		});
		const log = receipt.logs[0];

		assert.strictEqual(receipt.logs.length, 1);
		assert.strictEqual(log.event, "Splitted");
		assert.strictEqual(log.args._first, accountTwo);
		assert.strictEqual(log.args._second, accountThree);
		assert.isTrue(log.args._value.eq(amount.add(one)));
	});
});
