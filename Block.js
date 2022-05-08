const { createSHA256Hash } = require('./helpers');

class Block {
    constructor(timestamp = '', data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.previousHash = null;
        this.nonce = 0;
    }

    getHash() {
        return createSHA256Hash(JSON.stringify(this.data) + this.timestamp + this.previousHash + this.nonce);
    }

    mine(difficulty) {
        while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

module.exports = Block;