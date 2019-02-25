export interface ICreateSPVRequest {
  id: string;
  name: string;  
}

export interface IQuerySPVRequest{
	id: string;
}

export interface ICreateSupportRequest{
	id: string;
	spvID: string;
	accountID: string;
    amount: number;
    description: string;
}