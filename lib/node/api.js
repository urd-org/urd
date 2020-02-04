/*!
 * http.js - Express server
 */

'use strict';

const express = require('express');

class API {

  /**
   * Create a node.
   * @constructor
   * @param {Object} options
   * @param {Node} options.node
   * @param {Number} options.port
   * @param {Object} options.logger - `DerivedLogger` instance create from winston's `createLogger` function.
   */
  constructor(options) {
    super();

    this.options = options;

    this.app = express();
    this.node = this.options.node;
    this.logger = this.options.logger;
  }

  start() {
    this.app.listen(this.options.port, () => {
      this.logger.info('Starting API server on: %s', this.options.port);
    });
  }
}

module.exports = API;
