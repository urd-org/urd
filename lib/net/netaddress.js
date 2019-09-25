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
    this.addr = '/ip4/0.0.0.0/tcp/0';

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
    assert(typeof options.address === 'string');
    assert(typeof options.port === 'number');
    assert(typeof options.transport === 'string');

    const addr = Multiaddr.fromNodeAddress({
      address: options.address,
      port: options.port,
    }, options.transport);

    this.addr = addr.toString();
  }

  /**
   * Return NetAddress in the format of `host:port`.
   * @returns {String}
   */
  toStandard() {
    const nodeAddr = new Multiaddr(this.addr).nodeAddress();
    return `${nodeAddr.address}:${nodeAddr.port}`;
  }
}

module.exports = NetAddress;
