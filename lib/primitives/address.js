'use strict';

const assert = require('bsert');
const bufio = require('bufio');
const bech32 = require('bcrypto/lib/encoding/bech32');
const SHA256 = require('bcrypto/lib/sha256');

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

  static fromPublicKey(publicKey) {
    assert(publicKey instanceof Buffer);
    assert(publicKey.length === 64);
    return new Address({ hash: truncateTo160(SHA256.digest(publicKey)) });
  }

  static fromSHA256(hash, version = 0) {
    assert(hash instanceof Buffer);
    assert(typeof version === 'number');

    return new Address({ hash: truncateTo160(hash), version });
  }

  static fromBech32(addr) {
    assert(typeof addr === 'string');

    const [hrp, version, hash] = bech32.decode(addr);
    return new Address({ hrp, hash: truncateTo160(hash), version });
  }

  toBech32() {
    return bech32.encode(this.hrp, this.version, this.hash);
  }

  isValid() {
    assert(this.version >= 0);

    if (this.version > 31)
      return false;

    if (this.hash.length < 20 || this.hash.length > 20)
      return false;

    return true;
  }

  isNull() {
    return this.hash === ZERO_HASH160;
  }

  getSize() {
    return 1 + 1 + this.hash.length;
  }

  write(bw) {
    bw.writeU8(this.version);
    bw.writeU8(this.hash.length);
    bw.writeBytes(this.hash);
    return bw;
  }

  read(br) {
    const version = br.readU8();
    assert(version <= 31);

    const size = br.readU8();
    assert(size >= 2 && size <= 40);

    const hash = br.readBytes(size);

    return this.setOptions({ hash, version });
  }
}

module.exports = Address;
