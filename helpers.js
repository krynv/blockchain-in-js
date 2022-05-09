const crypto = require('crypto');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const MINT_KEY_PAIR = ec.genKeyPair();
const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic('hex');
const holderKeyPair = ec.genKeyPair();

const createSHA256Hash = message => crypto.createHash('sha256').update(message).digest('hex');

module.exports = {
    createSHA256Hash,
    MINT_KEY_PAIR,
    MINT_PUBLIC_ADDRESS,
    holderKeyPair
}
