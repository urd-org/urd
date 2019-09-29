const networks = {
  types: ['main', 'testnet', 'regtest'],
};

const main = {
  type: 'main',
  seeds: [],
  magic: 0x5100efba,
  port: 10485,
  coinbaseMaturity: 1000,
  genesis: null,
  genesisBlock: null,
  rpcPort: 10484,
  walletPort: 10486,
};

const testnet = {
  type: 'testnet',
  seeds: [],
  magic: 0x4f6beaf9,
  port: 11485,
  coinbaseMaturity: 1000,
  genesis: null,
  genesisBlock: null,
  rpcPort: 11484,
  walletPort: 11486,
};

const regtest = {
  type: 'regtest',
  seeds: [],
  magic: 0xffffffff,
  port: 12485,
  coinbaseMaturity: 1000,
  genesis: null,
  genesisBlock: null,
  rpcPort: 12484,
  walletPort: 12486,
};

networks.main = main;
networks.testnet = testnet;
networks.regtest = regtest;

module.exports = networks;
