'use strict';

const EventEmitter = require('events');
const http = require('http');
const io = require('socket.io');
const ioc = require('socket.io-client');
const winston = require('winston');

const Blockchain = require('../blockchain/blockchain');
const Network = require('../blockchain/network');
const networks = require('../blockchain/networks');
const API = require('../api/api');
const Pool = require('../net/pool');
const NetAddress = require('../net/netaddress');
const Peer = require('../net/peer');

const { format } = winston;
const { combine, timestamp, label, printf } = format;
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
    warn: 'orange',
    info: 'yellow',
    verbose: 'green',
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

    this.sio = null;
    this.logger = null
    this.network = null;
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
    this.blockchain = new Blockchain({
      network: this.network,
    });
    this.pool = new Pool();

    if (this.options.api.start) {
      this.api = new API({
        start: this.options.api.start,
        port: this.options.api.port,
        node: this,
        logger: this.logger,
      });
    }
  }

  /**
   * Start node.
   */
  start() {
    this.http.listen(this.options.port, '0.0.0.0');
    this.logger.log('info', 'Node: start - listening on port: %s', this.options.port);

    this.sio.on('connection', (socket) => {
      socket.on('disconnect', (res) => {
        this.logger.info('Disconnect peer: %s', res.trim());
      });

      socket.on('peer', (addr) => {
        this.pool.add(new Peer({ address: new NetAddress(addr) }));
        this.logger.info('Add peer: %s', addr);
      });
    });

    // Start API server
    this.api.init();
    this.api.start();
  }

  stop() {
    this.sio.close();
  }
}

module.exports = Node;
