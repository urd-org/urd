/*!
 * netaddress.js - Manages addresses.
 */

'use strict';

const assert = require('bsert');
const Multiaddr = require('multiaddr');

class NetAddress {
  /**
   * @constructor
   * @param {Object} options
   * @param {String?} options.host
   * @param {Number?} options.port
   */
  constructor(options) {
    this.address = '/ip4/0.0.0.0/tcp/0';

    if (options) {
      this.fromOptions(options);
    }
  }

  /**
   * Inject options into NetAddress.
   * @private
   * @param {Object} options
   */
  fromOptions(options) {
    let addr;

    if (typeof options === 'string' || options instanceof Multiaddr) {
      addr = options;
    } else {
      assert(typeof options.address === 'string');
      assert(typeof options.port === 'number');
      assert(typeof options.transport === 'string');

      addr = Multiaddr.fromNodeAddress({
        address: options.address,
        port: options.port,
      }, options.transport);
    }

    this.address = addr.toString();
  }

  /**
   * Return NetAddress in the format of `host:port`.
   * @returns {String}
   */
  toStandard() {
    const nodeAddr = new Multiaddr(this.address).nodeAddress();
    return `${nodeAddr.address}:${nodeAddr.port}`;
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
