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

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.getHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }

    isValid(blockchain = this) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const previousBlock = blockchain.chain[i - 1];

            if (currentBlock.hash !== currentBlock.getHash() || currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

module.exports = Blockchain;