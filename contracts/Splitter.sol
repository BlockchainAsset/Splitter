pragma solidity >=0.4.22 <0.6.0;

import "./Stoppable.sol";
import "./SafeMath.sol";

contract Splitter is Stoppable{
    using SafeMath for uint;

    mapping (address => uint) balances;

    event Splitted(address indexed _bob, address indexed _carol, uint256 _value);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor(bool initialRunState) public Stoppable(initialRunState){
    }

    function split(address bob, address carol) public onlyIfRunning payable returns(bool status){

        // To check if the amount to be send is positive or not.
        assert(msg.value > 0);

        // To divide the amount to be send to Bob and Carol
        uint msgValueAmountByTwo = msg.value.div(2);

        // If the amount to be divided is not perfectly divided by two
        uint remainingAmount = msg.value.mod(2);

        // Balances of Bob and Carol is updated
        balances[bob] = balances[bob].add(msgValueAmountByTwo);
        balances[carol] = balances[carol].add(msgValueAmountByTwo);
        balances[msg.sender] = balances[msg.sender].add(remainingAmount);

        emit Splitted(bob, carol, msgValueAmountByTwo);
        return true;
    }

    function getBalanceOf(address check) public view returns(uint amount){
        return balances[check];
    }

    // https://stackoverflow.com/a/52438518/7520013
    function withdraw(uint amount) public onlyIfRunning returns(bool status){
        require(amount > 0, "Zero can't be withdrawn");

        uint balance = balances[msg.sender];

        require(balance > 0, "Nothing to withdraw");
        require(balance >= amount, "Withdraw amount requested higher than balance");

        // https://blog.ethereum.org/2016/06/10/smart-contract-security/
        balances[msg.sender] = balance.sub(amount);

        emit Transfer(address(this), msg.sender, amount);

        msg.sender.transfer(amount);
        return true;
    }
}
