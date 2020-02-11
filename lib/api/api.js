/*!
 * http.js - Express server
 */

'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const assert = require('bsert');

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
    this.app = null;
    this.node = null;
    this.logger = null;
    this.port = 8000;
    this.disabled = false;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    this.app = express();
    this.node = options.node;
    this.logger = options.logger;

    if (options.port != null) {
      assert(typeof options.port === 'number');
      this.port = options.port;
    }

    if (options.disabled != null) {
      assert(typeof options.disabled === 'boolean');
      this.disabled = options.disabled;
    }

    this.app.use('/graphql', graphqlHTTP({
      schema: Schema,
      graphiql: true,
      context: this.node,
    }));
    this.app.get('/', (req, res) => {
      res.send('ok');
    });
  }

  start() {
    if (!this.disabled) {
      this.app.listen(this.port, () => {
        this.logger.info('Starting API server on: %s', this.port);
      });
    } else {
      this.logger.warn('API Server disabled.');
    }
  }
}

module.exports = API;
