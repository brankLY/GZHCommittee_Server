const FabricClient = require('fabric-client');

const consts = require('./config');

const fs = require('fs');

const ClientStore = require('./client-store.js');

const debug = require('debug');
const LOG = debug('bc:create-channel');

async function createChannel() {
  try {
    const signatures = [];
    const configOrg1 = [consts.networkConfigPath, consts.org1ConfigPath];
    const configOrg2 = [consts.networkConfigPath, consts.org2ConfigPath];
    const client1 = await ClientStore.get('org1', {
      configs: configOrg1,
    });

    // get the config envelope created by the configtx tool
    const envelopeBytes = fs.readFileSync(consts.configTxPath);
    const config = client1.extractChannelConfig(envelopeBytes);

    let signature = client1.signChannelConfig(config);
    signatures.push(signature);

    const client2 = await ClientStore.get('org2', {
      configs: configOrg2,
    });
	signature = client2.signChannelConfig(config);
	
    signatures.push(signature);
    const req = {
      config,
      signatures,
      name: consts.channelName,
      txId: client2.newTransactionID(true),
      orderer: 'orderer.example.com',
    };
    const resp = await client2.createChannel(req);
    LOG('%O', resp);
    if (resp.status && resp.status === 'SUCCESS') {
      LOG('Wait for 10 seconds to ensure the channel has been created successfully');
      await consts.sleep(10000);
      LOG('Successfully Created Channel');
    } else {
      LOG('Failed to create the channel. ');
      throw new Error('Failed to create the channel');
    }
  } catch (e) {
    LOG(e);
  }
};

// module.exports = createChannel;
createChannel();