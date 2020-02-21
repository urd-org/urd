'use strict';

const bufio = require('bufio');
const assert = require('bsert');

const Address = require('./address');

class Output extends bufio.Struct {
  constructor(options) {
    super();

    this.value = 0;
    this.address = new Address();

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.value != null) {
      assert(options.value >= 0);
      this.value = options.value;
    }

    if (options.address != null) {
      assert(options.address instanceof Address);
      this.address = options.address;
    }
  }

  isNull() {
    return this.value === 0 && this.address.isNull();
  }

  write(bw) {
    bw.writeU64(this.value);

    const encodedAddress = this.address.encode();

    bw.writeU8(encodedAddress.length);
    bw.writeBytes(encodedAddress);
    return bw;
  }

  read(br) {
    const value = br.readU64();
    assert(value > 0);

    // TODO: `size` should be fetched from a `getSize` method.
    // `size` should be fixed.
    // Use `isU64` with assert to make sure size is fixed.
    const size = br.readU8();
    const address = Address.decode(br.readBytes(size));
    assert(address.hash.length >= 2 || address.hash.length <= 40);

    return this.setOptions({ value, address });
  }
}

module.exports = Output;
