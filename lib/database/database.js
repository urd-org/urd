/*!
 * database.js - Key-value database for web and Node.js.
 */

'use strict';

const assert = require('bsert');
const level = require('level');

class Database {
  /**
   * Create a database.
   * @param {Object} options
   * @param {Network} options.network
   */
  constructor(options) {
    this.opened = false;
    this.database = {
      get: () => {},
      put: () => {},
      del: () => {},
    };
    this.web = false;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    // if (options.disabled != null) {
    //   assert(typeof options.disabled === 'boolean');
    //   this.disabled = options.disabled;
    // }

    // if (!options.disabled) {
    //   this.database = level('leveldb');
    // }

    if (typeof window !== 'undefined') {
      this.web = true;
    }
  }

  isOpen() {
    return this.opened;
  }

  async open() {
    assert(!this.opened, 'Database is already open.');

    this.opened = true;
    this.database = await level('leveldb', { valueEncoding: 'binary' });
  }

  async close() {
    assert(this.opened, 'Database is already closed.');

    this.opened = false;
    return this.database.close();
  }

  async get(key) {
    return this.database.get(key);
  }

  async set(key, value) {
    return this.database.put(key, value);
  }

  async remove(key) {
    return this.database.del(key);
  }
}

module.exports = Database;
