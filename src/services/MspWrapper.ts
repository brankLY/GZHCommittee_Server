import * as debug from 'debug';
import axios from 'axios';
import { MSP_URL } from '../config/constants';
import { IUserInfo } from '../interfaces/user';

const LOG = debug('GZHCommittee_Server:MspWrapper');

export class MspWrapper {
  static async getUser(token: string): Promise<IUserInfo> {
    const method: string = 'getUser';
    try {
      const MSP_USER = MSP_URL + '/user/info';
      const response: any = await axios.get(MSP_USER, { validateStatus: null, headers: { 'Authorization': `Bearer ${token}` } });
      LOG('%s - Success Get UserInfo at MSP. Response(%s): %j', method, response.status, response.data);
      if (response.status !== 200) {
        LOG('%s - MSP Response Error', method);
        throw new Error(response.data.message);
      }
      
      LOG('%s - Exit', method);
      return response.data.payload as IUserInfo;
    } catch (e) {
      LOG('%s - Error: %o', e);
      throw e;
    }
  }
}
