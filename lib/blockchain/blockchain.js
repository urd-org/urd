/*!
 * blockchain.js - Manages the blocks.
 */

'use strict';

const Emittery = require('emittery');

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

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    this.database = options.database;
    this.logger = options.logger;
  }

  start() {
    if (!this.options.disable) {
    } else {
      this.logger.warn('Blockchain disabled.');
    }
  }
}

module.exports = Blockchain;
