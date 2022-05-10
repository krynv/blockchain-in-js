const { expect } = require('chai');
const Block = require('./Block');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { MINT_PUBLIC_ADDRESS } = require('./helpers');

describe('Block', () => {
    describe('constructor', () => {
        it('should create a block using the given parameters', () => {
            const givenDate = Date.now().toString();
            const givenData = ['Something'];
            const regex = /[0-9A-Fa-f]{6}/g;

            const block = new Block(givenDate, givenData);

            expect(block).to.be.an('object');
            expect(block).to.be.instanceOf(Block);

            expect(block.timestamp).to.be.a('string');
            expect(block.timestamp).to.equal(givenDate);

            expect(block.data).to.be.an('array');
            expect(block.data).to.deep.equal(givenData);

            expect(block.hash).to.be.a('string');
            expect(regex.test(block.hash)).to.be.true;

            expect(block.previousHash).to.be.null;

            expect(block.nonce).to.be.a('number');
            expect(block.nonce).to.equal(0);
        });

        it('should create a block using the default parameters', () => {
            const regex = /[0-9A-Fa-f]{6}/g;
            const block = new Block();

            expect(block).to.be.an('object');
            expect(block).to.be.instanceOf(Block);

            expect(block.timestamp).to.be.a('string');
            expect(block.timestamp).to.equal('');

            expect(block.data).to.be.an('array');
            expect(block.data).to.deep.equal([]);

            expect(block.hash).to.be.a('string');
            expect(regex.test(block.hash)).to.be.true;

            expect(block.previousHash).to.be.null;

            expect(block.nonce).to.be.a('number');
            expect(block.nonce).to.equal(0);
        });
    });

    describe('getHash', () => {
        it('should return a hash', () => {
            const block = new Block(Date.now().toString(), []);
            const hash = block.getHash();
            const regex = /[0-9A-Fa-f]{6}/g;
            expect(hash).to.be.a('string');
            expect(regex.test(hash)).to.be.true;
        });
    });

    describe('mine', () => {
        it('should return a hash', () => {
            const regex = /[0-9A-Fa-f]{6}/g;
            const block = new Block(Date.now().toString(), []);
            expect(block.nonce).to.equal(0);
            block.mine(1);
            expect(block.nonce).to.be.greaterThanOrEqual(0);
            expect(block.hash).to.be.a('string');
            expect(regex.test(block.hash)).to.be.true;
        });
    });

    describe('hasValidTransaction', () => {
        it('should return true', () => {
            const block = new Block(Date.now().toString(), [{
                from: MINT_PUBLIC_ADDRESS,
                to: ec.genKeyPair().getPublic('hex'),
                amount: 1,
                gas: 1,
                isValid: () => true
            }]);

            const mockChain = {
                chain: [{
                    timestamp: "1652115354151",
                    data: [],
                    hash: 'someHash',
                    previousHash: null,
                    nonce: 0,
                }],
                difficulty: 1,
                blockTime: 30000,
                transactionPool: [],
                reward: 1,
                getBalance: () => 100000,
            };

            expect(block.hasValidTransactions(mockChain)).to.be.true;
        });
    });
});
