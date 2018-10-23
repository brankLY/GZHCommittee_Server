import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';
import { ICreateProposalRequest, IVoteProposalRequest } from '../interfaces/proposal';

const LOG = debug('GZHCommittee_Server:router');

class ProposalRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/create', this.createProposal);
    this.router.post('/vote', this.voteProposal);
  }

  public async createProposal(req: Request, res: Response) {
    const method = 'createProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const createProposalRequest: ICreateProposalRequest = Validator.VALIDATE_CREATE_PROPOSAL_REQUEST(req.body);
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
      const bcResp = await fabricService.invoke('proposal.create', [JSON.stringify(createProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully create proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async voteProposal(req: Request, res: Response) {
    const method = 'voteProposal';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const voteProposalRequest: IVoteProposalRequest = Validator.VALIDATE_VOTE_PROPOSAL_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, vote proposal request: %O', method, voteProposalRequest);

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
      const bcResp = await fabricService.invoke('proposal.vote', [JSON.stringify(voteProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully vote proposal', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new ProposalRouter().router;
