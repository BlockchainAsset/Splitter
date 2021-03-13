const Web3 = require("web3");
const $ = require("jquery");
const assert = require("assert");

require("file-loader?name=../index.html!../index.html");

const truffleContract = require("truffle-contract");
const splitterJson = require("../../build/contracts/Splitter.json");

if (typeof web3 !== "undefined") {
	// Use the Mist/wallet/Metamask provider.
	web3 = new Web3(web3.currentProvider);
} else {
	// Fallback.
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const Splitter = truffleContract(splitterJson);
Splitter.setProvider(web3.currentProvider);

let account;

async function split() {
	try {
		const recipient1 = $('input[name="recipient1"]').val();
		const recipient2 = $('input[name="recipient2"]').val();
		const value = web3.utils.toWei($('input[name="sAmount"]').val());
		const splitter = await Splitter.deployed();

		// checking if transaction will succeed
		assert(
			await splitter.split.call(recipient1, recipient2, {
				from: account,
				value,
			}),
			"The transaction will fail anyway, not sending"
		);

		const txObj = await splitter
			.split(recipient1, recipient2, { from: account, value })
			.on("transactionHash", (txHash) => $("#splitstatus").html("Transaction on the way " + txHash));

		const receipt = txObj.receipt;
		console.log("got receipt", receipt);
		if (!receipt.status) {
			console.error("Wrong status");
			console.error(receipt);
			$("#splitStatus").html("There was an error in the tx execution, status not 1");
		} else if (receipt.logs.length == 0) {
			console.error("Empty logs");
			console.error(receipt);
			$("#splitStatus").html("There was an error in the tx execution, missing expected event");
		} else {
			console.log(receipt.logs[0]);
			$("#splitStatus").html("Transfer executed");
		}

		const aBalance = web3.utils.fromWei(await web3.eth.getBalance(account));
		const cBalance = web3.utils.fromWei(await splitter.balances(account));

		$("#aBalance").html(aBalance.toString(10));
		$("#cBalance").html(cBalance.toString(10));
	} catch (err) {
		$("#splitStatus").html(err.toString());
		console.error(err);
	}
}

async function withdraw() {
	try {
		const value = web3.utils.toWei($('input[name="wAmount"]').val());
		const splitter = await Splitter.deployed();

		// checking if transaction will succeed
		assert(await splitter.withdraw.call(value, { from: account }), "The transaction will fail anyway, not sending");

		const txObj = await splitter
			.withdraw(value, { from: account })
			.on("transactionHash", (txHash) => $("#withdrawstatus").html("Transaction on the way " + txHash));

		const receipt = txObj.receipt;
		console.log("got receipt", receipt);
		if (!receipt.status) {
			console.error("Wrong status");
			console.error(receipt);
			$("#withdrawStatus").html("There was an error in the tx execution, status not 1");
		} else if (receipt.logs.length == 0) {
			console.error("Empty logs");
			console.error(receipt);
			$("#withdrawStatus").html("There was an error in the tx execution, missing expected event");
		} else {
			console.log(receipt.logs[0]);
			$("#withdrawStatus").html("Transfer executed");
		}

		const aBalance = web3.utils.fromWei(await web3.eth.getBalance(account));
		const cBalance = web3.utils.fromWei(await splitter.balances(account));

		$("#aBalance").html(aBalance.toString(10));
		$("#cBalance").html(cBalance.toString(10));
	} catch (err) {
		$("#withdrawStatus").html(err.toString());
		console.error(err);
	}
}

async function getBalance() {
	try {
		const checkAddress = $('input[name="cAddress"]').val();
		const splitter = await Splitter.deployed();

		const checkBalance = web3.utils.fromWei(await splitter.balances(checkAddress)) + " Ether";

		const aBalance = web3.utils.fromWei(await web3.eth.getBalance(account), "ether");
		const cBalance = web3.utils.fromWei(await splitter.balances(account));

		$("#aBalance").html(aBalance.toString(10));
		$("#cBalance").html(cBalance.toString(10));
		$("#checkStatus").html(checkBalance.toString(10));
	} catch (err) {
		$("#checkStatus").html(err.toString());
		console.error(err);
	}
}

window.addEventListener("load", async () => {
	try {
		const accounts = await web3.eth.getAccounts();
		const splitter = await Splitter.deployed();
		if (!accounts.length) {
			$("#balance").html("N/A");
			throw new Error("No account with which to transact");
		}

		account = accounts[0];
		console.log("Account:", account);

		const network = await web3.eth.net.getId();
		console.log("Network:", network.toString(10));

		const aBalance = web3.utils.fromWei(await web3.eth.getBalance(account));
		const cBalance = web3.utils.fromWei(await splitter.balances(account));

		$("#aBalance").html(aBalance.toString(10));
		$("#cBalance").html(cBalance.toString(10));

		$("#split").click(split);
		$("#withdraw").click(withdraw);
		$("#getBalance").click(getBalance);
	} catch (err) {
		console.error(err);
	}
});
