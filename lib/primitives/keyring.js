'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const secp256k1 = require('bcrypto/lib/secp256k1');

const ZERO_KEY = Buffer.alloc(33, 0x00);

class Keyring extends bufio.Struct {
  constructor(options) {
    super();

    this.publicKey = ZERO_KEY;
    this.privateKey = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.privateKey != null) {
      assert(options.privateKey instanceof Buffer);
      assert(options.privateKey.length === 32);
      this.privateKey = options.privateKey;
    }

    if (options.publicKey != null) {
      assert(options.publicKey instanceof Buffer);
      assert(
        secp256k1.publicKeyVerify(options.publicKey) &&
          options.publicKey.length === 33,
        'Not a valid public key.'
      );
      this.publicKey = options.publicKey;
    }

    return this;
  }

  generate() {
    const key = secp256k1.privateKeyGenerate();

    this.setOptions({
      privateKey: key,
      publicKey: secp256k1.publicKeyCreate(key),
    });

    return this;
  }

  static generate() {
    return new this().generate();
  }
}

module.exports = Keyring;
