/**
 *  @title Splitter
 *  @author Shebin John
 *  @notice This code implements a simple version of Splitter
 *  @dev Takes an ETH input and divides it to two specified address
 */

pragma solidity >=0.4.22 <0.6.0;

import "./Stoppable.sol";
import "./SafeMath.sol";

contract Splitter is Stoppable{
    using SafeMath for uint;

    // **************************** //
    // *    Contract variable     * //
    // **************************** //
    mapping (address => uint) public balances;

    // **************************** //
    // *          Events          * //
    // **************************** //

    /**
    *   @notice This event is Logged when a Split happens
    *   @dev Takes the address of the receivers and the value
    *   @param _first The address of first receiver
    *   @param _second The address of second receiver
    *   @param _value The total value received by both
    */
    event Splitted(address indexed _first, address indexed _second, uint256 _value);

    /**
    *   @notice This event is Logged when a withdraw is done
    *   @dev Takes the address of user and the value user is withdrawing
    *   @param _to The address of the User
    *   @param _value The value being withdrawn
    */
    event Transfered(address indexed _to, uint256 _value);

    /**
     *  @dev Constructor
     *  @notice Initializes the current state of the contract when deployed
     *  @param _initialRunState The state at which the contract should be initialized
     */
    constructor(bool _initialRunState) public Stoppable(_initialRunState){
    }

    // **************************** //
    // *         Functions        * //
    // **************************** //

    /**
     *  @notice The function splits the value sent to two addresses
    *   @param _first The address of first receiver
    *   @param _second The address of second receiver
     *  @return Returns the status of the Operation
    */
    function split(address _first, address _second) public onlyIfRunning payable returns(bool _status){

        /*
         * These checks were removed on the later stage
        */
        // require(_first != address(0), "_first should be a valid address");
        // require(_second != address(0), "_second should be a valid address");

        /*
         * This check was removed, because if the user sends with zero value
         * it won't have any effect other than some gas utilization
        */
        // To check if the amount to be send is positive or not.
        // require(msg.value > 1, "amount should be greater than 1 wei");

        // To divide the amount to be send to _first and _second
        uint msgValueAmountByTwo = msg.value.div(2);

        /*
         * The below is removed because the gas utilization for this calculation
         * will be more than the calculation done.
        */
        // If the amount to be divided is not perfectly divided by two
        // uint remainingAmount = msg.value.mod(2);

        // Balances of _first and _second is updated
        balances[_first] = balances[_first].add(msgValueAmountByTwo);
        balances[_second] = balances[_second].add(msgValueAmountByTwo);

        emit Splitted(_first, _second, msg.value);
        return true;

    }

    /**
    *   @notice This function helps to withdraw money from the contract
    *   @dev // https://stackoverflow.com/a/52438518/7520013
    *   @param _amount The amount to withdraw
    *   @return _status in bool
    */
    function withdraw(uint _amount) public onlyIfRunning returns(bool _status){

        /*
         * The below is removed because someone tries to withdraw zero,
         * it won't hurt the contract.
        */
        // require(_amount > 0, "Zero can't be withdrawn");

        uint balance = balances[msg.sender];

        /*
         * The below is removed because line 116 will revert if someone
         * tries to withdraw balance more than he have.
        */
        // require(balance >= _amount, "Withdraw amount requested higher than balance");

        balances[msg.sender] = balance.sub(_amount);

        emit Transfered(msg.sender, _amount);

        msg.sender.transfer(_amount);
        return true;

    }
}
