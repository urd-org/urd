'use strict';

const assert = require('bsert');
const bufio = require('bufio');

const AccountValue = require('./accountvalue');
const Address = require('../primitives/address');

class Account extends bufio.Struct {
  constructor(options) {
    super();

    this.address = new Address();
    this.value = new AccountValue();

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.address != null) {
      assert(options.address instanceof Address);
      this.address = options.address;
    }

    if (options.value != null) {
      assert(options.value instanceof AccountValue);
      this.value = options.value;
    }
  }
}

module.exports = Account;
