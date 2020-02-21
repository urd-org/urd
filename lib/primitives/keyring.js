'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const keccak256 = require('bcrypto/lib/secp256k1');
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
  }

  generate() {
    this.privateKey = secp256k1.privateKeyGenerate();
    this.publicKey = secp256k1.publicKeyCreate(this.privateKey);
  }
}

module.exports = Keyring;
