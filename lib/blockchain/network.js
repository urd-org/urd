/*!
 * network.js - Managing the different networks.
 */

'use strict';

const assert = require('bsert');

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

  static create(options) {
    assert(Network.network === null, 'Network already created.');

    const network = new Network(options);

    Network.network = network;
    Network.type = network.type;

    return network;
  }

  static get() {
    return Network.network;
  }

  static type() {
    return Network.type;
  }
}

/**
 * Default network.
 */
Network.network = null;

/**
 * Default network type.
 */
Network.type = null;

module.exports = Network;
