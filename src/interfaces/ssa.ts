export interface ICreateSSARequest {
  id: string;
  name: string;  
}

export interface IQuerySSARequest{
	id: string;
}

export interface ICreateSupportRequest{
	id: string;
	ssaID: string;
	accountID: string;
    amount: number;
    description: string;
}