'use strict';

/**
 * Key layout:
 *   V -> db version
 *   R -> tip hash
 *   H[height] -> hash
 *   h[hash] -> height
 *   n[hash] -> next hash
 *   header[hash] -> Header
 *   block[hash] -> Block
 *   tx[tx hash] -> Tx
 *   peer[address] -> Peer
 * where `hash` is block hash.
 */

exports.V = 'V';

exports.R = 'R';

exports.H = (height) => {
  return `H[${height}]`;
};

exports.h = (hash) => {
  return `h[${hash.toString('hex')}]`;
};

exports.n = (hash) => {
  return `n[${hash.toString('hex')}]`;
};

exports.header = (hash) => {
  return `header[${hash.toString('hex')}]`;
};

exports.block = (hash) => {
  return `block[${hash.toString('hex')}]`;
};

exports.tx = (hash) => {
  return `tx[${hash.toString('hex')}]`;
};
