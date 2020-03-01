'use strict';

const assert = require('bsert');
const { Tree } = require('urkel');
const bufio = require('bufio');
const BN = require('bcrypto/lib/bn.js');

const Tx = require('../primitives/tx');
const AccountValue = require('./accountvalue');

const ZERO = new BN(0, 'be');

class StateTree {
  constructor(options) {
    this.tree = null;
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

  async get(address) {
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

  async insert(tx) {
    assert(tx instanceof Tx);

    const fromRaw = await this.transaction.get(tx.from.hash);
    const toRaw = await this.transaction.get(tx.to.hash);

    const fromValue = AccountValue.decode(fromRaw);
    const toValue = AccountValue.decode(toRaw);

    const txAmount = new BN(tx.amount, 'be');
    const txNonce = new BN(tx.nonce, 'be');

    if (!fromValue.nonce.eq(txNonce)) {
      throw new Error('Transaction nonce is not equal to account nonce.');
    }

    if (
      tx.isValid() &&
      !fromValue.amount.isNeg() &&
      fromValue.amount.sub(txAmount).gte(ZERO) &&
      fromValue.nonce.eq(txNonce)
    ) {
      // TODO: verify that the tx is finalized before commiting
      fromValue.amount = fromValue.amount.sub(txAmount);
      fromValue.nonce = fromValue.nonce.add(new BN('1', 'be'));
      toValue.amount = toValue.amount.add(txAmount);

      await this.transaction.insert(tx.from.hash, fromValue.encode());
      await this.transaction.insert(tx.to.hash, toValue.encode());
    }
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
