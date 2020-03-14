/* eslint-env mocha */
/* eslint prefer-arrow-callback: "off" */

'use strict';

const assert = require('bsert');
const secp256k1 = require('bcrypto/lib/secp256k1');
const bech32 = require('bcrypto/lib/encoding/bech32');

const Address = require('../lib/primitives/address');

describe('Address', function() {
  it('should create address from public key', () => {
    const publicKey = Buffer.from('02a8192b45039c03dd522eb73143d6f1162f8490525f8f9a0e94b2b6954e99c803', 'hex');
    assert(secp256k1.publicKeyVerify(publicKey));

    const addr = Address.fromPublicKey(publicKey);
    assert(addr.isValid());
  });

  it('should create address from bech32', () => {
    const b32 = 'urd1qqrlz4r5ywpn8sz945ngdpk74mexuyy3c9sgrhm';
    assert(bech32.is(b32));

    const addr = Address.fromBech32(b32);
    assert(addr.isValid());
  });

  it('should create address from sha256', () => {
    const hash = Buffer.from('77ee665be7a54e2806843fc000fe2a8e8470667808b5a4d0d0dbd5de4dc21238', 'hex');
    assert(hash.length === 32);

    const addr = Address.fromSHA256(hash);
    assert(addr.isValid());
  });

  it('should encode and decode address', () => {
    const hash = Buffer.from('00fe2a8e8470667808b5a4d0d0dbd5de4dc21238', 'hex');
    const addr = new Address({ hash });

    assert(
      Buffer.compare(
        Address.decode(addr.encode()).hash,
        hash
      ) === 0
    );
  });
});
