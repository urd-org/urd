/*!
 * block.js
 */

'use strict';

const assert = require('bsert');
const bufio = require('bufio');

class Block extends bufio.Struct {
  constructor(options) {
    super();

    this.height = -1;
    this.time = 0;
    this.nonce = 0;
    this.prevBlockHash = null;
    this.txs = [];
    this.stateRoot = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

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
      this.txs = options.txs;
    }
  }
}

module.exports = Block;
