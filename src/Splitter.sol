/**
 *  @title Splitter
 *  @author Shebin John
 *  @notice This code implements a simple version of Splitter.
 *  @dev Takes an ETH input and divides it to two specified address.
 */

pragma solidity 0.8.23;

import { ISplitter } from "./ISplitter.sol";

contract Splitter is ISplitter {
	// **************************** //
	// *    Contract variable     * //
	// **************************** //

	mapping(address => uint256) public balances;

	// **************************** //
	// *         Functions        * //
	// **************************** //

	/// @inheritdoc ISplitter
	function split(address _first, address _second) public payable returns (bool _status) {
		if (_first == address(0) || _second == address(0)) revert ZeroAddressNotAllowed();

		// To divide the amount to be send to _first and _second.
		uint256 msgValueAmountByTwo = msg.value / 2;

		// Balances of _first and _second is updated.
		balances[_first] += msgValueAmountByTwo;
		balances[_second] += msgValueAmountByTwo;
		// When odd values are sent.
		balances[msg.sender] += msg.value - (msgValueAmountByTwo * 2);

		emit Splitted(_first, _second, msg.value);
		return true;
	}

	/// @inheritdoc ISplitter
	function withdraw(uint256 _amount) public {
		if (_amount == 0) revert ZeroAmountNotAllowed();

		uint256 balance = balances[msg.sender];

		balances[msg.sender] = balance - _amount;

		emit Transfered(msg.sender, _amount);

		payable(msg.sender).transfer(_amount);
	}
}
