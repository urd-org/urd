/*!
 * block.js
 */

'use strict';

const assert = require('bsert');
const bufio = require('bufio');

const Tx = require('./tx');

class Block extends bufio.Struct {
  constructor(options) {
    super();

    this.version = 0;
    this.height = -1;
    this.time = -1;
    this.nonce = -1;
    this.prevBlockHash = null;
    this.txs = [];
    this.stateRoot = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.version != null) {
      assert(typeof options.version === 'number');
      this.version = options.version;
    }

    if (options.height != null) {
      assert(typeof options.height === 'number');
      this.height = options.height;
    }

    if (options.time != null) {
      assert(typeof options.time === 'number');
      this.time = options.time;
    }

    if (options.nonce != null) {
      assert(typeof options.nonce === 'number');
      this.nonce = options.nonce;
    }

    if (options.prevBlockHash != null) {
      assert(options.prevBlockHash instanceof Buffer);
      this.prevBlockHash = options.prevBlockHash;
    }

    if (options.txs != null) {
      assert(Array.isArray(options.txs));
      assert(options.txs.every(tx => tx instanceof Tx));
      this.txs = options.txs;
    }

    if (options.stateRoot != null) {
      assert(options.stateRoot instanceof Buffer);
      this.stateRoot = options.stateRoot;
    }
  }

  isVaild() {
  }
}

module.exports = Block;
