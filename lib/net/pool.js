/*!
 * pool.js - Pool management of peers.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');
const cio = require('socket.io-client');
const Multiaddr = require('multiaddr');

const Peer = require('./peer');
const Database = require('../blockchain/database');

class Pool extends EventEmitter {
  constructor(options) {
    super();

    this.database = null;
    this.logger = null;
    this.peers = null;
    this.connections = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.database != null) {
      assert(options.database instanceof Database);
      this.database = options.database;
    }

    if (options.logger != null) {
      assert(typeof options.logger === 'object');
      this.logger = options.logger;
    }

    this.peers = new Map();
    this.connections = [];
  }

  connect(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);


  }

  disconnect(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);

  }

  save(peer) {
    assert(peer instanceof Peer);
    // TODO: Decide key formatting and find a way to serialize peer object.
    // this.database.set();
  }

  /**
   * Check if a peer exists in pool.
   * @param {String | Multiaddr} addr - address in multiaddr format
   */
  has(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);
    return this.peers.has(addr.toString());
  }

  /**
   * Add peer to peer list.
   * @param {Peer} peer
   */
  add(peer) {
    // assert(peer instanceof Peer);
    //
    // this.peers.set(peer.getAddress(), peer);
  }

  /**
   * Remove peer from peer list.
   * @param {String | Multiaddr} addr - address in multiaddr format
   */
  remove(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);
    return this.peers.remove(addr.toString());
  }

  /**
   * Get addresses of peers in Pool.
   * @returns {Iterator.<String>}
   */
  getAddresses() {
    return this.peers.keys();
  }

  /**
   * Get Peer of the peers in Pool.
   * @returns {Iterator.<Peer>}
   */
  getPeers() {
    return this.peers.values();
  }

  /**
   * Get addresses and Peer of the peers in Pool.
   * @returns {Iterator.<Array>}
   */
  getPool() {
    return this.peers.entries();
  }

  /* Call this when a connection is created. */
  handleConnect() {
    return (socket) => {
      this.logger.log(
        'info',
        'Connected to peer: %s:%s',
        socket.request.connection.remoteAddress,
        socket.request.connection.remotePort
      );

      this.database.set();

      socket.on('disconnect', (res) => {
        this.logger.info('Disconnect peer: %s', res.trim());
      });
    }
  }
}

module.exports = Pool;
