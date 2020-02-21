'use strict';

const assert = require('bsert');

const Connection = require('./connection');

class ConnectionPool {
  constructor() {
    this.pool = new Map();
  }

  /**
   * Add a Connection to the pool.
   * @param {Connection} connection
   */
  add(connection) {
    if (connection instanceof Connection) {
      this.pool.set(connection.peer.address.toString(), connection);
    }
  }

  /**
   * Remove a Connection from the pool.
   * @param {Connection} connection
   */
  remove(connection) {
    assert(connection instanceof Connection);
    this.pool.remove(connection.peer.address.toString());
  }
}

module.exports = ConnectionPool;
