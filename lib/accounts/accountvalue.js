'use strict';

const assert = require('bsert');
const bufio = require('bufio');

class AccountValue extends bufio.Struct {
  constructor() {
    super();

    this.amount = -1;
    this.nonce = -1;
  }

  setOptions(options) {
    assert(options);

    if (options.amount != null) {
      assert(typeof options.amount === 'number');
      this.amount = options.amount;
    }

    if (options.nonce != null) {
      assert(typeof options.nonce === 'number');
      this.nonce = options.nonce;
    }
  }

  isValid() {
    // validate with state tree?
  }

  write(bw) {
    bw.writeU64(this.amount);
    bw.writeU64(this.nonce);
    return bw;
  }

  read(br) {
    const amount = br.readU64();
    const nonce = br.readU64();

    return this.setOptions({ amount, nonce });
  }
}

module.exports = AccountValue;
