const Block = require('./Block');
const Transaction = require('./Transaction');

const {
    MINT_KEY_PAIR,
    MINT_PUBLIC_ADDRESS,
    holderKeyPair
} = require('./helpers');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.blockTime = 30000;
        this.transactionPool = [];
        this.reward = 100;
    }

    createGenesisBlock() {
        const initialCoinRelease = new Transaction(MINT_PUBLIC_ADDRESS, holderKeyPair.getPublic('hex'), 100000);
        return new Block(Date.now().toString(), [initialCoinRelease]);
    }

    addBlock(block) {
        block.previousHash = this.getLastBlock().hash;
        block.hash = block.getHash();

        block.mine(this.difficulty);

        this.chain.push(Object.freeze(block));

        this.difficulty += Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime ? 1 : -1;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    isValid(blockchain = this) {

        if (blockchain.chain.length === 1) {
            // it only contains the genesis block, therefore must be valid
            return true;
        }

        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const previousBlock = blockchain.chain[i - 1];

            if (
                currentBlock.hash !== currentBlock.getHash() ||
                currentBlock.previousHash !== previousBlock.hash ||
                !currentBlock.hasValidTransactions(blockchain)
            ) {
                return false;
            }

            return true;
        }
    }

    addTransaction(transaction) {
        if (transaction.isValid(transaction, this)) {
            this.transactionPool.push(Object.freeze(transaction));
        }
    }

    mineTransactions(rewardAddress) {
        let totalGassFee = 0;

        this.transactionPool.forEach(transaction => {
            totalGassFee += transaction.gas;
        });

        const rewardTransaction = new Transaction(MINT_PUBLIC_ADDRESS, rewardAddress, this.reward + totalGassFee);
        rewardTransaction.sign(MINT_KEY_PAIR);

        if (this.transactionPool.length !== 0) {
            this.addBlock(new Block(Date.now().toString(), [rewardTransaction, ...this.transactionPool]));
        }

        this.transactionPool = [];
    }

    getBalance(address) {
        let balance = 0;

        this.chain.forEach(block => {
            block.data.forEach(transaction => {
                if (transaction.from === address) {
                    balance -= transaction.amount;
                    balance -= transaction.gas;
                }

                if (transaction.to === address) {
                    balance += transaction.amount;
                }
            });
        });

        return balance;
    }
}

module.exports = Blockchain;