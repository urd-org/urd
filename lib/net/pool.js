/*!
 * pool.js - Pool management of peers.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');
const cio = require('socket.io-client');
const Multiaddr = require('multiaddr');

const Peer = require('./peer');

class Pool extends EventEmitter {
  constructor(options) {
    super();

    this.options = options;

    this.database = null;
    this.peers = null;
    // this.connections = null;
  }

  init() {
    this.database = this.options.database;
    this.peers = new Map();
    // this.connections = [];
  }

  connect(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);


  }

  disconnect(addr) {
    assert(typeof addr === 'string' || addr instanceof Multiaddr);

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
}

module.exports = Pool;
