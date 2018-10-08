import * as chai from 'chai';
import chaiHttp = require('chai-http');
import axios from 'axios';
import { MSP_URL } from '../../src/config/constants';

import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API Tests', () => {
  const user = {
    username: 'user' + Math.random().toFixed(3).toString(),
    password: '123',
  };
  let token;
  
  it('create should return success 201 for this user', () => {
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
  
  it('create with a same username shold response 400', () => {
    return chai.request(app)
    .post('/api/v1/user')
    .send(user)
    .then(res => {
      expect(res.status).to.equal(400);
      expect(res.body).exist;
      expect(res.body.success).equal(false);
      expect(res.body.message).equal('user already exists');
    });
  });
  
  it('login the user should get jwt token from msp', async () => {
    const LOGIN_URL = MSP_URL + '/auth/login';
    const {data} = await axios.post(LOGIN_URL, user);
    expect(data).exist;
    expect(data.success).to.equal(true);
    expect(data.payload).exist;
    expect(data.payload.token).exist;
    token = data.payload.token;
    console.log(token);
  });
  
  it('get user with out token should response 401', () => {
    return chai.request(app)
    .get(`/api/v1/user/${user.username}`)
    // .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body).exist;
      expect(res.body.success).equal(false);
      expect(res.body.message).equal('No authorization token was found');
    });
  });
  
  it('get user with correct token but for another user should response 401', () => {
    return chai.request(app)
    .get(`/api/v1/user/anotherUser`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body).exist;
      expect(res.body.success).equal(false);
    });
  });
  
  it('get user with correct token should response 200', () => {
    return chai.request(app)
    .get(`/api/v1/user/${user.username}`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body).exist;
      expect(res.body.success).equal(true);
      console.log(res.body);
      expect(res.body.payload).exist;
      expect(res.body.payload.role).to.equal('user');
      expect(res.body.payload.canCreateNewToken).to.equal(false);
      expect(res.body.payload.wallet).to.deep.equal({});
    });
  });
  
  it('update user with correct token should response 200', () => {
    return chai.request(app)
    .put(`/api/v1/user/${user.username}`)
    .set('Authorization', `Bearer ${token}`)
    .send({password: '123'})
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body).exist;
      expect(res.body.success).equal(true);
      console.log(res.body);
      expect(res.body.payload).exist;
      expect(res.body.payload.role).to.equal('user');
      expect(res.body.payload.password).to.equal('123');
    });
  });
});
