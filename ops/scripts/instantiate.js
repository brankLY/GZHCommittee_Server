
const Consts = require('./config.js');
const LOG = require('debug')('bc:instantiate');
const ClientStore = require('./client-store.js');

async function instantiate() {
  try {
    const configOrg1 = [Consts.networkConfigPath, Consts.org1ConfigPath];
    const configOrg2 = [Consts.networkConfigPath, Consts.org2ConfigPath];
    const client1 = await ClientStore.get('org1', {
      configs: configOrg1,
      // mutualTLS: Consts.identities.admin1,
    });
    const client2 = await ClientStore.get('org2', {
      configs: configOrg2,
      // mutualTLS: Consts.identities.admin2,
    });

    const channel1 = client1.getChannel(Consts.channelName);
    const channel2 = client2.getChannel(Consts.channelName);

    // instantiate on org1
    const request = {
      txId: client1.newTransactionID(true),
      chaincodeId: Consts.chaincode.chaincodeId,
      chaincodeType: 'node',
      chaincodeVersion: Consts.chaincode.chaincodeVersion,
      targets: ['peer0.org1.example.com'],
      args: ['install', Consts.chaincode.contractAccountId],
    };
    const tx1 = request.txId;
    const promises = [];
    const proposalRequest1 = channel1.sendInstantiateProposal(request, 180000);

    // instantiate on org2
    request.targets = ['peer0.org2.example.com'];
    request.txId = client2.newTransactionID(true);
    const tx2 = request.txId;
    const proposalRequest2 = channel2.sendInstantiateProposal(request, 180000);
    promises.push(proposalRequest1);
    promises.push(proposalRequest2);

    const resp = await Promise.all(promises);
    LOG('Successfully send instantiated chaincode request to peer0.org1 and peer0.org2');

    const [resp1, resp2] = resp;
    const [proposalResponse1, proposal1] = resp1;
    const [proposalResponse2, proposal2] = resp2;
    // LOG('Org1 instantiate chaincode response :: %j', proposalResponse1);
    // LOG('Org2 instantiate chaincode response :: %j', proposalResponse2);

    if (resp1 && resp1[0] && resp1[0][0].response && resp1[0][0].response.status === 200) {
      LOG('Successfully instantiated chaincode at org1');
    }
    if (resp2 && resp2[0] && resp2[0][0].response && resp2[0][0].response.status === 200) {
      LOG('Successfully instantiated chaincode at org2');
    }

    const request1 = {
      proposalResponses: proposalResponse1,
      proposal: proposal1,
      txId: tx1,
    };
    const request2 = {
      proposalResponses: proposalResponse2,
      proposal: proposal2,
      txId: tx2,
    };

    const req1 = channel1.sendTransaction(request1);
    const req2 = channel2.sendTransaction(request2);
    const adminReq = [req1, req2];
    const [adminResp1, adminResp2] = await Promise.all(adminReq);
    if (!(adminResp1 instanceof Error) && adminResp1.status === 'SUCCESS') {
      LOG('Successfully sent transaction to instantiate the chaincode to the orderer for org1.');
    } else {
      LOG(`Failed to order the transaction to instantiate the chaincode. Error code: ${adminResp1.status}`);
      return;
    }
    if (!(adminResp2 instanceof Error) && adminResp2.status === 'SUCCESS') {
      LOG('Successfully sent transaction to instantiate the chaincode to the orderer for org2.');
    } else {
      LOG(`Failed to order the transaction to instantiate the chaincode. Error code: ${adminResp2.status}`);
      return;
    }
  } catch (e) {
    LOG(e);
  }
}

instantiate();
