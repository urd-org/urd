'use strict';

const assert = require('bsert');

const consensus = require('./consensus');
const AccountValue = require('../accounts/accountvalue');

/**
 * Check transaction without urd server.
 * @returns {Array} [valid, reason, score]
 */
exports.txCheck = function txCheck(tx) {
  if (tx.amount < 0) {
    return [false, 'bad-txns-amount-negative', 100];
  }

  if (!Number.isSafeInteger(tx.amount)) {
    return [false, 'bad-txns-amount-notsafeinteger', 10];
  }

  if (!Number.isInteger(tx.amount)) {
    return [false, 'bad-txns-amount-notinteger', 100];
  }

  if (!consensus.moneyRange(tx.amount)) {
    return [false, 'bad-txns-amount-outofrange', 100];
  }

  if (!consensus.nonceRange(tx.nonce)) {
    return [false, 'bad-txns-nonce-outofrange', 100];
  }

  return [true, 'valid', 0];
};

/**
 * Verify transaction using the urd server.
 * @param {Transaction} transaction - `urkel` Transaction instance.
 * @returns {Array} [valid, reason, score]
 */
exports.txVerify = async function txVerify(transaction, tx) {
  // Run the `txCheck` first and only continue if it passes.
  const [valid, reason, score] = exports.txCheck(tx);

  if (!valid) {
    return [valid, reason, score];
  }

  const value = AccountValue.decode(await transaction.get(tx.from.hash));

  if (value.amount - tx.amount < 0) {
    return [false, 'bad-txns-amount-accountnegative', 10];
  }

  if (value.nonce !== tx.nonce) {
    return [false, 'bad-txns-nonce-nonequalnonce', 10];
  }

  // TODO: Verify that receiving address does not do anything weird.

  return [true, 'valid', 0];
};
