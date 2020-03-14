/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('bsert');
const secp256k1 = require('bcrypto/lib/secp256k1');

const Keyring = require('../lib/primitives/keyring');

describe('Keyring', function() {
  it('should generate a valid keyring', () => {
    const keyring = Keyring.generate();

    assert(secp256k1.privateKeyVerify(keyring.privateKey));
    assert(secp256k1.publicKeyVerify(keyring.publicKey));
    assert(Buffer.compare(secp256k1.publicKeyCreate(keyring.privateKey), keyring.publicKey) === 0);
  });
});
