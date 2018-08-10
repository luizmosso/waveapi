const crypto = require('crypto');
const secret = process.env.CYPHDBUSER;

module.exports = {
    crypt: (text) => crypto.createCipher('aes-256-ctr', secret).update(text, "utf-8", "hex"),
    decrypt: (enc) => crypto.createDecipher('aes-256-ctr', secret).update(enc, 'hex')
}