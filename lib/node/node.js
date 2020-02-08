'use strict';

const EventEmitter = require('events');
const http = require('http');
const io = require('socket.io');
const winston = require('winston');

const Database = require('../blockchain/database');
const Blockchain = require('../blockchain/blockchain');
const Network = require('../blockchain/network');
const API = require('../api/api');
const Pool = require('../net/pool');
const NetAddress = require('../net/netaddress');
const Peer = require('../net/peer');

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
   *
   * @param {Object} options.api
   * @param {Boolean} options.api.start - On/off flag for API server
   * @param {Number} options.api.port
   */
  constructor(options) {
    super();

    this.options = options;

    this.http = null;
    this.sio = null;
    this.logger = null
    this.network = null;
    this.database = null;
    this.blockchain = null;
    this.pool = null;
    this.api = null;
  }

  /**
   * Initialize without starting node.
   */
  init() {
    // Start Node server
    const httpServer = http.createServer();
    winston.addColors(levels.colors);

    this.http = httpServer;
    this.sio = io(httpServer);
    this.logger = winston.createLogger(defaultWinstonSettings);
    this.network = Network.create(this.options.network);
    this.database = new Database({
      network: this.options.network,
    });
    this.blockchain = new Blockchain({
      database: this.database,
      logger: this.logger,
      network: this.network,
      disable: this.options.blockchain.disable,
    });
    this.pool = new Pool({
      database: this.database,
    });
    this.api = new API({
      node: this,
      logger: this.logger,
      disable: this.options.api.disable,
      port: this.options.api.port,
    });
  }

  /**
   * Start node.
   */
  start() {
    // TODO: Move this part to a `HTTP` class that supports `init()` and `start()`.
    this.http.listen(this.options.port, '0.0.0.0');
    this.logger.log('info', 'Node: start - listening on port: %s', this.options.port);

    this.sio.on('connection', (socket) => {
      socket.on('disconnect', (res) => {
        this.logger.info('Disconnect peer: %s', res.trim());
      });

      socket.on('peer', (addr) => {
        // this.pool.add(new Peer({ address: new NetAddress(addr) }));
        this.logger.info('New peer: %s', addr);
      });
    });

    // Start blockchain and database
    this.blockchain.init();
    this.blockchain.start();

    // Start peer pool
    this.pool.init();

    // Start API server
    this.api.init();
    this.api.start();
  }

  stop() {
    this.sio.close();
  }
}

module.exports = Node;
