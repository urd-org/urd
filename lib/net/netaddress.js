/*!
 * netaddress.js - Manages addresses.
 */

'use strict';

const assert = require('bsert');
const Multiaddr = require('multiaddr');
const mafmt = require('mafmt');

class NetAddress {
  /**
   * @constructor
   * @param {Object} options
   * @param {String?} options.host
   * @param {Number?} options.port
   */
  constructor(options) {
    this.options = options;

    this.address = '/ip4/0.0.0.0/tcp/0'; // Default address.

    if (this.options) {
      this.setOptions(this.options);
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
      if (mafmt.TCP.matches(options.address)) {
        this.address = options.address.toString();
      } else {
        assert(typeof options.address === 'string');
        assert(typeof options.port === 'number');
        assert(typeof options.transport === 'string');
        this.address = Multiaddr.fromNodeAddress({
          address: options.address,
          port: options.port,
        }, options.transport).toString();
      }
    }
  }

  /**
   * Return the address in the format of `host:port`.
   * @returns {String}
   */
  toStandard() {
    const multiaddr = new Multiaddr(this.address).nodeAddress();
    return `${multiaddr.address}:${multiaddr.port}`;
  }

  toHTTP() {
    const multiaddr = new Multiaddr(this.address).nodeAddress();
    return `http://${multiaddr.address}:${multiaddr.port}`;
  }

  /**
   * Returns the adress as a String.
   * @returns {String}
   */
  toString() {
    return this.address;
  }

  /**
   * Returns the adress as a Multiaddr.
   * @returns {Multiaddr}
   */
  toMultiaddr() {
    return new Multiaddr(this.address);
  }
}

module.exports = NetAddress;
