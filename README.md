# Splitter

[![Build Status](https://travis-ci.com/remedcu/Splitter.svg?branch=master)](https://travis-ci.com/remedcu/Splitter) [![Coverage Status](https://coveralls.io/repos/github/remedcu/Splitter/badge.svg?branch=master)](https://coveralls.io/github/remedcu/Splitter?branch=master)

ETH Community Blockstars 2.0's Project 1 - Splitter

## Specification

Splitter is a smart contract in Ethereum written in Solidity, which is capable of working in the below scenario:

- There are 3 people: Alice, Bob and Carol.
- We can see the balance of the Splitter contract on the Web page.
- Whenever Alice sends ether to the contract for it to be split, half of it goes to Bob and the other half to Carol.
- We can see the balances of Alice, Bob and Carol on the Web page.
- Alice can use the Web page to split her ether.

## UML Diagram

![UML Diagram](UML.svg)

## How to Run the Project

1. First clone this repo

`git clone https://github.com/BlockchainAsset/Splitter.git`

2. Install all the dependencies using: `npm i`

3. To run the test, please use `npm run test`

4. To check code coverage, please use: `npm run coverage`

5. In a terminal,

```
./node_modules/.bin/truffle migrate

./node_modules/.bin/webpack-cli --mode development

npx http-server ./build/app/ -a 0.0.0.0 -p 8000 -c-1
```

6. Now, in your browser, open [http://127.0.0.1:8000](http://127.0.0.1:8000) or the address shown to you in your console.

**NOTE**: If you are using `ganache-cli` for blockchain, please disable MetaMask for checking this project.

## Note

- This is a prototype, please don't use it unless you know what you are doing.
- A lot can be improved in this. Feedbacks are welcome.
- Don't forget to unlock ether wallet accounts when required.

## Thank You for checking out! Star if this helped you in anyway!
