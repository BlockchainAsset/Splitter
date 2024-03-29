/**
 *  @title Splitter
 *  @author Shebin John
 *  @notice This code implements a simple version of Splitter.
 *  @dev Takes an ETH input and divides it to two specified address.
 */

pragma solidity 0.8.23;

interface ISplitter {
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
	// *       Custom Errors      * //
	// **************************** //

	/**
	 * @notice This error is thrown when Zero Address is passed.
	 */
	error ZeroAddressNotAllowed();

	/**
	 * @notice This error is thrown when Zero Amount is passed.
	 */
	error ZeroAmountNotAllowed();

	// **************************** //
	// *         Functions        * //
	// **************************** //

	/**
	 *  @notice The function splits the value sent to two addresses.
	 *  @param _first The address of first receiver.
	 *  @param _second The address of second receiver.
	 *  @return _status Returns the status of the Operation.
	 */
	function split(address _first, address _second) external payable returns (bool _status);

	/**
	 *   @notice This function helps to withdraw money from the contract.
	 *   @dev https://stackoverflow.com/a/52438518/7520013.
	 *   @param _amount The amount to withdraw.
	 */
	function withdraw(uint256 _amount) external;
}
