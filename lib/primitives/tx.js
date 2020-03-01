'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const Address = require('./address');

class Tx extends bufio.Struct {
  constructor(options) {
    super();

    this.from = new Address();
    this.to = new Address();
    this.amount = -1;
    this.nonce = -1;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.from != null) {
      assert(options.from instanceof Address);
      this.from = options.from;
    }

    if (options.to != null) {
      assert(options.to instanceof Address);
      this.to = options.to;
    }

    if (options.amount != null) {
      assert(options.amount > 0, 'Cannot set amount to Tx');
      this.amount = options.amount;
    }

    if (options.nonce != null) {
      assert(options.nonce >= 0, 'Cannot set negative nonce to Tx');
      this.nonce = options.nonce;
    }
  }

  isCoinbase() {
    return (this.from.isNull() && this.to.isVaild());
  }

  isValid() {
    assert(this.from instanceof Address);
    assert(this.to instanceof Address);
    assert(typeof this.amount === 'number');

    if (this.from.isValid() && this.to.isValid() && this.amount > 0) {
      return true;
    }

    return false;
  }

  write(bw) {
    bw.writeU8(this.from.getSize());
    bw.writeBytes(this.from.encode());
    bw.writeU8(this.to.getSize());
    bw.writeBytes(this.to.encode());

    assert(this.amount > 0);
    bw.writeU64(this.amount);
    bw.writeU64(this.nonce);
  }

  read(br) {
    const fromSize = br.readU8();
    const fromBytes = br.readBytes(fromSize);
    const from = Address.decode(fromBytes);

    const toSize = br.readU8();
    const toBytes = br.readBytes(toSize);
    const to = Address.decode(toBytes);

    const amount = br.readU64();
    const nonce = br.readU64();

    this.setOptions({ from, to, amount, nonce });
  }
}

module.exports = Tx;
