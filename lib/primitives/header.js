'use strict';

const assert = require('bsert');
const bufio = require('bufio');

const ZERO_HASH = Buffer.alloc(32, 0x00);

class Header extends bufio.Struct {
  constructor(options) {
    super();

    // 88-byte header

    this.version = 0; // 4-bytes
    this.height = -1; // 8-bytes
    this.time = -1; // 8-bytes
    this.nonce = -1; // 4-bytes
    this.prevBlockHash = ZERO_HASH; // 32-bytes
    this.stateRoot = ZERO_HASH; // 32-bytes

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.version != null) {
      assert(typeof options.version === 'number');
      this.version = options.version;
    }

    if (options.height != null) {
      assert(typeof options.height === 'number');
      this.height = options.height;
    }

    if (options.time != null) {
      assert(typeof options.time === 'number');
      this.time = options.time;
    }

    if (options.nonce != null) {
      assert(typeof options.nonce === 'number');
      this.nonce = options.nonce;
    }

    if (options.prevBlockHash != null) {
      assert(options.prevBlockHash instanceof Buffer);
      assert(options.prevBlockHash.length === 32);
      this.prevBlockHash = options.prevBlockHash;
    }

    if (options.stateRoot != null) {
      assert(options.stateRoot instanceof Buffer);
      assert(options.stateRoot.length === 32);
      this.stateRoot = options.stateRoot;
    }
  }

  static getSize() {
    return 88;
  }

  write(bw) {
    bw.writeU32(this.version);
    bw.writeU64(this.height);
    bw.writeU64(this.time);
    bw.writeU32(this.nonce);

    bw.writeBytes(this.prevBlockHash);
    bw.writeBytes(this.stateRoot);

    return bw;
  }

  read(br) {
    this.version = br.readU32();
    this.height = br.readU64();
    this.time = br.readU64();
    this.nonce = br.readU32();

    this.prevBlockHash = br.readBytes(32);
    this.stateRoot = br.readBytes(32);

    return this;
  }
}

module.exports = Header;
