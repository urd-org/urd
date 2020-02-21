'use strict';

const bufio = require('bufio');
const Address = require('./address');

class Tx extends bufio.Struct {
  constructor() {
    super();

    this.from = new Address();
    this.to = new Address();
    this.value = -1;
    this.nonce = 0;
  }
}

module.exports = Tx;
