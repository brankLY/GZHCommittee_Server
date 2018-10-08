import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import FabricClient = require('fabric-client');
import { User } from 'fabric-client';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';
import { MSP_URL } from '../config/constants';
import axios from 'axios';

const LOG = debug('DappJupiter:router:IdentityRouter');


class IdentityRouter {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  private init() {
    this.router.get('/:username', this.getOne);
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
      
      const token: string = req.headers.authorization.split(' ')[1];
      const MSP_USER = MSP_URL + '/user/info';
      const response: any = await axios.get(MSP_USER, { validateStatus: null, headers: { 'Authorization': `Bearer ${token}` } });
      LOG('%s - Success Get UserInfo at MSP. Response(%s): %j', method, response.status, response.data);
      
      LOG('%s - Exit. %s', response.status);
      res.status(response.status).send(getResponse(response.data.success, response.data.message, response.data.payload));
    } catch (e) {
      LOG('%s - Error: %o', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new IdentityRouter().router;
