/*!
 * blockchain.js - Manages the blocks.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');

const Database = require('./database');

class Blockchain extends EventEmitter {
  /**
   * Create a blockchain.
   * @param {Object} options
   * @param {Network} options.network
   * @param {Object} options.logger
   */
  constructor(options) {
    super();

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

  verifyBlock() {
    // do block verification here
  }

  saveBlock() {
    // saves the block
  }

  getTip() {
    // get tip block
  }
}

module.exports = Blockchain;
