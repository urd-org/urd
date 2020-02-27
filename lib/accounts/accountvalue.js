'use strict';

const assert = require('bsert');
const BN = require('bcrypto/lib/bn.js');
const bufio = require('bufio');

const ZERO = new BN(0, 'be');

class AccountValue extends bufio.Struct {
  constructor() {
    super();

    this.amount = new BN('-1', 'be');
    this.nonce = new BN('-1', 'be');
  }

  setOptions(options) {
    assert(options);

    if (options.amount != null) {
      assert(options.amount instanceof BN);
      this.amount = options.amount;
    }

    if (options.nonce != null) {
      assert(options.nonce instanceof BN);
      this.nonce = options.nonce;
    }
  }

  isValid() {
    assert(this.amount instanceof BN);
    assert(this.nonce instanceof BN);

    if (this.amount.gte(ZERO) && this.nonce.gte(ZERO)) {
      return true;
    }

    return false;
  }

  write(bw) {
    bw.writeU8(this.amount.byteLength());
    bw.writeBytes(this.amount.toBuffer());
    bw.writeU8(this.nonce.byteLength());
    bw.writeBytes(this.nonce.toBuffer());
    return bw;
  }

  read(br) {
    const amountSize = br.readU8();
    const amount = br.readBytes(amountSize);
    const nonceSize = br.readU8();
    const nonce = br.readBytes(nonceSize);

    return this.setOptions({
      amount: new BN(amount, 'be'),
      nonce: new BN(nonce, 'be'),
    });
  }
}

module.exports = AccountValue;
