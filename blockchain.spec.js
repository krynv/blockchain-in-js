const { expect } = require('chai');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Blockchain = require('./Blockchain');
const Block = require('./Block');
const Transaction = require('./Transaction');
const { MINT_PUBLIC_ADDRESS, holderKeyPair } = require('./helpers');

describe('Blockchain', () => {
    describe('constructor', () => {
        it('should create a new blockchain', () => {
            const blockchain = new Blockchain();
            expect(blockchain).to.be.an('object');
            expect(blockchain).to.be.instanceOf(Blockchain);

            expect(blockchain.chain).to.be.an('array');
            expect(blockchain.chain.length).to.equal(1);

            expect(blockchain.difficulty).to.be.a('number');
            expect(blockchain.difficulty).to.equal(1);

            expect(blockchain.blockTime).to.be.a('number');
            expect(blockchain.blockTime).to.equal(30000);

            expect(blockchain.transactionPool).to.be.an('array');
            expect(blockchain.transactionPool).to.deep.equal([]);

            expect(blockchain.reward).to.be.a('number');
            expect(blockchain.reward).to.equal(100);
        });
    });

    describe('createGenesisBlock', () => {
        it('should return a genesis block', () => {
            const regex = /[0-9A-Fa-f]{6}/g;
            const holderPubicKey = holderKeyPair.getPublic('hex');

            const blockchain = new Blockchain();
            const genesisBlock = blockchain.createGenesisBlock();
            const genesisTransaction = genesisBlock.data[0];

            expect(blockchain.chain).to.be.a('array');
            expect(blockchain.chain.length).to.equal(1);

            expect(blockchain.chain[0]).to.deep.equal(genesisBlock);
            expect(genesisBlock).to.be.an('object');
            expect(genesisBlock).to.be.instanceOf(Block);

            expect(genesisBlock.data).to.be.an('array');
            expect(genesisBlock.data.length).to.equal(1);

            expect(genesisTransaction).to.be.a('object');
            expect(genesisTransaction).to.be.instanceOf(Transaction);

            expect(genesisTransaction.from).to.be.a('string');
            expect(regex.test(genesisTransaction.from)).to.be.true;
            expect(genesisTransaction.from).to.equal(MINT_PUBLIC_ADDRESS);

            expect(genesisTransaction.to).to.be.a('string');
            expect(regex.test(genesisTransaction.to)).to.be.true;
            expect(genesisTransaction.to).to.equal(holderPubicKey);

            expect(genesisTransaction.amount).to.be.a('number');
            expect(genesisTransaction.amount).to.equal(100000);

            expect(genesisTransaction.gas).to.be.a('number');
            expect(genesisTransaction.gas).to.equal(0);
        });
    });

    describe('addBlock', () => {
        it('should add a block to the chain', () => {
            const blockchain = new Blockchain();
            const newBlock = new Block(Date.now().toString(), []);

            blockchain.addBlock(newBlock);

            expect(blockchain.chain).to.be.an('array');
            expect(blockchain.chain.length).to.equal(2);
            expect(blockchain.chain[1]).to.deep.equal(newBlock);
        });
    });

    describe('getLastBlock', () => {
        it('should return the last block in the chain', () => {
            const blockchain = new Blockchain();
            const newBlock = new Block(Date.now().toString(), []);

            blockchain.addBlock(newBlock);

            const lastBlock = blockchain.getLastBlock();

            expect(lastBlock).to.be.an('object');
            expect(lastBlock).to.be.instanceOf(Block);
            expect(lastBlock).to.deep.equal(newBlock);
        });
    });

    describe('isValid', () => {
        it('should return true if the chain is valid', () => {
            const blockchain = new Blockchain();
            expect(blockchain.isValid()).to.be.true;
        });
    });

    describe('addTransaction', () => {
        it('should add a transaction to the transaction pool', () => {
            const holderPublicKey = holderKeyPair.getPublic('hex');
            const otherPublicKey = ec.genKeyPair().getPublic('hex');

            const blockchain = new Blockchain();
            const transaction = new Transaction(holderPublicKey, otherPublicKey, 100, 5);

            transaction.sign(holderKeyPair);
            blockchain.addTransaction(transaction);

            expect(blockchain.transactionPool.length).to.equal(1);
            expect(blockchain.transactionPool[0]).to.be.instanceOf(Transaction);
            expect(blockchain.transactionPool[0]).to.deep.equal(transaction);
        });
    });

    describe('mineTransactions', () => {
        it('should add a block to the chain', () => {
            const holderPublicKey = holderKeyPair.getPublic('hex');
            const otherPublicKey = ec.genKeyPair().getPublic('hex');

            const blockchain = new Blockchain();
            const transaction = new Transaction(holderPublicKey, otherPublicKey, 100, 5);

            transaction.sign(holderKeyPair);
            blockchain.addTransaction(transaction);
            blockchain.mineTransactions(holderPublicKey);

            expect(blockchain.chain.length).to.equal(2);
            expect(blockchain.chain[1]).to.be.instanceOf(Block);
            expect(blockchain.chain[1].data[1]).to.be.instanceOf(Transaction);
            expect(blockchain.chain[1].data[1]).to.deep.equal(transaction);
        });
    });

    describe('getBalance', () => {
        it('should return the balance of a public key', () => {
            const holderPublicKey = holderKeyPair.getPublic('hex');
            const otherPublicKey = ec.genKeyPair().getPublic('hex');

            const blockchain = new Blockchain();

            const balanceBeforeTransaction = blockchain.getBalance(otherPublicKey);
            expect(balanceBeforeTransaction).to.be.a('number');
            expect(balanceBeforeTransaction).to.equal(0);

            const transaction = new Transaction(holderPublicKey, otherPublicKey, 100, 5);
            transaction.sign(holderKeyPair);
            blockchain.addTransaction(transaction);
            blockchain.mineTransactions(holderPublicKey);

            const finalBalance = blockchain.getBalance(otherPublicKey);
            expect(finalBalance).to.be.a('number');
            expect(finalBalance).to.equal(100);
        });
    });


});
