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
  let token;
  before(() => {
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
  
  it('/identity/:username with a valid token should response 200', async () => {
    return chai.request(app)
    .get(`/api/v1/identity/admin`)
    .set('Authorization', `Bearer ${token}`)
    .then(res => {
      expect(res.status).to.equal(200);
      expect(res.body.success).to.equal(true);
      expect(res.body.message).exist;
      expect(res.body.payload).exist;
      expect(res.body.payload.privateKey).exist;
      expect(res.body.payload.certificate).exist;
      expect(res.body.payload.rootCertificate).exist;
      expect(res.body.payload.mspId).exist;
    });
  });
});
