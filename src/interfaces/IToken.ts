export interface ICreateTokenRequest {
  name: string;
  symbol: string;
  decimals: number;
  amount: number | string;
  description?: string;
  mintageAccountId: string;

  gasAccountId: string;
  gasMin: number;
  gasPercentage: number;

  ramAccountId?: string;
  ramMin?: number;
  ramPercentage?: number;
}

export interface ITransferTokenRequest {
  // target account id
  target: string;
  // symbol for this transfer request
  symbol: string;
  amount: number | string;
  description?: string;
  password: string;
}

export interface IUpdateRamRequest {
  symbol: string;
  ramMin: number;
  ramPercentage: number;
}

export interface IUpdateGasRequest {
  symbol: string;
  gasMin: number;
  gasPercentage: number;
}

export interface IQueryGasRequest {
  symbol: string;
  amount: number;
}
