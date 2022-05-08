const { createSHA256Hash } = require('./helpers');

class Block {
    constructor(timestamp = '', data = []) {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = this.getHash();
        this.previousHash = null;
    }

    getHash() {
        return createSHA256Hash(JSON.stringify(this.data) + this.timestamp + this.previousHash);
    }
}

module.exports = Block;