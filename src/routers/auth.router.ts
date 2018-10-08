import { Router, Request, Response, NextFunction } from 'express';
import * as debug from 'debug';
import { getResponse } from '../utils/Response';
import axios from 'axios';
import { MSP_URL } from '../config/constants';

const LOG = debug('DappJupiter:router:Auth');


class AuthRouter {
  public router: Router;
  
  constructor() {
    this.router = Router();
    this.init();
  }
  
  private init() {
    this.router.post('/login', this.login);
    this.router.post('/verify', this.verify);
  }
  
  public async login(req: Request, res: Response, next: NextFunction) {
    const method = 'login';
    try {
      LOG('%s - Enter.', method);
      const MSP_USER = MSP_URL + '/auth/login';
      LOG('%s - MSP_URL %s', method, MSP_USER);
      const resp = await axios.post(MSP_USER, req.body, { validateStatus: null });
      LOG('%s - Get Response from MSP, resp:%j', method, resp);
      LOG('%s - Exit. %s', method, resp.status);
      res.status(resp.status).send(getResponse(resp.data.success, resp.data.message, resp.data.payload));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
  
  public async verify(req: Request, res: Response, next: NextFunction) {
    const method = 'verify';
    try {
      LOG('%s - Enter.', method);
      const MSP_USER = MSP_URL + '/auth/verify';
      const token: string = req.headers.authorization.split(' ')[1];
      const resp = await axios.post(MSP_USER, req.body, { validateStatus: null, headers: { Authorization: `Bearer ${token}`} });
      console.log(resp.data);
      LOG('%s - Get Response from MSP, resp:%j', method, resp.data);
      LOG('%s - Exit. %s', method, resp.status);
      res.status(resp.status).send(getResponse(resp.data.success, resp.data.message, resp.data.payload));
    } catch (e) {
      LOG('%s - Error: ', method, e);
      res.status(500).send(getResponse(false, e.message));
    }
  }
}

export default new AuthRouter().router;
