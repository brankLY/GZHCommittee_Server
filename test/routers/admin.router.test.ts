import * as chai from 'chai';
import chaiHttp = require('chai-http');
import axios from 'axios';
import { MSP_URL } from '../../src/config/constants';

import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API Tests', () => {
  const admin = {
    username: 'admin',
    password: 'adminpw',
  };
  const user = {
    username: 'user' + Math.random().toFixed(5).toString(),
    password: 'userpw',
  };
  let token;
  const LOGIN_URL = MSP_URL + '/auth/login';
  
  before(async () => {
    const { data } = await axios.post(LOGIN_URL, admin);
    expect(data).exist;
    expect(data.success).to.equal(true);
    expect(data.payload).exist;
    expect(data.payload.token).exist;
    token = data.payload.token;
    console.log('admin token:\n%s', token);

    // create a user
    return chai.request(app)
    .post('/api/v1/user')
    .send(user)
    .then(res => {
      expect(res.status).to.equal(201);
      expect(res.body).exist;
      console.log(res.body);
      expect(res.body.success).to.equal(true);
      expect(res.body.payload).exist;
      expect(res.body.payload.username).to.equal(user.username);
      expect(res.body.payload.role).to.equal('user');
      expect(res.body.payload.id).exist;
      expect(res.body.payload.canCreateNewToken).to.equal(false);
      expect(res.body.payload.txId).exist;
      expect(res.body.payload.blockNum).exist;
    });
  });
  
  it('/grant/${user.username}/createToken with non-admin token should return 401', async () => {
    const { data } = await axios.post(LOGIN_URL, user);
    expect(data.success).to.equal(true);
    expect(data.payload.token).exist;
    return chai.request(app)
    .post(`/api/v1/grant/${user.username}/createToken`)
    .set('Authorization', `Bearer ${data.payload.token}`)
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Current User is not admin');
    });
  });
  
  it('/grant/${user.username}/createToken with admin token should return 200', () => {
    return chai.request(app)
    .post(`/api/v1/grant/${user.username}/createToken`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal('Success');
      expect(res.body.payload).exist;
      expect(res.body.payload.txId).exist;
      expect(res.body.payload.blockNum).exist;
      expect(res.body.payload.payload).exist;
      expect(res.body.payload.payload.canCreateNewToken).equal(true);
    });
  });
  
  it('/grant/${user.username}/admin with non-admin token should return 401', async () => {
    const { data } = await axios.post(LOGIN_URL, user);
    expect(data.success).to.equal(true);
    expect(data.payload.token).exist;
    return chai.request(app)
    .post(`/api/v1/grant/${user.username}/admin`)
    .set('Authorization', `Bearer ${data.payload.token}`)
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('Current User is not admin');
    });
  });
  
  it('/grant/${user.username}/createToken with admin token should return 200', () => {
    return chai.request(app)
    .post(`/api/v1/grant/${user.username}/admin`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal('Success');
      expect(res.body.payload).exist;
      expect(res.body.payload.txId).exist;
      expect(res.body.payload.blockNum).exist;
      expect(res.body.payload.payload).exist;
      expect(res.body.payload.payload.role).equal('admin');
    });
  });
});
