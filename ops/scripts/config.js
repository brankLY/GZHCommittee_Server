const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const chaincodeId = '5813dc05-c645-4cb2-ad73-159a9375517b';
const chaincodeVersion = 'v1';
const chaincodePath = path.resolve(__dirname, '../../chaincode');

const channelName = 'mychannel';

const networkConfigPath = path.resolve(__dirname, '../network/network.yaml');
const org1ConfigPath = path.resolve(__dirname, '../network/org1.yaml');
const org2ConfigPath = path.resolve(__dirname, '../network/org2.yaml');
const configTxPath = path.resolve(__dirname, '../network/channel.tx');

module.exports = {
  sleep,

  chaincodeId,
  chaincodeVersion,
  chaincodePath,

  channelName,

  networkConfigPath,
  org1ConfigPath,
  org2ConfigPath,
  configTxPath,
};
