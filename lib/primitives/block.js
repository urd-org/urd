/*!
 * block.js
 */

'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const SHA256 = require('bcrypto/lib/sha256');

const Tx = require('./tx');
const Header = require('./header');

const ZERO_HASH = Buffer.alloc(32, 0x00);

class Block extends bufio.Struct {
  constructor(options) {
    super();

    this.txs = [];
    this.header = new Header();
    // this.version = 0;
    // this.height = -1;
    // this.time = -1;
    // this.nonce = -1;
    // this.prevBlockHash = ZERO_HASH;
    // this.stateRoot = ZERO_HASH;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.txs != null) {
      assert(Array.isArray(options.txs));
      assert(options.txs.every(tx => tx instanceof Tx));
      this.txs = options.txs;
    }

    if (options.header != null) {
      assert(options.header instanceof Header);
      this.header = options.header;
    }

    // if (options.version != null) {
    //   assert(typeof options.version === 'number');
    //   this.version = options.version;
    // }
    //
    // if (options.height != null) {
    //   assert(typeof options.height === 'number');
    //   this.height = options.height;
    // }
    //
    // if (options.time != null) {
    //   assert(typeof options.time === 'number');
    //   this.time = options.time;
    // }
    //
    // if (options.nonce != null) {
    //   assert(typeof options.nonce === 'number');
    //   this.nonce = options.nonce;
    // }
    //
    // if (options.prevBlockHash != null) {
    //   assert(options.prevBlockHash instanceof Buffer);
    //   this.prevBlockHash = options.prevBlockHash;
    // }
    //
    // if (options.stateRoot != null) {
    //   assert(options.stateRoot instanceof Buffer);
    //   this.stateRoot = options.stateRoot;
    // }
  }

  // hash() {
  //   const bw = bufio.write();
  //   bw.writeU8(this.version);
  //   bw.writeU64(this.height);
  //   bw.writeU64(this.time);
  //   bw.writeU8(32);
  //   bw.writeBytes(this.prevBlockHash);
  //   bw.writeU8(32);
  //   bw.writeBytes(this.stateRoot);
  //
  //   return SHA256.digest(bw.render());
  // }

  hash() {
    const bw = bufio.write();

    bw.writeBytes(this.header.encode());

    bw.writeVarint(this.txs.length);

    for (const tx of this.txs) {
      tx.write(bw);
    }

    return SHA256.digest(bw.render());
  }

  isVaild() {
  }

  write(bw) {
    bw.writeBytes(this.header.encode());

    bw.writeVarint(this.txs.length);

    for (const tx of this.txs) {
      tx.write(bw);
    }

    return bw;
  }

  read(br) {
    this.header = Header.decode(br.readBytes(Header.getSize()));

    const count = br.readVarint();

    for (let i = 0; i < count; i++) {
      const tx = Tx.read(br);
      this.txs.push(tx);
    }

    return this;
  }
}

module.exports = Block;
