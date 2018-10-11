import { describe, it } from 'mocha';
import { MspWrapper } from '../../src/services/MspWrapper';
import { expect } from 'chai';
import { MSP_URL } from '../../src/config/constants';

describe('Test MspWrapper', () => {
  let token: string;
  const user = {
    username: 'user' + Math.random().toFixed(5).toString(),
    password: '123',
  };
  const admin = {
    username: 'admin',
    password: 'adminpw',
  };
  const LOGIN_URL = MSP_URL + '/auth/login';
  
  it('get userinfo by token', async () => {
    const res = await MspWrapper.getUser(token);
    
    expect(res).exist;
    expect(res.username).equal(user.username);
    expect(res.role).equal('user');
    expect(res.id).exist;
    expect(res.mspId).exist;
    expect(res.privateKey).exist;
    expect(res.certificate).exist;
    expect(res.rootCertificate).exist;
  });
});
