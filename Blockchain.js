const Block = require('./Block');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), ['Genesis block']);
    }

    addBlock(block) {
        block.previousHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        this.chain.push(block);
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }
}

module.exports = Blockchain;