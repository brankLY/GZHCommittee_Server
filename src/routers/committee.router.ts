import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';

const LOG = debug('GZHCommittee_Server:router:Token');

class CommitteeRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/init', this.initCommittee);
  }

  /**
   * init committee
   */
  public async initCommittee(req: Request, res: Response) {
    const method = 'initCommittee';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
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
      
      LOG('%s - init Contract Account at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('committee.init', [], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully init committee', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new CommitteeRouter().router;