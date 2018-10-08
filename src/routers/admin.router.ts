import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import FabricClient = require('fabric-client');
import { User } from 'fabric-client';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';

const LOG = debug('DappJupiter:router:Admin');


class AdminRouter {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  private init() {
    this.router.post('/:username/createFutureBureau', this.grantUserCreateFutureBureau);
  }
  
  public async grantUserCreateFutureBureau(req: Request, res: Response, next: NextFunction) {
    const method = 'grantUserCreateFutureBureau';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request param: %j\n request user is %j', method, req.params, req.user);
      const username: string = req.params.username;
      
      if (req.user.role !== 'admin') {
        return res.status(401).send(getResponse(false, 'Current User is not admin'));
      }
      
      const token: string = (<any>req).token;
      let userInfo: IUserInfo;
      userInfo = await MspWrapper.getUserByName(username, token);
      const bcId = userInfo.id;
      
      userInfo = await MspWrapper.getUser(token);
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      
      LOG('%s - Grant User "CreateFutureBureau" privilege at bc', method);
      const fabricService = new FabricService();
      const tx = {
        canCreateNewFutureBureau: true
      };
      const bcResp = await fabricService.invoke('user.updateBureau', [ bcId, JSON.stringify(tx) ], registry);
      LOG('%s - Success get Response from bc: %o', method, bcResp);
      LOG('%s - Exit. 201', method);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: %o', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new AdminRouter().router;
