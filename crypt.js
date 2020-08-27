const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = process.env.CYPHDBUSER;

module.exports = {
  crypt: (text) =>
    crypto.createCipher('aes-256-ctr', secret).update(text, 'utf-8', 'hex'),
  decrypt: (enc) =>
    crypto.createDecipher('aes-256-ctr', secret).update(enc, 'hex'),
  createToken: (userID) =>
    jwt.sign({ id: userID }, secret, { expiresIn: 86400 }),
  checkToken: (token) =>
    jwt.verify(token, secret, function (err) {
      if (err) return false;
      else return true;
    }),
};
