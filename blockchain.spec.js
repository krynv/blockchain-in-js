const { expect } = require('chai');
const Blockchain = require('./Blockchain');
const Block = require('./Block');
const Transaction = require('./Transaction');
const { MINT_PUBLIC_ADDRESS, holderKeyPair } = require('./helpers');

describe('Blockchain', () => {
    describe('constructor', () => {
        it('should return a blockchain', () => {
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
});
