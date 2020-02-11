/*!
 * database.js - Key-value database for web and Node.js.
 */

'use strict';

const level = require('level');

class Database {
  /**
   * Create a database.
   * @param {Object} options
   * @param {Network} options.network
   */
  constructor(options) {
    this.network = null;
    this.database = null;
    this.web = false;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    this.network = options.network;
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
