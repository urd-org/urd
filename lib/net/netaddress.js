/*!
 * netaddress.js - Manages addresses.
 */

'use strict';

const bufio = require('bufio');
const assert = require('bsert');
const Multiaddr = require('multiaddr');
const mafmt = require('mafmt');

class NetAddress extends bufio.Struct {
  /**
   * @constructor
   * @param {Object} options
   * @param {String?} options.host
   * @param {Number?} options.port
   */
  constructor(options) {
    super();

    this.address = new Multiaddr('/ip4/0.0.0.0/tcp/0'); // Default address.

    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * Inject options into NetAddress.
   * @private
   * @param {Object} options
   */
  setOptions(options) {
    assert(options, '`options` not well-defined.');

    if (options.address != null) {
      assert(mafmt.TCP.matches(options.address));
      this.address = options.address;
    }
  }

  static fromString(addr) {
    assert(mafmt.TCP.matches(addr));
    const address = new Multiaddr(addr);

    return new NetAddress({ address });
  }

  static fromObject(obj) {
    assert(typeof obj.address === 'string');
    assert(typeof obj.port === 'number');
    assert(typeof obj.transport === 'string');
    const address = Multiaddr.fromNodeAddress({
      address: obj.address,
      port: obj.port,
    }, obj.transport);

    return new NetAddress({ address });
  }

  /**
   * Return the address in the format of `host:port`.
   * @returns {String}
   */
  toHost() {
    const multiaddr = this.address.nodeAddress();
    return `${multiaddr.address}:${multiaddr.port}`;
  }

  toObject() {
    return this.address.nodeAddress();
  }

  toHTTP() {
    const multiaddr = this.address.nodeAddress();
    return `http://${multiaddr.address}:${multiaddr.port}`;
  }

  toHTTPS() {
    const multiaddr = this.address.nodeAddress();
    return `https://${multiaddr.address}:${multiaddr.port}`;
  }

  /**
   * Returns the address as a multiaddr string.
   * @returns {String}
   */
  toString() {
    return this.address.toString();
  }

  /**
   * Returns the address as a Multiaddr.
   * @returns {Multiaddr}
   */
  toMultiaddr() {
    return this.address;
  }
}

module.exports = NetAddress;
