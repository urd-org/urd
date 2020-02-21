'use strict';

const EventEmitter = require('events');
const http = require('http');
const io = require('socket.io');
const winston = require('winston');
const assert = require('bsert');

const Database = require('../blockchain/database');
const Blockchain = require('../blockchain/blockchain');
const Network = require('../blockchain/network');
const API = require('../api/api');
const Pool = require('../net/pool');
const NetAddress = require('../net/netaddress');
const Peer = require('../net/peer');
const Connection = require('../net/connection');

const { format } = winston;
const { combine, timestamp, printf } = format;
const levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    verbose: 'white',
    debug: 'grey',
  },
};
const defaulWinstontFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}] ${message}`;
});
const defaultWinstonSettings = {
  levels: levels.levels,
  format: combine(
    winston.format.colorize(),
    format.splat(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    defaulWinstontFormat,
  ),
  transports: [
    new winston.transports.Console(),
  ],
};

class Node extends EventEmitter {
  /**
   * Create a node.
   * @constructor
   * @param {Object} options
   * @param {Number} options.port
   * @param {Object} options.network
   * @param {Object} options.api
   * @param {Boolean} options.api.start - On/off flag for API server
   * @param {Number} options.api.port
   */
  constructor(options) {
    super();

    this.http = null;
    this.sio = null;
    this.logger = null
    this.network = null;
    this.database = null;
    this.blockchain = null;
    this.pool = null;
    this.api = null;
    this.port = 3000;

    if (options) {
      this.setOptions(options);
    }
  }

  /**
   * Initialize without starting node.
   */
  setOptions(options) {
    // Start Node server
    const httpServer = http.createServer();
    winston.addColors(levels.colors);

    this.http = httpServer;
    this.sio = io(httpServer);
    this.logger = winston.createLogger(defaultWinstonSettings);
    this.network = Network.create(options.network);
    this.database = new Database({
      network: options.network,
      ...options.database,
    });
    this.blockchain = new Blockchain({
      database: this.database,
      logger: this.logger,
      network: this.network,
      ...options.blockchain,
    });
    this.pool = new Pool({
      database: this.database,
      logger: this.logger,
    });
    this.api = new API({
      node: this,
      logger: this.logger,
      ...options.api,
    });

    if (options.port != null) {
      assert(typeof options.port === 'number');
      this.port = options.port;
    }
  }

  /**
   * Start node.
   */
  start() {
    // Start blockchain and database
    this.blockchain.start();

    // Start API server
    this.api.start();

    // TODO: Move this part to a `HTTP` class that supports `init()` and `start()`.
    this.http.listen(this.port, '0.0.0.0');
    this.sio.on('connect', (socket) => {
      const conn = Connection.fromSocket(socket);
      const { address, port } = conn.peer.address.toObject();
      this.logger.log('info', 'Connected (Inbound): %s:%s', address, port);
    });

    this.logger.log('info', 'Node started - listening on port: %s', this.port);

    // this.pool.connect('/ip4/127.0.0.1/tcp/3001');

    // setTimeout(() => {
    //   console.log(this.pool.connectionPool);
    // }, 5000);
  }

  stop() {
    this.sio.close();
  }
}

module.exports = Node;
