const { expect } = require('chai');
const {
    createSHA256Hash,
    MINT_KEY_PAIR,
    MINT_PUBLIC_ADDRESS,
    holderKeyPair
} = require('./helpers');

describe('helpers', () => {
    describe('createSHA256Hash', () => {
        it('should return a string', () => {
            const message = 'test';
            const hash = createSHA256Hash(message);
            const regex = /[0-9A-Fa-f]{6}/g;
            expect(hash).to.be.a('string');
            expect(regex.test(hash)).to.be.true;
        });
    });

    describe('MINT_KEY_PAIR', () => {
        it('should return a key pair', () => {
            expect(MINT_KEY_PAIR).to.be.an('object');
        });
    });

    describe('MINT_PUBLIC_ADDRESS', () => {
        it('should return a public address', () => {
            const regex = /[0-9A-Fa-f]{6}/g;
            expect(MINT_PUBLIC_ADDRESS).to.be.a('string');
            expect(regex.test(MINT_PUBLIC_ADDRESS)).to.be.true;
        });
    });

    describe('holderKeyPair', () => {
        it('should return a key pair', () => {
            expect(holderKeyPair).to.be.an('object');
        });
    });
});
