# Splitter

ETH Community Blockstars 2.0's Project 1 - Splitter

## Specification

Create a smart contract named Splitter whereby:

- There are 3 people: Alice, Bob and Carol.
- We can see the balance of the Splitter contract on the Web page.
- Whenever Alice sends ether to the contract for it to be split, half of it goes to Bob and the other half to Carol.
- We can see the balances of Alice, Bob and Carol on the Web page.
- Alice can use the Web page to split her ether.

Purposely left a lot to be decided. Such description approximates how your human project sponsors would describe the rules. As the Ethereum Smart Contract specialist, you have to think things through.

That's it! This is where you put hand to keyboard.

It would be even better if you could team up with different people impersonating Alice, Bob and Carol, all cooperating on a test net.

## How to Run the Project

1. First clone this repo

```git clone https://github.com/remedcu/blockstars.git```

2. For this and some other step, you need to have Truffle installed in your system.

After you clone the repo, please make change to _truffle-config.js_ according to which network you require it to run.

For more info on that, you can go to: [Truffle Configuration](https://truffleframework.com/docs/advanced/configuration)

3. After that, please unlock your Ether Wallet Account to Deploy this contract in the desired network

4. Then using ```truffle migrate``` you can deploy the contract.

**NOTE**: *After First Deployment*, If you have made changes to the code or want to create a new contract, please use ```truffle migrate --reset```

*If you want to deploy on a particular network*, please use ```truffle migrate --network NetworkName --reset```

5. To interact with this contract, you can use ```truffle console```

*If you want to interact with the contract in a particular network*, please use ```truffle console --network NetworkName```

6. To run the test, please use ```truffle test```

Minimum of 3 Accounts *(accounts[0], accounts[1], accounts[2], see test/splitter.js)* should be setup with balances for contract testing. If running `ganache-cli`, it will be taken automatically.

*Step 7 - 9 will be available soon*

7. For checking files in Web, please install *nodejs*

8. If you don't have a prefered way, you can use the below command to run the server

```npx http-server ./app/ -a 0.0.0.0 -p 8000 -c-1```

9. Now, in your browser, open [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Note

- This is a prototype, please don't use it unless you know what you are doing.
- A lot can be improved in this. Feedbacks are welcome.
- Don't forget to unlock ether wallet accounts when required.

## Thank You for checking out!