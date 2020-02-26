/*!
 * coins.js - manages all the accounts
 */

const assert = require('bsert');
const { Tree, Proof } = require('urkel');
const SHA256 = require('bcrypto/lib/sha256');

const Address = require('../primitives/address');

class Accounts {
  constructor() {
    this.tree = new Tree(SHA256, 160, './coins');
  }

  open() {
    this.tree.open();
  }

  close() {
    this.tree.close();
  }

  async get(address) {
    assert(address instanceof Address);
    return this.tree.get(address.hash);
  }
}

module.exports = Accounts;
