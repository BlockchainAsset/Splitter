// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Splitter.sol";

contract SplitterTest is Test {
	Splitter public splitter;
	address alice;
	address bob;
	address charlie;
	uint256 amount = 1 ether;

	event Splitted(address indexed _first, address indexed _second, uint256 _value);

	function setUp() public {
		splitter = new Splitter();
		alice = makeAddr("alice");
		bob = makeAddr("bob");
		charlie = makeAddr("charlie");
		vm.deal(alice, amount * 3 + 1 wei);
	}

	function testSplitEven() public {
		// Initial Balance
		uint256 aliceBeforeBalance = splitter.balances(alice);
		uint256 bobBeforeBalance = splitter.balances(bob);
		uint256 charlieBeforeBalance = splitter.balances(charlie);

		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);

		// Final Balance
		uint256 aliceFinalBalance = splitter.balances(alice);
		uint256 bobFinalBalance = splitter.balances(bob);
		uint256 charlieFinalBalance = splitter.balances(charlie);

		assertEq(aliceFinalBalance, aliceBeforeBalance);
		assertEq(bobFinalBalance, bobBeforeBalance + amount / 2);
		assertEq(charlieFinalBalance, charlieBeforeBalance + amount / 2);
	}

	function testSplitOdd() public {
		// Initial Balance
		uint256 aliceBeforeBalance = splitter.balances(alice);
		uint256 bobBeforeBalance = splitter.balances(bob);
		uint256 charlieBeforeBalance = splitter.balances(charlie);

		vm.prank(alice);
		splitter.split{ value: amount + 1 wei }(bob, charlie);

		// Final Balance
		uint256 aliceFinalBalance = splitter.balances(alice);
		uint256 bobFinalBalance = splitter.balances(bob);
		uint256 charlieFinalBalance = splitter.balances(charlie);

		assertEq(aliceFinalBalance, aliceBeforeBalance + 1 wei);
		assertEq(bobFinalBalance, bobBeforeBalance + amount / 2);
		assertEq(charlieFinalBalance, charlieBeforeBalance + amount / 2);
	}

	function testSplitZeroAddress() public {
		vm.expectRevert();
		vm.prank(alice);
		splitter.split{ value: amount }(address(0), address(0));
	}

	function testSplitEvent() public {
		vm.expectEmit();
		emit Splitted(bob, charlie, amount);

		vm.prank(alice);
		splitter.split{ value: amount }(bob, charlie);
	}
}
