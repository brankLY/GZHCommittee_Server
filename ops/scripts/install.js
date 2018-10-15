
const Consts = require('./config.js');
const LOG = require('debug')('bc:install');
const ClientStore = require('./client-store.js');

LOG('install');

async function install() {
  try {
    const configOrg1 = [Consts.networkConfigPath, Consts.org1ConfigPath];
    const configOrg2 = [Consts.networkConfigPath, Consts.org2ConfigPath];
    const client1 = await ClientStore.get('org1', {
      configs: configOrg1,
    });

    const request = {
      txId: client1.newTransactionID(true),
      chaincodeId: Consts.chaincode.chaincodeId,
      chaincodeType: 'node',
      chaincodePath: Consts.chaincode.chaincodePath,
      chaincodeVersion: Consts.chaincode.chaincodeVersion,
      channelNames: Consts.channelName,
    };
    let resp = await client1.installChaincode(request);
    LOG('Org1 install chaincode response :: %j', resp[0]);
    if (resp && resp[0] && resp[0][0].response && resp[0][0].response.status === 200) {
      LOG('Org1 install chaincode success');
    } else {
      LOG('Org1 install chaincode failed');
    }

    const client2 = await ClientStore.get('org2', {
      configs: configOrg2,
    });
    request.txId = client2.newTransactionID(true);
    resp = await client2.installChaincode(request);
    LOG('Org2 install chaincode response :: %j', resp[0]);
    if (resp && resp[0] && resp[0][0].response && resp[0][0].response.status === 200) {
      LOG('Org2 install chaincode success');
    } else {
      LOG('Org2 install chaincode failed');
    }
  } catch (e) {
    LOG(e);
  }
}

install();
