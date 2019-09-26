/*!
 * network.js - Managing the different networks.
 */

'use strict';

class Network {
  constructor(options) {
    this.type = options.type;
    this.seeds = options.seeds;
    this.magic = options.magic;
    this.port = options.port;
    this.coinbaseMaturity = options.coinbaseMaturity;
    this.genesis = options.genesis;
    this.genesisBlock = options.genesisBlock;
    this.rpcPort = options.rpcPort;
    this.walletPort = options.walletPort;
  }
}

module.exports = Network;
