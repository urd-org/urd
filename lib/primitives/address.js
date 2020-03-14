'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const bech32 = require('bcrypto/lib/encoding/bech32');
const SHA256 = require('bcrypto/lib/sha256');
const inspect = Symbol.for('nodejs.util.inspect.custom');

const ZERO_HASH160 = Buffer.alloc(20, 0x00);

function truncateTo160(buffer) {
  if (buffer.length - 20 < 0) {
    throw new Error('Size too short.');
  }

  const block = Buffer.allocUnsafe(20);
  buffer.copy(block, 0, buffer.length - 20, buffer.length);

  return block;
}

class Address extends bufio.Struct {
  constructor(options) {
    super();

    this.hrp = 'urd';
    this.version = 0;
    this.hash = ZERO_HASH160;

    if (options) {
      this.setOptions(options);
    }
  }

  setOptions(options) {
    assert(options);

    if (options.version != null) {
      assert(typeof options.version === 'number');
      assert(options.version >= 0);
      this.version = options.version;
    }

    if (options.hash != null) {
      assert(options.hash instanceof Buffer);
      assert(options.hash.length === 20);
      this.hash = options.hash;
    }
  }

  fromPublicKey(publicKey) {
    assert(publicKey instanceof Buffer);
    assert(publicKey.length === 33);

    this.setOptions({
      hash: truncateTo160(SHA256.digest(publicKey))
    });

    return this;
  }

  static fromPublicKey(publicKey) {
    return new this().fromPublicKey(publicKey)
  }

  fromSHA256(hash) {
    assert(hash instanceof Buffer);

    this.setOptions({
      hash: truncateTo160(hash),
    });

    return this;
  }

  static fromSHA256(hash) {
    return new this().fromSHA256(hash);
  }

  fromBech32(addr) {
    assert(typeof addr === 'string');

    const [hrp, version, hash] = bech32.decode(addr);
    this.setOptions({ hrp, hash: truncateTo160(hash), version })

    return this;
  }

  static fromBech32(addr) {
    return new this().fromBech32(addr);
  }

  toBech32() {
    return bech32.encode(this.hrp, this.version, this.hash);
  }

  isValid() {
    assert(this.version >= 0);

    if (this.version > 31) {
      return false;
    }

    if (this.hash.length !== 20) {
      return false;
    }

    return true;
  }

  isNull() {
    return this.hash === ZERO_HASH160;
  }

  getSize() {
    return 21;
  }

  write(bw) {
    bw.writeU8(this.version);
    bw.writeBytes(this.hash);

    return bw;
  }

  read(br) {
    const version = br.readU8();
    assert(version <= 31);
    this.version = version;

    this.hash = br.readBytes(20);

    return this;
  }

  [inspect]() {
    return `Address <${this.toBech32()}>`;
  }
}

module.exports = Address;
