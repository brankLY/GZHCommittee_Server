import { IUserInfo } from '../interfaces/user';
import * as debug from 'debug';
import { format } from 'util';
import { ICreateTokenRequest, ITransferTokenRequest, IUpdateGasRequest, IUpdateRamRequest, IQueryGasRequest } from '../interfaces/IToken';
import { ICreateBureauRequest, IQueryBureauRequest, IBetBureauRequest, IJudgeBureauRequest, IQueryOptionRequest, IQueryParticipate } from '../interfaces/bureau';

const LOG = debug('DappJupiter:Validator');

export class Validator {
  static VALIDATE_CREATE_USER_REQUEST(options: any): IUserInfo {
    const method: string = 'VALIDATE_CREATE_USER_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty CreateUserRequest');
    }
    if (!options.username) {
      throw new Error('Missing Required Option Property "username"');
    }
    if (!options.password) {
      throw new Error('Missing Required Option Property "password"');
    }
    LOG('%s - Valid. Exit', method);
    return {
      username: options.username,
      password: options.password,
    };
  }
  
  static VALIDATE_CREATE_TOKEN_REQUEST(options: any, init?: boolean): ICreateTokenRequest {
    const method: string = 'VALIDATE_CREATE_TOKEN_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty CreateTokenRequest');
    }
    if (!options.name) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'name'));
    }
    if (!options.symbol) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'symbol'));
    }
    if (!options.decimals) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'decimals'));
    }
    if (!options.amount) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'amount'));
    }
    if (!options.mintageAccountId) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'mintageAccountId'));
    }
    if (!options.gasAccountId) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'gasAccountId'));
    }

    if (!options.gasMin) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'gasMin'));
    }
    if (!options.gasPercentage) {
      throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'gasPercentage'));
    }

    if (!init) {
      LOG('%s - this is not init token, need check ram options', method);
      if (!options.ramAccountId) {
        throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'ramAccountId'));
      }
      if (!options.ramMin) {
        throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'ramMin'));
      }
      if (!options.ramPercentage) {
        throw new Error(format('%j is not a valid CreateTokenRequest Object, Missing Required property %s', options, 'ramPercentage'));
      }
    }

    LOG('%s - Valid. Exit', method);
  
    const res: ICreateTokenRequest = {
      name: options.name,
      symbol: options.symbol,
      decimals: options.decimals,
      amount: options.amount,
      description: options.description || '',
      mintageAccountId: options.mintageAccountId,

      gasAccountId: options.gasAccountId,
      gasMin: options.gasMin,
      gasPercentage: options.gasPercentage,
    };

    if (options.description) {
      res.description = options.description;
    }

    if (init) {
      return res;
    }

    res.ramAccountId = options.ramAccountId;
    res.ramMin = options.ramMin;
    res.ramPercentage = options.ramPercentage;

    return res;
  }
  
  static VALIDATE_TRANSFER_TOKEN_REQUEST(options: any): ITransferTokenRequest {
    const method: string = 'VALIDATE_TRANSFER_TOKEN_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty TransferTokenRequest');
    }
    if (!options.target) {
      throw new Error(format('%j is not a valid TransferTokenRequest Object, Missing Required property %s', options, 'target'));
    }
    if (!options.token) {
      throw new Error(format('%j is not a valid TransferTokenRequest Object, Missing Required property %s', options, 'token'));
    }
    if (!options.amount) {
      throw new Error(format('%j is not a valid TransferTokenRequest Object, Missing Required property %s', options, 'amount'));
    }
    if (!options.password) {
      throw new Error(format('%j is not a valid TransferTokenRequest Object, Missing Required property %s', options, 'password'));
    }
    LOG('%s - Valid. Exit', method);

    let amount = options.amount;
    if (typeof options.amount === 'string') {
      amount = parseFloat(options.amount);
    }

    return {
      target: options.target,
      symbol: options.token,
      amount,
      description: options.metadata || '',
      password: options.password,
    };
  }

  static VALIDATE_UPDATE_RAM_REQUEST(options: any, symbol: string): IUpdateRamRequest {
    const method: string = 'VALIDATE_UPDATE_RAM_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty UpdateRamRequest');
    }
    if (!symbol) {
      throw new Error(format('%j is not a valid token symbol, Missing Required property %s', symbol, 'symbol'));
    }
    if (!options.ramMin) {
      throw new Error(format('%j is not a valid UpdateRamRequest Object, Missing Required property %s', options, 'ramMin'));
    }
    if (!options.ramPercentage) {
      throw new Error(format('%j is not a valid UpdateRamRequest Object, Missing Required property %s', options, 'ramPercentage'));
    }
    LOG('%s - Valid. Exit', method);

    return {
      symbol: symbol,
      ramMin: options.ramMin,
      ramPercentage: options.ramPercentage,
    };
  }

  static VALIDATE_UPDATE_GAS_REQUEST(options: any, symbol: string): IUpdateGasRequest {
    const method: string = 'VALIDATE_UPDATE_RAM_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty UpdateRamRequest');
    }
    if (!symbol) {
      throw new Error(format('%j is not a valid token symbol, Missing Required property %s', symbol, 'symbol'));
    }
    if (!options.gasMin) {
      throw new Error(format('%j is not a valid UpdateRamRequest Object, Missing Required property %s', options, 'ramMin'));
    }
    if (!options.gasPercentage) {
      throw new Error(format('%j is not a valid UpdateRamRequest Object, Missing Required property %s', options, 'ramPercentage'));
    }

    let gasMin = options.gasMin;
    if (typeof options.gasMin === 'string') {
      gasMin = parseFloat(options.gasMin);
    }

    let gasPercentage = options.gasPercentage;
    if (typeof options.gasPercentage === 'string') {
      gasPercentage = parseFloat(options.gasPercentage);
    }

    LOG('%s - Valid. Exit', method);

    return {
      symbol: symbol,
      gasMin,
      gasPercentage,
    };
  }
  
  static VALIDATE_CREATE_BUREAU_REQUEST(options: any): ICreateBureauRequest {
    const method: string = 'VALIDATE_CREATE_BUREAU_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty CreateBureauRequest');
    }
    if (!options.name) {
      throw new Error(format('%j is not a valid CreateBureauRequest Object, Missing Required property %s', options, 'name'));
    }
    if (!options.chineseName) {
      throw new Error(format('%j is not a valid CreateBureauRequest Object, Missing Required property %s', options, 'chineseName'));
    }
    if (!options.endTime) {
      throw new Error(format('%j is not a valid CreateBureauRequest Object, Missing Required property %s', options, 'endTime'));
    }
    if (!options.judgePerson) {
      throw new Error(format('%j is not a valid CreateBureauRequest Object, Missing Required property %s', options, 'judgePerson'));
    }
    LOG('%s - Valid. Exit', method);
    
    return {
      name: options.name,
      chineseName: options.chineseName,
      content: options.content,
      endTime: options.endTime,
      option1: options.option1,
      option2: options.option2,
      option3: options.option3,
      option4: options.option4,
      option5: options.option5,
      judgePerson: options.judgePerson,
    };
  }

  static VALIDATE_QUERY_BUREAU_REQUEST(options: any): IQueryBureauRequest {
    const method: string = 'VALIDATE_QUERY_BUREAU_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty QueryBureauRequest');
    }
    if (!options.futureBureauName) {
      throw new Error(format('%j is not a valid QueryBureauRequest Object, Missing Required property %s', options, 'futureBureauName'));
    }
    LOG('%s - Valid. Exit', method);
  
    return {
      futureBureauName: options.futureBureauName,
    };
  }

  static VALIDATE_BET_BUREAU_REQUEST(options: any): IBetBureauRequest {
    const method: string = 'VALIDATE_BET_BUREAU_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty BetBureauRequest');
    }
    if (!options.futureBureauName) {
      throw new Error(format('%j is not a valid BetBureauRequest Object, Missing Required property %s', options, 'futureBureauName'));
    }
    if (!options.chooseOption) {
      throw new Error(format('%j is not a valid BetBureauRequest Object, Missing Required property %s', options, 'chooseOption'));
    }
    if (!options.amount) {
      throw new Error(format('%j is not a valid BetBureauRequest Object, Missing Required property %s', options, 'amount'));
    }
    if (!options.password) {
      throw new Error(format('%j is not a valid BetBureauRequest Object, Missing Required property %s', options, 'password'));
    }
    LOG('%s - Valid. Exit', method);
  
    return {
      futureBureauName: options.futureBureauName,
      chooseOption: options.chooseOption,
      amount: options.amount.toString(),
      password: options.password,
    };
  }

  static VALIDATE_JUDGE_BUREAU_REQUEST(options: any): IJudgeBureauRequest {
    const method: string = 'VALIDATE_JUDGE_BUREAU_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty JudgeBureauRequest');
    }
    if (!options.futureBureauName) {
      throw new Error(format('%j is not a valid GetBureauRequest Object, Missing Required property %s', options, 'futureBureauName'));
    }
    if (!options.result) {
      throw new Error(format('%j is not a valid GetBureauRequest Object, Missing Required property %s', options, 'result'));
    }
    LOG('%s - Valid. Exit', method);
  
    return {
      futureBureauName: options.futureBureauName,
      result: options.result,
    };
  }

  static VALIDATE_QUERY_GAS_REQUEST(options: any): IQueryGasRequest {
    const method: string = 'VALIDATE_QUERY_GAS_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty UpdateRamRequest');
    }
    if (!options.symbol) {
      throw new Error(format('%j is not a valid QueryGasRquest Object, Missing Required property %s', options, 'symbol'));
    }
    if (!options.amount) {
      throw new Error(format('%j is not a valid QueryGasRquest Object, Missing Required property %s', options, 'amount'));
    }

    let amount = options.amount;
    if (typeof options.amount === 'string') {
      amount = parseFloat(options.amount);
    }

    LOG('%s - Valid. Exit', method);
    return {
      symbol: options.symbol,
      amount,
    };
  }

  static VALIDATE_QUERY_OPTION(options: any): IQueryOptionRequest {
    const method: string = 'VALIDATE_QUERY_OPTION';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty IQueryOptionRequest');
    }
    if (!options.username) {
      throw new Error(format('%j is not a valid QueryGasRquest Object, Missing Required property %s', options, 'username'));
    }
    if (!options.futureBureauName) {
      throw new Error(format('%j is not a valid QueryGasRquest Object, Missing Required property %s', options, 'futureBureauName'));
    }

    LOG('%s - Valid. Exit', method);
    return {
      username: options.username,
      futureBureauName: options.futureBureauName,
    };
  }

  static VALIDATE_QUERY_PARTICIPATE(options: any): IQueryParticipate {
    const method: string = 'VALIDATE_QUERY_PARTICIPATE';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty IQueryParticipate');
    }
    if (!options.username) {
      throw new Error(format('%j is not a valid IQueryParticipate Object, Missing Required property %s', options, 'username'));
    }

    LOG('%s - Valid. Exit', method);
    return {
      username: options.username,
    };
  }
}
