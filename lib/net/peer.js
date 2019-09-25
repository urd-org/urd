/*!
 * peer.js - Networking peer.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');

const NetAddress = require('./netaddress');

class Peer extends EventEmitter {

  /**
   * Create a peer.
   * @constructor
   */
  constructor(options) {
    super();

    this.id = -1;
    this.address = new NetAddress();
    this.outbound = false;

    this.version = -1;
    this.height = -1;
    this.syncing = false;
    this.lastPong = -1;
    this.lastPing = -1;

    if (options)
      this.inject(options);
  }

  /**
   * Inject options into Peer.
   * @param {Object} options
   */
  inject(options) {
    assert(options, 'Peer `.inject()` requires options');

    this.id = options.id || this.id;
    this.address = options.address || this.address;
    this.outbound = options.outbound || this.outbound;

    this.version = options.version || this.version;
    this.height = options.height || this.height;
    this.syncing = options.syncing || this.syncing;
    this.lastPong = options.lastPong || this.lastPong;
    this.lastPing = options.lastPing || this.lastPing;
  }

  /**
   * Return the address as a string.
   * @returns {String}
   */
  getAddress() {
    return this.address.toString();
  }

  /**
   * Return address as a multiaddr.
   * @returns {Multiaddr}
   */
  getMultiaddr() {
   return this.address.toMultiaddr();
  }

  /**
   * Return address as a NetAddress.
   * @returns {Multiaddr}
   */
  getNetAddress() {
   return this.address;
  }
}

module.exports = Peer;
