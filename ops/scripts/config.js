const path = require('path');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const chaincodeId = '8f3a4ce9-df5b-46f6-905a-17446d6cfc01';
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
