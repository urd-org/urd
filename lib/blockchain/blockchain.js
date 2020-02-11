/*!
 * blockchain.js - Manages the blocks.
 */

'use strict';

const Emittery = require('emittery');
const assert = require('bsert');

class Blockchain extends Emittery {
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
    this.database = options.database;
    this.logger = options.logger;

    if (options.disabled != null) {
      assert(typeof options.disabled === 'boolean');
      this.disabled = options.disabled;
    }
  }

  start() {
    if (!this.disabled) {
    } else {
      this.logger.warn('Blockchain disabled.');
    }
  }
}

module.exports = Blockchain;
