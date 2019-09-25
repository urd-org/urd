/*!
 * peer.js - Networking peer.
 */

'use strict';

const EventEmitter = require('events');

const NetAddress = require('./netaddress');

class Peer extends EventEmitter {

  /**
   * Create a peer.
   * @constructor
   */
  constructor() {
    super();

    this.id = -1;
    this.address = new NetAddress();
    this.outbound = false;

    this.version = -1;
    this.height = -1;
    this.syncing = false;
    this.lastPong = -1;
    this.lastPing = -1;
  }

  /**
   * Return the multiaddr as a string.
   * @returns {NetAddress}
   */
  getAddress() {
    return this.address.toString();
  }
}
