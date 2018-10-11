import { FabricNetConfigPath } from '../config/constants';
import FabricClient = require('fabric-client');
import {
  Channel, User
} from 'fabric-client';
import * as debug from 'debug';

const LOG: debug.IDebugger = debug('GZHCommittee_Server:FabricService');

function transactionMonitor(eventHub, txId) {
  return new Promise((resolve, reject) => {
    const handler = setTimeout(() => {
      LOG(`Timeout for receiving event for txId:${txId.getTransactionID()}`);
      eventHub.disconnect();
      throw new Error(`Timeout for receiving event for txId:${txId.getTransactionID()}`);
    }, 10000);
    
    eventHub.registerTxEvent(txId.getTransactionID(), (eventTxId, code, blockNum) => {
      clearTimeout(handler);
      resolve({ eventTxId, code, blockNum });
    }, (err) => {
      clearTimeout();
      reject(err);
    }, { disconnect: true });
    
    eventHub.connect();
  });
}

async function sendAndWaitOnEvents(channel, request) {
  const promises = [];
  promises.push(channel.sendTransaction(request));
  
  const channelEventHubs = channel.getChannelEventHubsForOrg();
  channelEventHubs.forEach((eh) => {
    const eventMonitor = transactionMonitor(eh, request.txId);
    promises.push(eventMonitor);
  });
  
  return Promise.all(promises);
}

export class FabricService {
  // string array contains the network configurations
  public configs: string[];
  public client: FabricClient;
  public channel: Channel;
  private chaincodeId: string;
  private queryTargets: string[];
  
  constructor(configs?: string[]) {
    if (configs) {
      this.configs = configs;
    } else {
      this.configs = FabricNetConfigPath;
    }
    
    this.chaincodeId = '5813dc05-c645-4cb2-ad73-159a9375517b';
    this.queryTargets = [ 'peer0.org1.example.com' ];
    this.client = this.loadConfig();
    this.channel = this.client.getChannel();
  }
  
  private loadConfig(): FabricClient {
    if (this.configs.length < 1) {
      throw new Error('Can\'t find configs for Fabric network definition');
    }
    LOG('Start to load config');
    LOG('load config %s', this.configs[ 0 ]);
    let client: FabricClient = FabricClient.loadFromConfig(this.configs[ 0 ]);
    this.configs.forEach((config: string, index: number) => {
      if (index !== 0) {
        LOG('load config %s', config);
        client.loadFromConfig(config);
      }
    });
    return client;
  }
  
  public async invoke(fcn: string, args: string[], registry: User) {
    const method: string = 'invoke';
    LOG('%s - Enter', method);
    try {
      LOG('%s - Use Identity %s for this fabric client', method, registry.getName());
      await this.client.setUserContext(registry, true);
      const txId = this.client.newTransactionID();
      
      // 1. send proposal to endorser
      let request: any = {
        txId,
        chaincodeId: this.chaincodeId,
        fcn,
        args,
      };
      const [ proposalResponses, proposal ] = await this.channel.sendTransactionProposal(request);
      
      let payload;
      if (proposalResponses && proposalResponses[ 0 ].response
      && proposalResponses[ 0 ].response.status === 200) {
        LOG('Successfully send transaction proposal and get response from peer %j', proposalResponses[ 0 ].response);
        payload = proposalResponses[ 0 ].response.payload.toString('utf8');
      } else if (proposalResponses[ 0 ] instanceof Error) {
        throw proposalResponses[ 0 ];
      } else {
        const msg = proposalResponses[ 0 ].response.message;
        LOG(msg);
        throw new Error(msg);
      }
      
      if (payload) {
        payload = JSON.parse(payload);
      }
      
      // 2. send to committer
      request = {
        proposalResponses,
        proposal,
        txId,
      };
      const responses = await sendAndWaitOnEvents(this.channel, request);
      if (!(responses[ 0 ] instanceof Error) && responses[ 0 ].status === 'SUCCESS') {
        LOG(`Successfully committed transaction ${txId.getTransactionID()}`);
      } else {
        const msg = 'Failed to send ProposalResponse to committer';
        LOG(msg);
        throw new Error(msg);
      }
      const res = {
        txId: responses[ 1 ].eventTxId,
        blockNum: responses[ 1 ].blockNum,
        payload,
      };
      return res;
    } catch (e) {
      LOG('%s - Error: %O', method, e);
      throw e;
    }
  }
  
  public async query(fcn: string, args: string[], registry: User): Promise<string> {
    try {
      await this.client.setUserContext(registry, true);
      LOG('use identity %s for this client', registry.getName());
      const txId = this.client.newTransactionID();
      
      const request = {
        targets: [ this.channel.getPeers()[ 0 ] ],
        chaincodeId: this.chaincodeId,
        fcn,
        args,
        txId,
      };
      let [ response ]:any = await this.channel.queryByChaincode(request);
      if (response instanceof Error) {
        LOG('Query Error At Fabric Side: %s', response.message);
        throw response;
      }
      if (response) {
        response = response.toString('utf8');
      }
      LOG('Query response:%s', response);
      return response;
    } catch (e) {
      throw e;
    }
  }
  
  static async createUserFromPersistance(username: string, key: string, cert: string, mspId: string): Promise<User> {
    const method: string = 'createUserFromPersistance';
    LOG('%s - Enter', method);
    try {
      if (!username) {
        LOG('%s - Error: Missing Required Argument %s', method, 'username');
        throw new Error('Missing Required Argument "username"');
      }
      if (!key) {
        LOG('%s - Error: Missing Required Argument %s', method, 'key');
        throw new Error('Missing Required Argument "key"');
      }
      if (!cert) {
        LOG('%s - Error: Missing Required Argument %s', method, 'cert');
        throw new Error('Missing Required Argument "cert"');
      }
      if (!mspId) {
        LOG('%s - Error: Missing Required Argument %s', method, 'mspId');
        throw new Error('Missing Required Argument "mspId"');
      }
      
      const fabricClient: FabricClient = new FabricClient();
      const user = await fabricClient.createUser({
        username: username,
        mspid: mspId,
        cryptoContent: {
          privateKeyPEM: key,
          signedCertPEM: cert
        },
        skipPersistence: true
      });
      
      LOG('%s - Exit', method);
      return user;
    } catch (e) {
      throw e;
    }
  }
}
