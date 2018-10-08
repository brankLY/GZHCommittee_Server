import * as chai from 'chai';
import chaiHttp = require('chai-http');
import axios from 'axios';
import { MSP_URL } from '../../src/config/constants';
import { admin, user0, user1, user2 } from '../constants';

import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Bureau API Tests', () => {
  let adminToken;
  let user0Token;
  let user1Token;
  let user2Token;
  let user1Id;
  const LOGIN_URL = MSP_URL + '/auth/login';
  const BUREAU_NAME = 'TestBureau' + Math.random().toFixed(5).toString();
  
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
  
  it('GET User0 info, User0 should not have permission to create new FutureBureau', async () => {
    const { status, body } = await chai.request(app)
    .get('/api/v1/user/user0')
    .set('Authorization', `Bearer ${user0Token}`);
    expect(status).to.equal(200);
    expect(body).exist;
    expect(body.payload).exist;
    expect(body.payload.canCreateNewFutureBureau).to.equal(false);
  });
  
  it('Grant User0 create futureBureau permission', async () => {
    const { status, body } = await chai.request(app)
    .post('/api/v1/grant/user0/createFutureBureau')
    .set('Authorization', `Bearer ${adminToken}`);
    
    expect(status).to.equal(200);
    expect(body.success).to.equal(true);
    expect(body.payload.payload.canCreateNewFutureBureau).to.equal(true);
  });
  
  it('User0 POST /bureau/create with createFutureBureauOptions should return 200', async () => {
    const createFutureBereauRequest = {
      name: BUREAU_NAME,
      content: 'bureau content',
      endTime: '2018-7-25',
      option1: 'a1',
      option2: 'b2',
      option3: 'c3',
      option4: 'd4',
      option5: 'e5',
      judgePerson: 'User1',
    };
    return chai.request(app)
    .post(`/api/v1/bureau/create`)
    .set('Authorization', `Bearer ${user0Token}`)
    .send(createFutureBereauRequest)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
    });
  });
});
