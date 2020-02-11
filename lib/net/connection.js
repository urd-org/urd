'use strict';

const EventEmitter = require('events');
const assert = require('bsert');
const ioc = require('socket.io-client');

const Peer = require('./peer');
const Options = require('../utils/options');

class Connection extends EventEmitter {
  constructor(options) {
    super();

    this.outbound = false;
    this.peer = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.outbound != null) {
      assert(typeof options.outbound === 'boolean');
      this.outbound = options.outbound;
    }

    if (options.peer != null) {
      assert(options.peer instanceof Peer);
      this.peer = options.peer;
    }
  }

  connect() {
    // const multiaddr = this.peer.getMultiaddr();
    // console.log(multiaddr.);
    const cio = ioc(this.peer.address.toHTTP());

    cio.on('connect', () => {
      console.log(' * Connected to node!');
      // cio.emit('peer', '/ip4/127.0.0.1/3001');
    });
  }
}

module.exports = Connection;
