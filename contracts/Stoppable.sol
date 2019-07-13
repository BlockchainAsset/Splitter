pragma solidity >=0.4.22 <0.6.0;

import "./Owned.sol";

// Inspiration from B9Lab Module 3 Solidity Inheritance Screencast
contract Stoppable is Owned {

    bool private isRunning;

    event LogPausedContract(address sender);
    event LogResumedContract(address sender);

    modifier onlyIfRunning {
        require(isRunning, "Contract is Paused at the moment");
        _;
    }

    constructor(bool startState) public {
        isRunning = startState;
    }

    function pauseContract() public onlyOwner onlyIfRunning returns(bool success){
        isRunning = false;
        emit LogPausedContract(msg.sender);
        return true;
    }

    function resumeContract() public onlyOwner returns(bool success){
        require(!isRunning, "Contract is already paused");
        isRunning = true;
        emit LogResumedContract(msg.sender);
        return true;
    }
}
