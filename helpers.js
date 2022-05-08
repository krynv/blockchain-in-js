const crypto = require('crypto');

const createSHA256Hash = message => crypto.createHash('sha256').update(message).digest('hex');

module.exports = {
    createSHA256Hash
}