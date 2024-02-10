// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import "forge-std/Test.sol";
import "../src/Splitter.sol";

contract SplitterTest is Test {
	Splitter public splitter;
	address alice;
	address bob;
	address charlie;
	uint256 amount = 1 ether;

	event Transfered(address indexed _to, uint256 _value);

	function setUp() public {
		splitter = new Splitter();
		alice = makeAddr("alice");
		bob = makeAddr("bob");
		charlie = makeAddr("charlie");
		vm.deal(alice, amount * 3 + 1 wei);
	}

	function testWithdrawComplete() public {
		// Initial Balance
		uint256 bobBeforeContractBalance = splitter.balances(bob);
		uint256 bobBeforeAddressBalance = bob.balance;
		uint256 charlieBeforeContractBalance = splitter.balances(charlie);
		uint256 charlieBeforeAddressBalance = charlie.balance;

		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);

		vm.prank(bob);
		splitter.withdraw(amount / 2);

		// Final Balance
		uint256 bobAfterContractBalance = splitter.balances(bob);
		uint256 bobAfterAddressBalance = bob.balance;
		uint256 charlieAfterContractBalance = splitter.balances(charlie);
		uint256 charlieAfterAddressBalance = charlie.balance;

		assertEq(bobAfterContractBalance, bobBeforeContractBalance);
		assertEq(bobAfterAddressBalance, bobBeforeAddressBalance + amount / 2);
		assertEq(charlieAfterContractBalance, charlieBeforeContractBalance + amount / 2);
		assertEq(charlieBeforeAddressBalance, charlieAfterAddressBalance);
	}

	function testWithdrawPartial() public {
		// Initial Balance
		uint256 bobBeforeContractBalance = splitter.balances(bob);
		uint256 bobBeforeAddressBalance = bob.balance;
		uint256 charlieBeforeContractBalance = splitter.balances(charlie);
		uint256 charlieBeforeAddressBalance = charlie.balance;

		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);

		vm.prank(bob);
		splitter.withdraw(amount / 4);

		// Final Balance
		uint256 bobAfterContractBalance = splitter.balances(bob);
		uint256 bobAfterAddressBalance = bob.balance;
		uint256 charlieAfterContractBalance = splitter.balances(charlie);
		uint256 charlieAfterAddressBalance = charlie.balance;

		assertEq(bobAfterContractBalance, bobBeforeContractBalance + amount / 4);
		assertEq(bobAfterAddressBalance, bobBeforeAddressBalance + amount / 4);
		assertEq(charlieAfterContractBalance, charlieBeforeContractBalance + amount / 2);
		assertEq(charlieBeforeAddressBalance, charlieAfterAddressBalance);
	}

	function testWithdrawHigherThanBalance() public {
		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);

		vm.expectRevert();
		vm.prank(bob);
		splitter.withdraw(amount);
	}

	function testWithdrawZero() public {
		vm.expectRevert(bytes4(keccak256("ZeroAmountNotAllowed()")));
		vm.prank(bob);
		splitter.withdraw(0);
	}

	function testWithdrawEvent() public {
		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);

		vm.expectEmit();
		emit Transfered(bob, amount / 2);

		vm.prank(bob);
		splitter.withdraw(amount / 2);
	}
}
