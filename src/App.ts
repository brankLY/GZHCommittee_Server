import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as JWT from 'express-jwt';
import { getResponse } from './utils/Response';
import bearerToken = require('express-bearer-token');

import SSARouter from './routers/ssa.router';
import MemberRouter from './routers/member.router';
import ProposalRouter from './routers/proposal.router';
import AuthRouter from './routers/auth.router';

// Creates and configures an ExpressJS web server.
class App {
  // ref to Express instance
  public express: express.Application;
  
  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }
  
  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    // enable all CORS Request
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(JWT(
    { secret: 'thisismysecret' })
    .unless({ path: [ '/api/v1/account', '/api/v1/auth/login' ] }
    ));
    this.express.use((err, req, res, next) => {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send(getResponse(false, err.message));
      } else {
        next(err);
      }
    });
    this.express.use(bearerToken());
  }
  
  // Configure API endpoints.
  private routes(): void {
    this.express.use('/api/v1/ssa', SSARouter);
    this.express.use('/api/v1/member', MemberRouter);
    this.express.use('/api/v1/proposal', ProposalRouter);
    this.express.use('/api/v1/auth', AuthRouter);
  }
}

export default new App().express;
