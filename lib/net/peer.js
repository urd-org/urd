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

    this.options = options;

    this.id = -1;
    this.address = null;
    this.outbound = false;

    this.version = -1;
    this.height = -1;
    this.syncing = false;
    this.lastPong = -1;
    this.lastPing = -1;

    if (this.options) {
      this.assign(this.options);
    }
  }

  assign(options) {
    assert(options, '`options` not well-defined.');

    if (options.id != null) {
      assert(typeof options.id === 'number');
      this.id = options.id;
    }

    if (options.address != null) {
      assert(typeof options.address === 'string' || options.address instanceof NetAddress);
      this.address = options.address;
    }

    if (options.outbound != null) {
      assert(typeof options.outbound === 'boolean');
      this.outbound = options.outbound;
    }

    if (options.version != null) {
      assert(typeof options.version === 'number');
      this.version = options.version;
    }

    if (options.height != null) {
      assert(typeof options.height === 'number');
      this.height = options.height;
    }

    if (options.syncing != null) {
      assert(typeof options.syncing === 'boolean');
      this.syncing = options.syncing;
    }

    if (options.lastPong != null) {
      assert(typeof options.lastPong === 'number');
      this.lastPong = options.lastPong;
    }

    if (options.lastPing != null) {
      assert(typeof options.lastPing === 'number');
      this.lastPing = options.lastPing;
    }
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
}

module.exports = Peer;
