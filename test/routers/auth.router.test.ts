import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth API Tests', () => {
  const admin = {
    username: 'admin',
    password: 'adminpw',
  };
  const user = {
    username: 'user' + Math.random().toFixed(5).toString(),
    password: 'userpw',
  };
  let token;
  
  it('/auth/login with username and password should response 200', async () => {
    return chai.request(app)
    .post(`/api/v1/auth/login`)
    .send(admin)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).exist;
      expect(res.body.payload).exist;
      expect(res.body.payload.token).exist;
      token = res.body.payload.token;
    });
  });
  
  it('/auth/login with username and password should response 401', () => {
    return chai.request(app)
    .post(`/api/v1/auth/login`)
    .send({
      username: 'dummyUser',
      password: 'dummyPassword',
    })
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).to.equal('User does not exist');
    });
  });
  
  it('/auth/verify with correct token should response 200', () => {
    return chai.request(app)
    .post(`/api/v1/auth/verify`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).to.equal('Token is valid');
      expect(res.body.payload).exist;
      expect(res.body.payload.user).exist;
      expect(res.body.payload.user.id).to.equal('admin');
      expect(res.body.payload.user.username).to.equal('admin');
      expect(res.body.payload.user.role).to.equal('admin');
    });
  });
  
  it('/auth/verify with dummy token should response 401', () => {
    return chai.request(app)
    .post(`/api/v1/auth/verify`)
    .set('Authorization', `Bearer dummyToken`)
    .then(res => {
      expect(res.status).to.equal(401);
      expect(res.body.success).to.equal(false);
      expect(res.body.message).exist;
    });
  });
});
