import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import FabricClient = require('fabric-client');
import { User } from 'fabric-client';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { EarthFabricService } from '../services/EarthFabricService';
import { getResponse } from '../utils/Response';
import { ICreateTokenRequest, ITransferTokenRequest, IUpdateGasRequest, IUpdateRamRequest, IQueryGasRequest } from '../interfaces/IToken';
import { MSP_URL } from "../config/constants";
import axios from "axios";

const LOG = debug('Jupiter:router:Token');


class TokenRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.init();
  }

  private init() {
    this.router.post('/create', this.create);
    this.router.post('/init', this.initToken);
    this.router.post('/transfer', this.transfer);
    this.router.post('/updateRam/:tokenName', this.updateRam);
    this.router.post('/updateGas/:tokenName', this.updateGas);
    this.router.get('/info/:tokenName', this.getTokenInfo);
    this.router.post('/getGas', this.getGas);
  }


  /**
   * initToken create the GZH Token and its mintageAccount, gasAccountId at Earth
   */
  public async initToken(req: Request, res: Response) {
    const method = 'initToken';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const createTokenRequest: ICreateTokenRequest = Validator.VALIDATE_CREATE_TOKEN_REQUEST(req.body, true);
      LOG('%s - Request Body Validate Passed, create token request: %O', method, createTokenRequest);

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
      const bcResp = await fabricService.invoke('token.init', [JSON.stringify(createTokenRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully created token', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async create(req: Request, res: Response) {
    const method = 'create';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const createTokenRequest: ICreateTokenRequest = Validator.VALIDATE_CREATE_TOKEN_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create token request: %O', method, createTokenRequest);

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
      const bcResp = await fabricService.invoke('token.create', [JSON.stringify(createTokenRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully created token', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async transfer(req: Request, res: Response) {
    const method = 'transfer';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const transferTokenRequest: ITransferTokenRequest = Validator.VALIDATE_TRANSFER_TOKEN_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create token request: %O', method, transferTokenRequest);

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

      try {
        const MSP_USER = MSP_URL + '/auth/login';
        LOG('%s - MSP_URL %s', method, MSP_USER);
        const resp = await axios.post(MSP_USER, {
          username: userInfo.username,
          password: req.body.password,
        });
        LOG('%s - Success verify the current user matched the password. MSP resp: %j', method, resp);
      } catch (e) {
        LOG('%s - Failed to login user %s, password is not correct', method, userInfo.username);
        return res.status(401).send(getResponse(false, 'password is not correct'));
      }

      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Transfer Token at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.transfer', [JSON.stringify(transferTokenRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async updateRam(req: Request, res: Response) {
    const method = 'updateRam';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const updateTokenRequest: IUpdateRamRequest = Validator.VALIDATE_UPDATE_RAM_REQUEST(req.body, req.params.tokenName);
      LOG('%s - Request Body Validate Passed, update token request: %O', method, updateTokenRequest);

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
      const bcResp = await fabricService.invoke('token.update', [JSON.stringify(updateTokenRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully created token', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async updateGas(req: Request, res: Response) {
    const method = 'updateRam';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const updateTokenRequest: IUpdateGasRequest = Validator.VALIDATE_UPDATE_GAS_REQUEST(req.body, req.params.tokenName);
      LOG('%s - Request Body Validate Passed, update token request: %O', method, updateTokenRequest);

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
      const bcResp = await fabricService.invoke('token.update', [JSON.stringify(updateTokenRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully created token', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getTokenInfo(req: Request, res: Response) {
    const method = 'getTokenInfo';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      if (!req.params.tokenName) {
        LOG('%s - Missing Required param tokenName', method);
        return res.status(400).send(getResponse(false, 'Missing Required param tokenName'));
      }

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

      LOG('%s - Query Token Info from bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('token.getInfo', [req.params.tokenName], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully query token info from bc', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getGas(req: Request, res: Response) {
    const method = 'getGas';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);

      const queryGasRequest: IQueryGasRequest = Validator.VALIDATE_QUERY_GAS_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, query token gas request: %O', method, queryGasRequest);


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
      const registry = await EarthFabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);

      LOG('%s - Query Gas Cost from bc', method);
      const fabricService = new EarthFabricService();
      const bcResp = await fabricService.invoke('wallet.getGas', [JSON.stringify(queryGasRequest)], registry);

      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully query token info from bc', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new TokenRouter().router;
