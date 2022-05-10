const { expect } = require('chai');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const Transaction = require('./Transaction');

describe('Transaction', () => {
    describe('constructor', () => {
        it('should create a new transaction using the default parameters', () => {
            const transaction = new Transaction('from', 'to', 1);
            expect(transaction).to.be.an('object');
            expect(transaction).to.be.instanceOf(Transaction);

            expect(transaction.from).to.be.a('string');
            expect(transaction.from).to.equal('from');

            expect(transaction.to).to.be.a('string');
            expect(transaction.to).to.equal('to');

            expect(transaction.amount).to.be.a('number');
            expect(transaction.amount).to.equal(1);

            expect(transaction.gas).to.be.a('number');
            expect(transaction.gas).to.equal(0);
        });

        it('should create a new transaction using the given parameters', () => {
            const transaction = new Transaction('from', 'to', 1, 1);
            expect(transaction).to.be.an('object');
            expect(transaction).to.be.instanceOf(Transaction);

            expect(transaction.from).to.be.a('string');
            expect(transaction.from).to.equal('from');

            expect(transaction.to).to.be.a('string');
            expect(transaction.to).to.equal('to');

            expect(transaction.amount).to.be.a('number');
            expect(transaction.amount).to.equal(1);

            expect(transaction.gas).to.be.a('number');
            expect(transaction.gas).to.equal(1);
        });
    });

    describe('sign', () => {
        it('should sign the transaction', () => {
            const fromKeyPair = ec.genKeyPair();
            const toKeyPair = ec.genKeyPair();
            const transaction = new Transaction(fromKeyPair.getPublic('hex'), toKeyPair, 1);
            expect(transaction.signature).to.be.undefined;
            transaction.sign(fromKeyPair);
            expect(transaction.signature).to.be.a('string');
            expect(transaction.signature).to.not.be.empty;
        });
    });

    describe('isValid', () => {
        it('should return true if the transaction is valid', () => {
            const fromKeyPair = ec.genKeyPair();
            const toKeyPair = ec.genKeyPair();
            const transaction = new Transaction(fromKeyPair.getPublic('hex'), toKeyPair, 1);
            transaction.sign(fromKeyPair);

            const chain = {
                getBalance: (address) => {
                    if (address === fromKeyPair.getPublic('hex')) {
                        return 1;
                    }
                    return 0;
                }
            };
            expect(transaction.isValid(transaction, chain)).to.be.true;
        });
    });
});
