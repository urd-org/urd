/*!
 * blockchain.js - Manages the blocks.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');

const keys = require('../database/keys');
const Database = require('../database/database');
const Block = require('../primitives/block');

class Blockchain extends EventEmitter {
  /**
   * Create a blockchain.
   * @param {Object} options
   * @param {Network} options.network
   * @param {Object} options.logger
   */
  constructor(options) {
    super();

    this.opened = false;
    this.height = -1;
    this.synced = false;
    this.database = null;
    this.logger = null;
    this.disabled = false;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.database != null) {
      assert(options.database instanceof Database);
      this.database = options.database;
    }

    if (options.logger != null) {
      assert(typeof options.logger === 'object');
      this.logger = options.logger;
    }

    if (options.disabled != null) {
      assert(typeof options.disabled === 'boolean');
      this.disabled = options.disabled;
    }
  }

  async open () {
    assert(!this.opened, 'Blockchain is already open.');

    this.opened = true;
  }

  async close() {
    assert(this.opened, 'Blockchain is already closed.');

    this.opened = false;
  }

  saveBlock() {
    // saves the block
  }

  async getTip() {
    const tipBuf = await this.database.get(keys.R);
    return Block.decode(await this.database.get(keys.block(tipBuf)));
  }

  async append(block) {
    assert(block instanceof Block);

    // TODO: verify that `block` is next tip before appending.

    const tip = await this.getTip();
    await this.database.set(keys.block(block.hash()), block.decode());
    await this.database.set(keys.H(block.height), block.hash());
    await this.database.set(keys.h(block.hash()), block.height);
    await this.database.set(keys.n(tip.hash(), block.hash()));
    await this.database.set(keys.R, block.hash());
  }
}

module.exports = Blockchain;
