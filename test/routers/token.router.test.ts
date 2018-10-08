import * as chai from 'chai';
import chaiHttp = require('chai-http');
import axios from 'axios';
import { MSP_URL } from '../../src/config/constants';
import { admin, user0, user1, user2 } from '../constants';

import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Token API Tests', () => {
  let adminToken;
  let user0Token;
  let user1Token;
  let user2Token;
  let user1Id;
  const LOGIN_URL = MSP_URL + '/auth/login';
  const TOKEN_NAME = 'TestToken' + Math.random().toFixed(5).toString();
  
  before(async () => {
    let { data } = await axios.post(LOGIN_URL, admin);
    adminToken = data.payload.token;
    console.log('admin token:\n%s', adminToken);

    ({ data } = await axios.post(LOGIN_URL, user0));
    user0Token = data.payload.token;
    console.log('user0 token:\n%s', user0Token);

    ({ data } = await axios.post(LOGIN_URL, user1));
    user1Token = data.payload.token;
    console.log('user1 token:\n%s', user1Token);

    ({ data } = await axios.post(LOGIN_URL, user2));
    user2Token = data.payload.token;
    console.log('user2 token:\n%s', user2Token);
  });
  
  it('GET User0 info, User0 should not have permission to create new Token', async () => {
    const { status, body } = await chai.request(app)
    .get('/api/v1/user/user0')
    .set('Authorization', `Bearer ${user0Token}`);
    expect(status).to.equal(200);
    expect(body).exist;
    expect(body.payload).exist;
    expect(body.payload.canCreateNewToken).to.equal(false);
  });
  
  it('Grant User0 create token permission', async () => {
    const { status, body } = await chai.request(app)
    .post('/api/v1/grant/user0/createToken')
    .set('Authorization', `Bearer ${adminToken}`);
    
    expect(status).to.equal(200);
    expect(body.success).to.equal(true);
    expect(body.payload.payload.canCreateNewToken).to.equal(true);
  });
  
  it('User0 POST /token/create with createTokenOptions should return 200', async () => {
    const createTokenRequest = {
      name: TOKEN_NAME,
      symbol: 'TES',
      amount: 10000,
      decimals: 5,
    };
    return chai.request(app)
    .post(`/api/v1/token/create`)
    .set('Authorization', `Bearer ${user0Token}`)
    .send(createTokenRequest)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });
  });
  
  it('GET User1 Info, user1 should have no token now', async () => {
    const { status, body } = await chai.request(app)
    .get('/api/v1/user/user1')
    .set('Authorization', `Bearer ${user1Token}`);
    
    expect(status).to.equal(200);
    expect(body).exist;
    expect(body.payload).exist;
    expect(body.payload.canCreateNewToken).to.equal(false);
    expect(body.payload.id).exist;
    user1Id = body.payload.id;
  });
  
  it('User0 POST /token/transfer to transfer 0.1 TES to User1', async () => {
    const transferTokenRequest = {
      target: user1Id,
      tokenName: TOKEN_NAME,
      amount: 0.00001,
    };
    
    return chai.request(app)
    .post(`/api/v1/token/transfer`)
    .set('Authorization', `Bearer ${user0Token}`)
    .send(transferTokenRequest)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });
  });
  
  it('GET User1 again, it should have TES in wallet', async () => {
    const { status, body } = await chai.request(app)
    .get('/api/v1/user/user1')
    .set('Authorization', `Bearer ${user1Token}`);
  
    expect(status).to.equal(200);
    expect(body).exist;
    expect(body.payload).exist;
    expect(body.payload.canCreateNewToken).to.equal(false);
    expect(body.payload.wallet[TOKEN_NAME]).exist;
    expect(body.payload.id).exist;
    user1Id = body.payload.id;
  });
});
