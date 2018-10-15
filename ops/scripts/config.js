const path = require('path');
const moment = require('moment');
const uuid = require('uuid');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getVersion() {
  const now = moment();
  return now.format('YYYYMMDDHHmm');
}

// const chaincodeId = '8f3a4ce9-df5b-46f6-905a-17446d6cfc01';
// const chaincodeVersion = getVersion();
// const chaincodePath = path.resolve(__dirname, '../../chaincode');
// const contractAccountId = '8f3a4ce9-df5b-46f6-905a-17446d6cfc01'
const channelName = 'mychannel';

const chaincode = {
  chaincodeId: '8f3a4ce9-df5b-46f6-905a-17446d6cfc01',
  chaincodeVersion: getVersion(),
  chaincodePath: path.resolve(__dirname, '../../chaincode'),
  contractAccountId: '8f3a4ce9-df5b-46f6-905a-17446d6cfc01',
};

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

  chaincode
};
