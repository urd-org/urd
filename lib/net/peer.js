/*!
 * peer.js - Info about a peer.
 */

'use strict';

const bufio = require('bufio');
const assert = require('bsert');

const NetAddress = require('./netaddress');
const Options = require('../utils/options');

class Peer extends bufio.Struct {
  /**
   * Create a peer.
   * @constructor
   */
  constructor(options) {
    super();

    this.id = -1;
    this.address = new NetAddress('/ip4/0.0.0.0/tcp/3000');
    this.version = -1;
    this.height = -1;
    this.syncing = false;
    this.lastPong = -1;
    this.lastPing = -1;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options, '`options` not well-defined.');

    if (options.id != null) {
      assert(typeof options.id === 'number');
      this.id = options.id;
    }

    if (options.address != null) {
      assert(options.address instanceof NetAddress);
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
