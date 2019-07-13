pragma solidity >=0.4.22 <0.6.0;

// Owned code taken from B9Lab Module 3 Solidity Elements
contract Owned {
    address private owner;

    event LogOwnerChanged(address indexed previousOwner, address newOwner);

    modifier onlyOwner {
        require(owner == msg.sender, "Only owner can use this function");
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function setOwner(address newOwner) public {
        require(msg.sender == owner, "Only an owner can transfer to a new owner");

        emit LogOwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}
