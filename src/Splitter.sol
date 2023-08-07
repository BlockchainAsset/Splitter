/**
 *  @title Splitter
 *  @author Shebin John
 *  @notice This code implements a simple version of Splitter.
 *  @dev Takes an ETH input and divides it to two specified address.
 */

pragma solidity 0.8.13;

contract Splitter {
	// **************************** //
	// *    Contract variable     * //
	// **************************** //

	mapping(address => uint256) public balances;

	// **************************** //
	// *          Events          * //
	// **************************** //

	/**
	 *   @notice This event is Logged when a Split happens.
	 *   @dev Takes the address of the receivers and the value.
	 *   @param _first The address of first receiver.
	 *   @param _second The address of second receiver.
	 *   @param _value The total value received by both.
	 */
	event Splitted(address indexed _first, address indexed _second, uint256 _value);

	/**
	 *   @notice This event is Logged when a withdraw is done.
	 *   @dev Takes the address of user and the value user is withdrawing.
	 *   @param _to The address of the User.
	 *   @param _value The value being withdrawn.
	 */
	event Transfered(address indexed _to, uint256 _value);

	// **************************** //
	// *         Functions        * //
	// **************************** //

	/**
	 *  @notice The function splits the value sent to two addresses.
	 *  @param _first The address of first receiver.
	 *  @param _second The address of second receiver.
	 *  @return _status Returns the status of the Operation.
	 */
	function split(address _first, address _second) public payable returns (bool _status) {
		require(_first != address(0) && _second != address(0), "Zero Address not Allowed");

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

	/**
	 *   @notice This function helps to withdraw money from the contract.
	 *   @dev // https://stackoverflow.com/a/52438518/7520013.
	 *   @param _amount The amount to withdraw.
	 *   @return _status in bool.
	 */
	function withdraw(uint256 _amount) public returns (bool _status) {
		require(_amount > 0, "Amount cannot be Zero");

		uint256 balance = balances[msg.sender];

		balances[msg.sender] = balance - _amount;

		emit Transfered(msg.sender, _amount);

		payable(msg.sender).transfer(_amount);
		return true;
	}
}
