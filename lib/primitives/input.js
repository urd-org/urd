'use strict';

const bufio = require('bufio');
const assert = require('bsert');

const Output = require('./output');

class Input extends bufio.Struct {
  constructor(options) {
    super();

    this.prevout = new Output();

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.prevout != null) {
      assert(options.prevout instanceof Output);
      this.prevout = options.prevout;
    }
  }

  isCoinbase() {
    return this.prevout.isNull();
  }

  write(bw) {
    const bytes = this.prevout.encode();

    bw.writeU8(bytes.length);
    bw.writeBytes(bytes);

    return bw;
  }

  read(br) {
    // TODO: size should be fixed, and should be set as `getSize` in Output.
    const size = br.readU8();
    const prevout = Output.decode(br.readBytes(size));
    assert(prevout instanceof Output);

    return this.setOptions({ prevout });
  }
}

module.exports = Input;
