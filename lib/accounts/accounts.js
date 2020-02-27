/*!
 * accounts.js - manages all the accounts
 */

const assert = require('bsert');
const { Tree } = require('urkel');
const SHA256 = require('bcrypto/lib/sha256');

const StateTree = require('./statetree');
const Address = require('../primitives/address');

class Accounts {
  constructor() {
    this.statetree = StateTree.fromTree(new Tree(SHA256, 160, './coins'));
  }

  async get(address) {
    assert(address instanceof Address);
    return this.statetree.get(address);
  }

  // async lifecycle(txs, options = {}) {
  //   assert(Array.isArray(txs));
  //   assert(txs.every(tx => tx instanceof Tx), 'Not all elements is an Tx for lifecycle.');
  //
  //   const treeTx = await this.tree.transaction();
  //
  //   for await (const tx of txs.map(tx => treeTx.insert(tx))) {
  //     console.log(tx);
  //   }
  //
  //   // txs.forEach(async (tx) => {
  //   //   await treeTx.insert(tx);
  //   // });
  //
  //   if (options.commit != null && options.commit === true) {
  //     return await treeTx.commit();
  //   }
  //
  //   return await treeTx.getRoot();
  // }
}

module.exports = Accounts;
