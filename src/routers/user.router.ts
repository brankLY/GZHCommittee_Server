import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import FabricClient = require('fabric-client');
import { User } from 'fabric-client';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';

const LOG = debug('DappJupiter:router:UserRouter');


class UserRouter {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  private init() {
    this.router.post('/', this.create);
    this.router.get('/:username', this.getOne);
    this.router.put('/:username', this.updateOne);
  }
  
  public async create(req: Request, res: Response, next: NextFunction) {
    const method = 'create';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      Validator.VALIDATE_CREATE_USER_REQUEST(req.body);
      const user: IUserInfo = req.body;
      LOG('%s - Pass User Info validation %j', method, user);
      
      let userInfo: IUserInfo;
      try {
        const caResp = await MspWrapper.createUser(req.body);
        LOG('%s - Successfully created user at Fabric-ca', method);
        userInfo = await MspWrapper.getUser(caResp.token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
        if (e.code) {
          return res.status(e.code).send(getResponse(false, e.message));
        }
        return res.status(400).send(getResponse(false, e.message));
      }
      
      
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.create', [ userInfo.id, userInfo.username ], registry);
      
      LOG('%s - get response from bc: %j', method, bcResp);
      const result = {
        username: userInfo.username,
        role: userInfo.role,
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        id: userInfo.id,
        // this should be get from bc
        canCreateNewToken: bcResp.payload.canCreateNewToken,
        // this shold be get from bc
        wallet: bcResp.payload.wallet,
        // blockchain txId
        txId: bcResp.txId,
        // which block created this user
        blockNum: bcResp.blockNum,
      };
      LOG('%s - Exit. 201', method);
      res.status(201).send(getResponse(true, 'Successfully created user ' + user.username, result));
    } catch (e) {
      LOG('%s - Error: %o', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
  
  public async getOne(req: Request, res: Response, next: NextFunction) {
    const method = 'getOne';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request param: %j\n request user is %j', method, req.params, req.user);
      if (req.user.username !== req.params.username) {
        const msg: string = `identity ${req.user.username} does not have permission to query user ${req.params.username}`;
        return res.status(401).send(getResponse(false, msg));
      }
      
      const token: string = (<any>req).token;
      let userInfo: IUserInfo;
      userInfo = await MspWrapper.getUser(token);
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      
      LOG('%s - Query User Info from bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.query('user.query', [], registry);
      
      LOG('%s - Exit. 201', method);
      res.status(200).send(getResponse(true, 'Success', JSON.parse(bcResp)));
    } catch (e) {
      LOG('%s - Error: %o', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
  
  public async updateOne(req: Request, res: Response, next: NextFunction) {
    const method = 'updateOne';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request param: %j\n request user is %j', method, req.params, req.user);
      if (req.user.username !== req.params.username) {
        const msg: string = `identity ${req.user.username} does not have permission to query user ${req.params.username}`;
        return res.status(401).send(getResponse(false, msg));
      }
      
      const token: string = (<any>req).token;
      LOG('%s - Token: %s', method, token);
      let userInfo: IUserInfo;
      userInfo = await MspWrapper.updateUser(req.params.username, req.body, token);
      
      LOG('%s - Exit. 201', method);
      res.status(200).send(getResponse(true, 'Success', userInfo));
    } catch (e) {
      LOG('%s - Error: %o', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new UserRouter().router;
