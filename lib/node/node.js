'use strict';

const EventEmitter = require('events');
const http = require('http');
const io = require('socket.io');
const ioc = require('socket.io-client');

const Blockchain = require('../blockchain/blockchain');
const Network = require('../blockchain/network');
const networks = require('../blockchain/networks');
const Pool = require('../net/pool');

class Node extends EventEmitter {

  /**
   * Create a node.
   * @constructor
   * @param {Object} options
   * @param {Number} options.port
   * @param {Object} options.network
   */
  constructor(options) {
    super();
    this.options = options;
    this.sio = null;

    this.network = Network.create(this.options.network);

    this.blockchain = new Blockchain({
      network: this.network,
    });

    this.pool = new Pool();
  }

  /**
   * Start the node.
   */
  start() {
    const httpServer = http.createServer();
    this.sio = io(httpServer);
    httpServer.listen(this.options.port);

    // Peer discovery
  }

  stop() {
    this.sio.close();
  }
}

module.exports = Node;
