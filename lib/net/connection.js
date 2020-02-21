'use strict';

const EventEmitter = require('events');
const assert = require('bsert');
const ioc = require('socket.io-client');

const NetAddress = require('./netaddress');
const Peer = require('./peer');

class Connection extends EventEmitter {
  constructor(options) {
    super();

    this.outbound = false;
    this.peer = new Peer();
    this.socket = null;

    if (options) {
      this.setOptions(options);
    }

    this.init();
  }

  init() {
    this.socket.on('packet', async (packet) => {
      console.log(packet);
    });
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

    if (options.socket != null) {
      assert(typeof options.socket === 'object');
      this.socket = options.socket;
    }
  }

  static fromSocket(socket) {
    if (socket.request != null) {
      assert(socket.request.connection.remoteAddress);
      assert(socket.request.connection.remotePort);
      const { remoteAddress: address, remotePort: port } = socket.request.connection;

      const netaddr = NetAddress.fromObject({ address, port, transport: 'tcp' });
      const peer = new Peer({ address: netaddr });

      return new Connection({ peer, socket, outbound: false });
    } else if (socket.io != null) {
      assert(socket.io.opts.hostname);
      assert(socket.io.opts.port);
      const { hostname: address, port } = socket.io.opts;

      const netaddr = NetAddress.fromObject({ address, port: parseInt(port, 10), transport: 'tcp' });
      const peer = new Peer({ address: netaddr });

      return new Connection({ peer, socket, outbound: true });
    }
  }

  connect() {
    const cio = ioc(this.peer.address.toHTTP());

    cio.on('connect', () => {
      console.log(' * Connected to node!');
      // cio.emit('peer', '/ip4/127.0.0.1/3001');
    });
  }
}

module.exports = Connection;
