import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';
import { ICreateTxProposalRequest, ICreateMemProposalRequest, IQueryProposalRequest, IVoteTxProposalRequest, IVoteMemProposalRequest } from '../interfaces/proposal';

const LOG = debug('GZHCommittee_Server:router');

class ProposalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/createTx', this.createTxProposal);
    this.router.post('/createMem', this.createMemProposal);
    this.router.post('/voteTx', this.voteTxProposal);
    this.router.post('/voteMem', this.voteMemProposal);
    this.router.post('/query', this.queryProposal);
    this.router.get('/getAllTxProposal', this.getAllTxProposal);
    this.router.get('/getAllMemProposal', this.getAllMemProposal);
  }

  public async createTxProposal(req: Request, res: Response) {
    const method = 'createTxProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const createProposalRequest: ICreateTxProposalRequest = Validator.VALIDATE_CREATE_TX_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create proposal request: %O', method, createProposalRequest);

      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Create Proposal at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('proposal.createTx', [JSON.stringify(createProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully createTx proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async createMemProposal(req: Request, res: Response) {
    const method = 'createMemProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const createProposalRequest: ICreateMemProposalRequest = Validator.VALIDATE_CREATE_MEM_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create proposal request: %O', method, createProposalRequest);

      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Create Proposal at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('proposal.createMem', [JSON.stringify(createProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully createMem proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async queryProposal(req: Request, res: Response) {
    const method = 'queryProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      let queryProposalRequest: IQueryProposalRequest = Validator.VALIDATE_QUERY_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, query proposal request: %O', method, queryProposalRequest);

      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('proposal.query', [JSON.stringify(queryProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully query proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async voteTxProposal(req: Request, res: Response) {
    const method = 'voteTxProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      let voteProposalRequest: IVoteTxProposalRequest = Validator.VALIDATE_VOTE_TX_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, voteTx proposal request: %O', method, voteProposalRequest);

      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Create Token at bc', method);
      const fabricService = new FabricService();
      voteProposalRequest.accountID = userInfo.id;
      const bcResp = await fabricService.invoke('proposal.voteTx', [JSON.stringify(voteProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully voteTx proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async voteMemProposal(req: Request, res: Response) {
    const method = 'voteMemProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      let voteProposalRequest: IVoteMemProposalRequest = Validator.VALIDATE_VOTE_MEM_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, voteMem proposal request: %O', method, voteProposalRequest);

      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Create Token at bc', method);
      const fabricService = new FabricService();
      voteProposalRequest.accountID = userInfo.id;
      const bcResp = await fabricService.invoke('proposal.voteMem', [JSON.stringify(voteProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully voteMem proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getAllTxProposal(req: Request, res: Response, next: NextFunction) {
    const method = 'getAllTxProposal';
    try {
      LOG('%s -Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
  
      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('proposal.getTxAll', [ ], registry);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getAllMemProposal(req: Request, res: Response, next: NextFunction) {
    const method = 'getAllMemProposal';
    try {
      LOG('%s -Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
  
      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('proposal.getMemAll', [ ], registry);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new ProposalRouter().router;
