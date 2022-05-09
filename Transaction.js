const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const {
    MINT_PUBLIC_ADDRESS,
    createSHA256Hash
} = require('./helpers');

class Transaction {
    constructor(from, to, amount, gas = 0) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.gas = gas;
    }

    sign(keyPair) {
        if (keyPair.getPublic('hex') === this.from) {
            this.signature = keyPair.sign(createSHA256Hash(this.from + this.to + this.amount + this.gas), 'base64').toDER('hex');
        }
    }

    isValid(transaction, chain) {
        return (
            transaction.from &&
            transaction.to &&
            transaction.amount &&
            (chain.getBalance(transaction.from) >= transaction.amount + transaction.gas || transaction.from === MINT_PUBLIC_ADDRESS && transaction.amount === chain.reward) &&
            ec.keyFromPublic(transaction.from, 'hex').verify(createSHA256Hash(transaction.from + transaction.to + transaction.amount + transaction.gas), transaction.signature)
        );
    }
}

module.exports = Transaction;