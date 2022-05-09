const Block = require('./Block');
const Transaction = require('./Transaction');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.transactionPool = [];
        this.reward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now().toString(), ['Genesis block']);
    }

    addBlock(block) {
        block.previousHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        block.mine(this.difficulty);

        this.chain.push(block);

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
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

    addTransaction(transaction) {
        this.transactionPoolpush(transaction);
    }

    miningTransactions() {
        this.addBlock(new Block(Date.now().toString(), [new Transaction(CREATE_REWARD_ADDRESS, rewardAddress, this.reward), ...this.transactionPool]));
        this.transactionPool = [];
    }
}

module.exports = Blockchain;