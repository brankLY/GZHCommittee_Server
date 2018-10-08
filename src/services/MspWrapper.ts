import * as debug from 'debug';
import axios from 'axios';
import { MSP_URL } from '../config/constants';
import { IUserInfo } from '../interfaces/user';
import { Validator } from '../utils/Validator';


const LOG = debug('DappJupiter:MspWrapper');


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
  
  static async updateUser(username: string, newVal: any, token: string): Promise<IUserInfo> {
    const method: string = 'updateUser';
    try {
      const MSP_USER = MSP_URL + '/user/' + username;
      const response: any = await axios.put(MSP_USER, newVal, { validateStatus: null, headers: { 'Authorization': `Bearer ${token}` } });
      LOG('%s - Success Updated UserInfo at MSP. Response(%s): %j', method, response.status, response.data);
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
  
  static async getUserByName(username: string, token: string): Promise<IUserInfo> {
    const method: string = 'getUser';
    try {
      const MSP_USER = MSP_URL + '/user/info/' + username;
      const response: any = await axios.get(MSP_USER, { validateStatus: null, headers: { 'Authorization': `Bearer ${token}` } });
      LOG('%s - Success Get UserInfo at MSP. Response(%s): %j', method, response.status, response.data);
      if (response.status !== 200) {
        throw new Error(response.data.message);
      }
      
      LOG('%s - Exit', method);
      return response.data.payload as IUserInfo;
    } catch (e) {
      LOG('%s - Error: %o', e);
      throw e;
    }
  }
  
  static async createUser(options): Promise<IUserInfo> {
    const method: string = 'createUser';
    try {
      Validator.VALIDATE_CREATE_USER_REQUEST(options);
      const MSP_USER = MSP_URL + '/user';
      const response: any = await axios.post(MSP_USER, options, { validateStatus: null });
      LOG('%s - Success Created User at MSP. Response(%s): %j', method, response.status, response.data);
      if (response.status !== 201) {
        const error: any = new Error(response.data.message);
        error.code = response.status;
        throw error;
      }
      
      LOG('%s - Exit', method);
      return response.data.payload as IUserInfo;
    } catch (e) {
      LOG('%s - Error: %o', e);
      throw e;
    }
  }
}
