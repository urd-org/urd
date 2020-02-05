/*!
 * http.js - Express server
 */

'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');

const Schema = require('./graphql/Schema');

class API {

  /**
   * Create a node.
   * @constructor
   * @param {Object} options
   * @param {boolean} options.start
   * @param {Number} options.port
   * @param {Node} options.node
   * @param {Object} options.logger - `DerivedLogger` instance create from winston's `createLogger` function.
   */
  constructor(options) {
    this.options = options;

    this.app = null;
    this.node = null;
    this.logger = null;
    this.port = null;
  }

  init() {
    this.app = express();
    this.node = this.options.node;
    this.logger = this.options.logger;
    this.port = this.options.port;

    this.app.use('/graphql', graphqlHTTP({ schema: Schema, graphiql: true }));
    this.app.get('/', (req, res) => {
      res.send('ok');
    });
  }

  start() {
    this.app.listen(this.port, () => {
      this.logger.info('Starting API server on: %s', this.port);
    });
  }
}

module.exports = API;
