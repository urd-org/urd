/*!
 * packet.js
 */

'use strict';

exports.types = {
  VERSION: 0,
  VERACK: 1,
  PING: 2,
  PONG: 3,
  GETADDR: 4,
  ADDR: 5,
  GETDATA: 7,
  NOTFOUND: 8,
  GETBLOCKS: 9,
  GETHEADERS: 10,
  HEADERS: 11,
  SENDHEADERS: 12,
  BLOCK: 13,
  TX: 14,
  REJECT: 15,
  MEMPOOL: 16,
  FILTERLOCK: 23,
  GETBLOCKTXN: 24,
  BLOCKTXN: 25,
  GETPROOF: 26,
  PROOF: 27,
  UNKNOWN: 30,
};

class Packet {
  constructor() {
    this.type = null;
    this.bytes = null;
  }


}

module.exports = Packet;
