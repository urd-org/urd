'use strict';

const bufio = require('bufio');

exports.isU64 = function isU64(num) {
  return Number.isSafeInteger(num) && num >= 0;
};

exports.writeU64 = function writeU64(num) {
  return bufio.write().writeU64(num).render();
};

exports.readU64 = function readU64(buf) {
  return bufio.read(buf).readU64();
};
