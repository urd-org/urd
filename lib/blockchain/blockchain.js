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

    this.database = new Database({ network: options.network });

    this.height = -1;
    this.synced = false;
  }
}

module.exports = Blockchain;
