export interface ICreateTxProposalRequest {
    ssaID: string;
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
	accountID:string;
    proposalID: string;
    amount: number;
    choice: string;
}

export interface IVoteMemProposalRequest {
	accountID:string;
    proposalID: string;
    choice: string;
}

export interface IQueryProposalRequest {
    proposalId: string;
    type: string;
}