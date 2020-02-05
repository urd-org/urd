/*!
 * database.js - Key-value database for web and Node.js.
 */

'use strict';

const level = require('level');
const assert = require('bsert');

class Database {

  /**
   * Create a database.
   * @param {Object} options
   * @param {Network} options.network
   */
  constructor(options) {
    this.options = options;

    this.network = null;
    this.database = null;
    this.web = false;
  }

  init() {
    this.network = this.options.network;
    this.database = level('leveldb');

    if (typeof window !== 'undefined') {
      this.web = true;
    }
  }

  get(key) {
    return this.database.get(key);
  }

  set(key, value) {
    return this.database.put(key, value);
  }

  remove(key) {
    return this.database.del(key);
  }
}

module.exports = Database;
