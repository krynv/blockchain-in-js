const { expect } = require('chai');
const Block = require('./Block');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { MINT_PUBLIC_ADDRESS } = require('./helpers');

describe('Block', () => {
    describe('constructor', () => {
        it('should return a block', () => {
            const block = new Block(Date.now().toString(), []);
            expect(block).to.be.an('object');
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
            expect(block.nonce).to.be.greaterThan(0);
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
            }

            expect(block.hasValidTransactions(mockChain)).to.be.true;
        });
    });
});
