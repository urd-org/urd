/*!
 * block.js
 */

'use strict';

class Block {
  constructor() {
    this.height = -1;
    this.txs = [];
    this.time = 0;
    this.nonce = 0;
    this.prevBlockHash = null;
  }
}
