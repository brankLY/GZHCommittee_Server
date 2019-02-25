import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { Validator } from '../utils/Validator';
import { ICreateSPVRequest, IQuerySPVRequest, ICreateSupportRequest } from '../interfaces/spv';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';

const LOG = debug('GZHCommittee_Server:router:Token');

class SPVRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/create', this.createSPV);
    this.router.get('/spv/:id', this.querySPV);
    this.router.post('/support', this.createSupport);
  }

  /**
   * create SPV
   */
  public async createSPV(req: Request, res: Response) {
    const method = 'createSPV';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      const createSPVRequest: ICreateSPVRequest = Validator.VALIDATE_CTEATE_SPV_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create proposal request: %O', method, createSPVRequest);

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
      
      LOG('%s - Create SPV at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('spv.create', [JSON.stringify(createSPVRequest)], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully create spv', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async createSupport(req: Request, res: Response) {
    const method = 'createSupport';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      const createSupportRequest: ICreateSupportRequest = Validator.VALIDATE_CTEATE_SUPPORT_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create proposal request: %O', method, createSupportRequest);

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
      
      LOG('%s - Create SPV at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('spv.support', [JSON.stringify(createSupportRequest)], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully create spv', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async querySPV(req: Request, res: Response, next: NextFunction) {
    const method = 'querySPV';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request params: %O', method, req.params);

      const queryProposalRequest: IQuerySPVRequest = Validator.VALIDATE_QUERY_SPV_REQUEST(req.params);
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
      const bcResp = await fabricService.invoke('spv.query', [JSON.stringify(queryProposalRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully query spv', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new SPVRouter().router;