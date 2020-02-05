/*!
 * blockchain.js - Manages the blocks.
 */

'use strict';

const Emittery = require('emittery');

const Database = require('./database');
const Network = require('./network');

class Blockchain extends Emittery {

  /**
   * Create a blockchain.
   * @param {Object} options
   * @param {Network} options.network
   */
  constructor(options) {
    super();

    this.options = options;

    this.height = -1;
    this.synced = false;
    this.database = null;
  }

  init() {
    this.database = new Database({
      network: this.options.network,
    });
  }

  start() {
    this.database.init();
  }
}

module.exports = Blockchain;
