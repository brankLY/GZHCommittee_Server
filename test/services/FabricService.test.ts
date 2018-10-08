import { FabricService } from '../../src/services/FabricService';
import { expect } from 'chai';
import { MspWrapper } from '../../src/services/MspWrapper';

describe('Test FabricService', () => {
  let token: string;
  const user = {
    username: 'user0' + Math.random().toFixed(4).toString(),
    password: '123',
  };
  let registry;
  let id;
  
  before(async () => {
    const res = await MspWrapper.createUser(user);
    token = res.token;
    const userInfo = await MspWrapper.getUser(res.token);
    id = userInfo.id;
    registry = await FabricService.createUserFromPersistance(userInfo.username, userInfo.privateKey, userInfo.certificate, userInfo.mspId);
  });
  
  it('constructor should load configs', () => {
    const fab = new FabricService();
    expect(fab).exist;
    expect(fab.configs).exist;
    expect(fab.client).exist;
    expect(fab.configs).to.be.a('Array');
  });
  
  it('Test invoke', async () => {
    const fab = new FabricService();
    const res = await fab.invoke('user.create', [id, user.username], registry);
    console.log(res);
  });
  
  it('Test query', async () => {
    const fab = new FabricService();
    const res = await fab.query('user.query', [], registry);
    console.log(res);
  });
});
