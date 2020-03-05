'use strict';

const assert = require('bsert');
const { Tree } = require('urkel');
const SHA256 = require('bcrypto/lib/sha256');

const Account = require('./account');
const AccountValue = require('./accountvalue');
const consensus = require('../consensus');
const Tx = require('../primitives/tx');

class StateTree {
  constructor(options) {
    this.tree = new Tree(SHA256, 160, './state_tree');
    this.transaction = null;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.tree != null) {
      assert(options.tree instanceof Tree);
      this.tree = options.tree;
    }
  }

  static fromTree(tree) {
    assert(tree instanceof Tree);
    return new StateTree({ tree });
  }

  async open() {
    await this.tree.open();
  }

  async close() {
    await this.tree.close();
  }

  async getAccount(address) {
    const value = await this.getValue(address);

    return new Account({ address, value });
  }

  async getValue(address) {
    const raw = await this.tree.get(address.hash);

    if (raw == null) {
      return null;
    }

    return AccountValue.decode(raw);
  }

  async startTransaction() {
    this.transaction = await this.tree.transaction();
  }

  async commitTransaction() {
    const root = await this.transaction.commit();
    this.transaction = null;

    return root;
  }

  clearTransaction() {
    this.transaction.clear();
    this.transaction = null;
  }

  async insert(tx) {
    assert(tx instanceof Tx);

    // Verify on `Transaction`
    const [valid, reason] = await consensus.tx.txVerify(this.transaction, tx);

    if (!valid) {
      console.log(valid, reason);
      return;
    }

    // Get value from `Transaction` snapshot and not from state tree.
    const fromValue = AccountValue.decode(await this.transaction.get(tx.from.hash));
    const toValue = AccountValue.decode(await this.transaction.get(tx.to.hash));

    // Mutate AccountValues to insert into `Transaction`.
    fromValue.setOptions({
      amount: fromValue.amount - tx.amount,
      nonce: fromValue.nonce + 1,
    });
    toValue.setOptions({ amount: toValue.amount + tx.amount }),

    await this.transaction.insert(tx.from.hash, fromValue.encode());
    await this.transaction.insert(tx.to.hash, toValue.encode());
  }

  async insertTxs(txs) {
    assert(Array.isArray(txs) === true);

    // Sort transactions by smallest nonce to highest nonce.
    const sortedTxs = txs.sort((a, b) => a.nonce - b.nonce);

    for (const tx of sortedTxs) {
      await this.insert(tx);
    }
  }
}

module.exports = StateTree;
