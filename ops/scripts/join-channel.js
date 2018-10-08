
const Consts = require('./config.js');

const LOG = require('debug')('bc:join-channel');
const ClientStore = require('./client-store.js');

LOG('join channel, start');

async function joinChannel() {
  try {
    const configOrg1 = [Consts.networkConfigPath, Consts.org1ConfigPath];
    const configOrg2 = [Consts.networkConfigPath, Consts.org2ConfigPath];
    const client1 = await ClientStore.get('org1', {
      configs: configOrg1,
    });

    // get channel, throw error if any error happened
    const channelFromClient1 = client1.getChannel(Consts.channelName, true);

    // get genesisBlock
    let txId = client1.newTransactionID(true);
    let request = { txId };
    const genesisBlock = await channelFromClient1.getGenesisBlock(request);
    LOG('Successfully get getGenesisBlock from Orderer');

    // org1 Join Channel
    txId = client1.newTransactionID(true);
    request = {
      targets: ['peer0.org1.example.com'],
      txId,
      block: genesisBlock,
    };
    let resp = await channelFromClient1.joinChannel(request);
    LOG('org1 joinChannel response :: %j', resp);
    if (resp[0] && resp[0].response && resp[0].response.status === 200) {
      LOG('org1 Successfully joined Channel');
    } else {
      LOG('org1 failed to join channel');
    }

    // checkout to org2 identity
    const client2 = await ClientStore.get('org2', {
      configs: configOrg2,
    });
    // org2 Join Channel
    txId = client2.newTransactionID(true);
    request = {
      targets: ['peer0.org2.example.com'],
      txId,
      block: genesisBlock,
    };
    const channelFromClient2 = client2.getChannel(Consts.channelName, true);
    resp = await channelFromClient2.joinChannel(request);
    LOG('org2 joinChannel response :: %j', resp);
    if (resp[0] && resp[0].response && resp[0].response.status === 200) {
      LOG('org2 Successfully joined Channel');
    } else {
      LOG('org2 failed to join channel');
    }
  } catch (e) {
    LOG(e.message);
  }
};

joinChannel();
