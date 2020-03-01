/*!
 * consensus.js
 */

'use strict';

/**
 * One urd in microurds.
 */
exports.COIN = Math.pow(10, 6);

/**
 * Maximum amount of money in microurds (consensus).
 */
exports.MAX_MONEY = 1e9 * exports.COIN;

exports.moneyRange = function moneyRange(amount) {
  return (amount >= 0 && amount < exports.MAX_MONEY);
};

exports.nonceRange = function nonceRange(nonce) {
  return (nonce >= 0);
};
