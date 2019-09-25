/*!
 * pool.js - Pool management of peers.
 */

'use strict';

const assert = require('bsert');
const Multiaddr = require('multiaddr');

const Peer = require('./peer');

class Pool extends EventEmitter {
  constructor(options) {
    super();

    this.peers = new Map();
  }

  /**
   * Check if a peer exists in pool.
   * @param {String | Multiaddr} addr - in multiaddr format
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
    assert(peer instanceof Peer);

    this.peers.set()
  }

  remove(addr) {
    return this.peers.remove(addr);
  }
}
