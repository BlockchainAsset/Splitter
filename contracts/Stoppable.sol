/**
 *  @title Stoppable
 *  @author Shebin John
 *  @notice This code implements a simple version of Circuit Breaker
 *  @dev This code is inspired from B9Lab Module 3 Solidity Inheritance Screencast
 */

pragma solidity >=0.4.22 <0.6.0;

import "./Owned.sol";

contract Stoppable is Owned {

    // **************************** //
    // *    Contract variables    * //
    // **************************** //
    bool private isRunning;
    bool private isStopped;

    // **************************** //
    // *          Events          * //
    // **************************** //

    /**
    *   @notice This event is Logged when the contract is Paused
    *   @dev Takes the address of the initiator
    *   @param _sender The address of the initiator
    */
    event LogPausedContract(address indexed _sender);

    /**
    *   @notice This event is Logged when the contract is Resumed
    *   @dev Takes the address of the initiator
    *   @param _sender The address of the initiator
    */
    event LogResumedContract(address indexed _sender);

    /**
    *   @notice This event is Logged when the contract is stopped forever
    *   @dev Takes the address of the initiator
    *   @param _sender The address of the initiator
    */
    event LogStoppedContract(address indexed _sender);

    // **************************** //
    // *         Modifiers        * //
    // **************************** //
    modifier onlyIfRunning {
        require(isRunning, "Contract is Paused at the moment");
        require(!isStopped, "Contract is Stopped permanently");
        _;
    }

    modifier onlyIfPaused {
        require(!isRunning, "Contract is Running at the moment");
        _;
    }

    /**
     *  @dev Constructor
     *  @notice Initializes the current state of the contract when deployed
     *  @param _startState The state at which the contract should be initialized
     */
    constructor(bool _startState) public {
        isRunning = _startState;
    }

    // **************************** //
    // *         Functions        * //
    // **************************** //

    /**
    *   @notice The function pauses the Contract
    *   @return Returns the status of the Operation
    */
    function pauseContract() public onlyOwner onlyIfRunning returns(bool _success){
        isRunning = false;
        emit LogPausedContract(msg.sender);
        return true;
    }

    /**
    *   @notice The function resumes the Contract
    *   @return Returns the status of the Operation
    */
    function resumeContract() public onlyOwner onlyIfPaused returns(bool _success){
        isRunning = true;
        emit LogResumedContract(msg.sender);
        return true;
    }

    /**
    *   @notice The function stops the contract forever
    *   @return Returns the status of the Operation
    */
    function stopContract() public onlyOwner onlyIfPaused returns(bool _success){
        isStopped = true;
        emit LogStoppedContract(msg.sender);
        return true;
    }

}
