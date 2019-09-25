'use strict';

const EventEmitter = require('events');
const http = require('http');
const io = require('socket.io');
const ioc = require('socket.io-client');

class Node extends EventEmitter {

  /**
   * Create a node.
   * @constructor
   * @param {Object} options
   * @param {Number} options.port
   */
  constructor(options) {
    super();
    this.options = options;
  }

  /**
   * Start the node.
   */
  start(options) {
    const httpServer = http.createServer();
    const ioServer = io(httpServer);
    httpServer.listen(1234);
  }

  stop() {

  }
}

module.exports = Node;
