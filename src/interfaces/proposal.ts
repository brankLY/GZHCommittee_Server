export interface ICreateTxProposalRequest {
    amount: number;
    target: string;
    deadline: string;
    description: string;
    id:string;
}

export interface ICreateMemProposalRequest {
    type: string;
    member: string;
    deadline: string;
    description: string;
    id:string;
}

export interface IVoteTxProposalRequest {
	accountId:string;
    proposalId: string;
    choice: string;
}

export interface IVoteMemProposalRequest {
	accountId:string;
    proposalId: string;
    choice: string;
}

export interface IQueryProposalRequest {
    proposalId: string;
    type: string;
}