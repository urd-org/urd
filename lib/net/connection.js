const EventEmitter = require('events');
const cio = require('socket.io-client');

const Options = require('../utils/options');

class Connection extends EventEmitter {
  constructor(options) {
    super();

    this.default = {
      outbound: false,
      peer: null,
    };

    this.options = new Options(this.default, options);

    this.outbound = this.default.outbound;
    this.peer = this.default.peer;
  }

  init() {
    this.outbound = this.options.outbound;
    this.peer = this.options.peer;
  }

  start() {
  }
}

module.exports = Connection;
