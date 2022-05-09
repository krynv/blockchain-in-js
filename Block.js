const { createSHA256Hash, MINT_PUBLIC_ADDRESS } = require('./helpers');

class Block {
    constructor(timestamp = '', data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.previousHash = null;
        this.nonce = 0;
    }

    getHash() {
        return createSHA256Hash(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.timestamp + this.nonce);
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }

    hasValidTransactions(chain) {
        let gas = 0;
        let reward = 0;

        this.data.forEach(transaction => {
            if (transaction.from !== MINT_PUBLIC_ADDRESS) {
                gas += transaction.gas;
            } else {
                reward += transaction.amount;
            }
        });

        return (
            reward - gas === chain.reward &&
            this.data.every(transaction => transaction.isValid(transaction, chain)) &&
            this.data.filter(transaction => transaction.from === MINT_PUBLIC_ADDRESS).length === 1
        );
    }
}

module.exports = Block;