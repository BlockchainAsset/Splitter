/**
 *  @title Owned
 *  @author B9Labs
 *  @notice This code implements a simple version of Owner Management in Solidity
 *  @dev This is the contract used from B9Lab's Module 3 - Solidity Elements
 */

pragma solidity >=0.4.22 <0.6.0;

contract Owned {

    // **************************** //
    // *    Contract variable     * //
    // **************************** //
    address private owner; // To store the Owner Address


    // **************************** //
    // *          Event           * //
    // **************************** //
    /**
    *   @notice This event is Logged when an Owner is Updated
    *   @dev Takes the address of the newOwner
    *   @param _newOwner The address of the New Owner
    */
    event LogOwnerChanged(address indexed _newOwner);

    // **************************** //
    // *         Modifier         * //
    // **************************** //
    modifier onlyOwner {
        require(owner == msg.sender, "Only owner can use this function");
        _;
    }

    /**
     *  @dev Constructor
     *  @notice Initializes the Initiator as the Owner
     */
    constructor() public {
        owner = msg.sender;
    }

    // **************************** //
    // *         Function         * //
    // **************************** //

    /**
    *   @notice The function updates the owner
    *   @dev Takes the address of the newOwner
    *   @param _newOwner The address of the New Owner
    */
    function setOwner(address _newOwner) public onlyOwner{
        require(_newOwner != address(0), "newOwner should be a valid address");
        emit LogOwnerChanged(_newOwner);
        owner = _newOwner;
    }
}
