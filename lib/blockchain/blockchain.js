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

    this.options = options;

    this.height = -1;
    this.synced = false;
    this.database = null;
    this.logger = null;
  }

  init() {
    this.database = this.options.database;
    this.logger = this.options.logger;
  }

  start() {
    if (!this.options.disable) {
      this.database.init();
    } else {
      this.logger.warn('Blockchain and Database disabled.');
    }
  }
}

module.exports = Blockchain;
