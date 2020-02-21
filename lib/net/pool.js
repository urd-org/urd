/*!
 * pool.js - Pool management of peers.
 */

'use strict';

const EventEmitter = require('events');
const assert = require('bsert');
const cio = require('socket.io-client');
const Multiaddr = require('multiaddr');

const Peer = require('./peer');
const NetAddress = require('./netaddress');
const Connection = require('./connection');
const ConnectionPool = require('./connectionpool');
const Database = require('../blockchain/database');


/*

// Tries to connect, if connected, adds to ConnectionPool and removes from AddressPool.
this.pool.connect(strAddrKey: string);

// Tries to disconnect, if disconnected, remove from ConnectionPool.
this.pool.disconnect(strAddrKey: string);

// Add or Remove a Connection from ConnectionPool
this.pool.connectionPool.add(Connection);
this.pool.connectionPool.remove(Connection);

// Add or Remove a NetAddress from AddressPool
this.pool.addressPool.add(NetAddress);
this.pool.addressPool.remove(NetAddress);

*/

class Pool extends EventEmitter {
  constructor(options) {
    super();

    this.database = null;
    this.logger = null;
    this.connectionPool = new ConnectionPool();
    this.addressPool = [];

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.database != null) {
      assert(options.database instanceof Database);
      this.database = options.database;
    }

    if (options.logger != null) {
      assert(typeof options.logger === 'object');
      this.logger = options.logger;
    }
  }

  /**
   * Connect to a server- or client node.
   */
  connect(netaddr) {
    assert(netaddr instanceof NetAddress);
    const socket = cio(netaddr.toHTTP());
    const conn = Connection.fromSocket(socket);

    socket.on('connect', () => {
      this.connectionPool.add(conn);
    });
  }

  /**
   * Disconnect a connection from `connections` map.
   */
  disconnect(netaddr) {
    assert(netaddr instanceof NetAddress);
    // this.connectionPool.get(addr.toString()).socket.disconnect(true)
  }

  /**
   * Save peer to database.
   * @param {Peer} peer
   */
  save(peer) {
    assert(peer instanceof Peer);
    // TODO: Decide key formatting and find a way to serialize peer object.
    // this.database.set();
  }

  /**
   * Delete peer from database.
   * @param {Peer} peer
   */
  delete(peer) {
    assert(peer instanceof Peer);
    // TODO: Delete peer from database.
  }

  // /* Call this when a connection is created. */
  // handleInboundConnect(socket) {
  //   const { remoteAddress, remotePort } = socket.request.connection;
  //
  //   socket.on('disconnect', (res) => {
  //     this.logger.info('Disconnect peer: %s', res.trim());
  //   });
  //
  //   const netaddr = new NetAddress({
  //     address: remoteAddress,
  //     port: remotePort,
  //     transport: 'tcp',
  //   });
  //   const peer = new Peer({
  //     address: netaddr,
  //   });
  //   const conn = new Connection({ peer, socket });
  //
  //   this.addConnection(conn);
  //   this.logger.log('info', 'Connected (Inbound): %s:%s', remoteAddress, remotePort);
  // }
  //
  // handleOutboundConnect(socket) {
  //   const { hostname, port } = socket.io.opts;
  //
  //   socket.on('disconnect', (res) => {
  //     this.logger.info('Disconnect peer: %s', res.trim());
  //   });
  //
  //   const netaddr = new NetAddress({
  //     address: hostname,
  //     port: parseInt(port, 10),
  //     transport: 'tcp',
  //   });
  //   const peer = new Peer({
  //     address: netaddr,
  //   });
  //   const conn = new Connection({ peer, socket, outbound: true });
  //
  //   this.addConnection(conn);
  //   this.logger.log('info', 'Connected (Outbound): %s:%s', hostname, port);
  // }
}

module.exports = Pool;
