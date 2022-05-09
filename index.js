const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Blockchain = require('./Blockchain');
const Transaction = require('./Transaction');
const { holderKeyPair } = require('./helpers');

const myChain = new Blockchain();
const aWalletThatBelongsToSomeoneElse = ec.genKeyPair();
console.log(`Before:`);
console.log(`Someone's Wallet Balance: ${myChain.getBalance(aWalletThatBelongsToSomeoneElse.getPublic('hex'))}`);
console.log(`Holder's Wallet Balance: ${myChain.getBalance(holderKeyPair.getPublic('hex'))}`);
console.log('\n');
const transaction = new Transaction(holderKeyPair.getPublic('hex'), aWalletThatBelongsToSomeoneElse.getPublic('hex'), 100, 5);

transaction.sign(holderKeyPair);

myChain.addTransaction(transaction);
myChain.mineTransactions(holderKeyPair.getPublic('hex'));

console.dir(myChain, { depth: null });
console.log(`\n\nAfter:`);
console.log(`Someone's Wallet Balance: ${myChain.getBalance(aWalletThatBelongsToSomeoneElse.getPublic('hex'))}`);
console.log(`Holder's Wallet Balance: ${myChain.getBalance(holderKeyPair.getPublic('hex'))}`);