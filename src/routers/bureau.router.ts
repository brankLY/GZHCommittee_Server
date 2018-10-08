import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import FabricClient = require('fabric-client');
import { User } from 'fabric-client';
import { Validator } from '../utils/Validator';
import { IUserInfo } from '../interfaces/user';
import { MspWrapper } from '../services/MspWrapper';
import { FabricService } from '../services/FabricService';
import { getResponse } from '../utils/Response';
import { ICreateBureauRequest, IQueryBureauRequest, IBetBureauRequest, IJudgeBureauRequest, IQueryOptionRequest, IQueryParticipate } from '../interfaces/bureau';
import { MSP_URL } from "../config/constants";
import axios from "axios";
import math from 'mathjs'

const LOG = debug('DappJupiter:router:Bureau');

class BureauRouter {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  private init() {
    this.router.post('/create', this.create);
    this.router.post('/query', this.getOne);
    this.router.get('/getAll', this.getAll);
    this.router.post('/betTransfer', this.betTransfer);
    this.router.post('/settle', this.settle);
    this.router.post('/init', this.initContractAccount);
    this.router.post('/queryOption', this.queryOption);
    this.router.post('/queryParticipate', this.queryParticipate);
    this.router.post('/test', this.test);
  }

  public async initContractAccount(req: Request, res: Response, next: NextFunction) {
    const method = 'initContractAccount';
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
      const bcResp = await fabricService.invoke('bureau.initContractAccount', [], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully init Contract Account', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    const method = 'create';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      const createBureauRequest: ICreateBureauRequest = Validator.VALIDATE_CREATE_BUREAU_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create bureau request: %O', method, createBureauRequest);
      
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
      
      LOG('%s - Create Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.createFutureBureau', [ JSON.stringify(createBureauRequest) ], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully created bureau', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getOne(req: Request, res: Response, next: NextFunction) {
    const method = 'getOne';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      const queryBureauRequest: IQueryBureauRequest = Validator.VALIDATE_QUERY_BUREAU_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, create bureau request: %O', method, queryBureauRequest);
      
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
      
      LOG('%s - Create Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.queryFutureBureau', [ JSON.stringify(queryBureauRequest) ], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Successfully query bureau', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async betTransfer(req: Request, res: Response, next: NextFunction) {
    const method = 'bet';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const betBureauRequest: IBetBureauRequest = Validator.VALIDATE_BET_BUREAU_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, bet bureau request: %O', method, betBureauRequest);
      
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

      LOG('%s - Bet Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.betTransfer', [ JSON.stringify(betBureauRequest) ], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async settle(req: Request, res: Response, next: NextFunction) {
    const method = 'judge';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const judgeBureauRequest: IJudgeBureauRequest = Validator.VALIDATE_JUDGE_BUREAU_REQUEST(req.body);
      LOG('%s - Request Body Validate Passed, judge bureau request: %O', method, judgeBureauRequest);
      
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
      
      LOG('%s - Judge Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.settle', [ JSON.stringify(judgeBureauRequest) ], registry);
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    const method = 'getAll';
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
      const bcResp = await fabricService.invoke('bureau.getAll', [ ], registry);
      res.status(200).send(getResponse(true, 'Success', bcResp));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async queryOption(req: Request, res: Response, next: NextFunction) {
    const method = 'queryOption';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const queryOptionRequest: IQueryOptionRequest = Validator.VALIDATE_QUERY_OPTION(req.body);
      LOG('%s - Request Body Validate Passed, query option request: %O', method, queryOptionRequest);
      
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
      
      LOG('%s - Judge Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.query', [], registry);

      const futureBureauName = queryOptionRequest.futureBureauName;
      LOG("%---------futureBureauName is %s------------", futureBureauName);
      let bureaus = bcResp.payload.bureau;
      LOG('%-------bureaus is %j-------', bureaus);
      let option1Sum = 0;
      let option2Sum = 0;
      let option3Sum = 0;
      let option4Sum = 0;
      let option5Sum = 0;
      for (var item in bureaus) {
        if (item === futureBureauName) {
          const bureau = bureaus[item];
          const histories = bureau.history;
          histories.forEach(element => {
            if (element.chooseOption === 'option1') {
              option1Sum += parseFloat(element.amount);
            }
            if (element.chooseOption === 'option2') {
              option2Sum += parseFloat(element.amount);
            }
            if (element.chooseOption === 'option3') {
              option3Sum += parseFloat(element.amount);
            }
            if (element.chooseOption === 'option4') {
              option4Sum += parseFloat(element.amount);
            }
            if (element.chooseOption === 'option5') {
              option5Sum += parseFloat(element.amount);
            }
            LOG('%-------count1 is %d-----%', option1Sum);
          });
        }
      }

      const bureauRouter = new BureauRouter();
      const bureau = await bureauRouter.queryByName2(req, futureBureauName);

      let percentage1 = 0.0;
      let percentage2 = 0.0;
      let percentage3 = 0.0;
      let percentage4 = 0.0
      let percentage5 = 0.0;
      if (bureau.count != 0) {
        percentage1 = parseFloat(bureau.count1)/parseFloat(bureau.count)*100;
        percentage2 = parseFloat(bureau.count2)/parseFloat(bureau.count)*100;
        percentage3 = parseFloat(bureau.count3)/parseFloat(bureau.count)*100;
        percentage4 = parseFloat(bureau.count4)/parseFloat(bureau.count)*100;
        percentage5 = parseFloat(bureau.count5)/parseFloat(bureau.count)*100;
      }

      let options = new Array();
      options.push({
        option: bureau.option1,
        optionSum: option1Sum,
        percentage: percentage1.toString(),
        singleCount: bureau.count1.toString(),
        count: bureau.count.toString()
      });
      options.push({
        option: bureau.option2,
        optionSum: option2Sum,
        percentage: percentage2.toString(),
        singleCount: bureau.count2.toString(),
        count: bureau.count.toString()
      });
      options.push({
        option: bureau.option3,
        optionSum: option3Sum,
        percentage: percentage3.toString(),
        singleCount: bureau.count3.toString(),
        count: bureau.count.toString()
      });
      options.push({
        option: bureau.option4,
        optionSum: option4Sum,
        percentage: percentage4.toString(),
        singleCount: bureau.count4.toString(),
        count: bureau.count.toString()
      });
      options.push({
        option: bureau.option5,
        optionSum: option5Sum,
        percentage: percentage5.toString(),
        singleCount: bureau.count5.toString(),
        count: bureau.count.toString()
      });

      const result = {
        name: bureau.name,
        content: bureau.content,
        creator: bureau.creator,
        judgePerson: bureau.judgePerson,
        endTime: bureau.endTime,
        result: bureau.result,
        options: options
      };
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', result));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
  
  public async queryParticipate(req: Request, res: Response, next: NextFunction) {
    const method = 'queryParticipate';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const queryParticipate: IQueryParticipate = Validator.VALIDATE_QUERY_PARTICIPATE(req.body);
      LOG('%s - Request Body Validate Passed, query option request: %O', method, queryParticipate);
      
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
      
      LOG('%s - Judge Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.query', [], registry);

      let bureaus = bcResp.payload.bureau;
      LOG('%-------bureaus is %j-------', bureaus);
      var bureauNames = new Array();
      for (var name in bureaus) {
        bureauNames.push(name);
      }

      const result = {
        bureaus: bureauNames
      };
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', result));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async test(req: Request, res: Response, next: NextFunction) {
    const method = 'test';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body:\n%O', method, req.body);
      const queryParticipate: IQueryParticipate = Validator.VALIDATE_QUERY_PARTICIPATE(req.body);
      LOG('%s - Request Body Validate Passed, test request: %O', method, queryParticipate);
      
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
      
      LOG('%s - Judge Bureau at bc', method);
      const fabricService = new FabricService();
      const bcResp = await fabricService.invoke('user.query', [], registry);

      let bureaus = bcResp.payload.bureau;
      LOG('%-------bureaus is %j-------', bureaus);
      var bureauNames = new Array();
      for (var name in bureaus) {
        const bureauRouter = new BureauRouter();
        const bureau = await bureauRouter.queryByName(req, name);
        bureauNames.push(bureau);
      }

      const result = {
        bureaus: bureauNames
      };
      
      LOG('%s - Exit. 200', method);
      res.status(200).send(getResponse(true, 'Success', result));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }

  public async queryByName(req: Request, name:string) {
    const method = 'queryByName';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      
      LOG('%s - Create Bureau at bc', method);
      const fabricService = new FabricService();
      const params = {
        futureBureauName: name
      };
      const bcResp = await fabricService.invoke('user.queryFutureBureau', [ JSON.stringify(params) ], registry);
      
      const chineseName = bcResp.payload.chineseName;
      const creator = bcResp.payload.creator;
      const judgePerson = bcResp.payload.judgePerson;
      const endTime = bcResp.payload.endTime;

      const res = {
        name: name,
        chineseName: chineseName,
        creator: creator,
        judgePerson: judgePerson,
        endTime: endTime
      }
      return res;
    } catch (e) {
      LOG('%s - Error: ', method, e);
      throw e;
    }
  }

  public async queryByName2(req: Request, name:string) {
    const method = 'queryByName2';
    try {
      LOG('%s - Enter.', method);
      LOG('%s - request body: %O', method, req.body);
      
      let userInfo: IUserInfo;
      try {
        userInfo = await MspWrapper.getUser((<any>req).token);
        LOG('%s - Successfully get user info from MSP', method);
      } catch (e) {
        LOG('%s - Failed to chat with MSP error: %o', method, e);
      }
      LOG('%s - Successfully get user info from MSP', method);
      const registry = await FabricService.createUserFromPersistance(userInfo.id, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
      
      LOG('%s - Create Bureau at bc', method);
      const fabricService = new FabricService();
      const params = {
        futureBureauName: name
      };
      const bcResp = await fabricService.invoke('user.queryFutureBureau', [ JSON.stringify(params) ], registry);
      
      // const creator = bcResp.payload.creator;
      // const judgePerson = bcResp.payload.judgePerson;
      // const endTime = bcResp.payload.endTime;

      // const res = {
      //   name: name,
      //   content: bcResp.payload.content,
      //   creator: creator,
      //   judgePerson: judgePerson,
      //   endTime: endTime,
      //   result: bcResp.payload.result,
      //   count: bcResp.payload.count,
      //   option1: bcResp.payload.option1,
      //   option2: bcResp.payload.option2,
      //   option3: bcResp.payload.option3,
      //   option4: bcResp.payload.option4,
      //   option5: bcResp.payload.option5,
      //   count1: bcResp.payload.count1,
      //   count2: bcResp.payload.count2,
      //   count3: bcResp.payload.count3,
      //   count4: bcResp.payload.count4,
      //   count5: bcResp
      // }
      return bcResp.payload;
    } catch (e) {
      LOG('%s - Error: ', method, e);
      throw e;
    }
  }
}

export default new BureauRouter().router;
