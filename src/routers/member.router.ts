import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';
import { IInitMemberRequest } from '../interfaces/member';

const LOG = debug('GZHCommittee_Server:router:Token');

class MemberRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/init', this.initMember);
    this.router.get('/getAll', this.getAllMember);
  }

  public async initMember(req: Request, res: Response) {
    const method = 'initMember';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const initMemberRequest: IInitMemberRequest = Validator.VALIDATE_INIT_MEMBER_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create token request: %O', method, initMemberRequest);

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
      const bcResp = await fabricService.invoke('member.init', [JSON.stringify(initMemberRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully init member', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getAllMember(req: Request, res: Response, next: NextFunction) {
    const method = 'getAllMember';
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
      const bcResp = await fabricService.invoke('member.getall', [ ], registry);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new MemberRouter().router;
