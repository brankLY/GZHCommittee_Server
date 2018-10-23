export interface ICreateProposalRequest {
    amount: number;
    target: string;
    deadline: string;
    description: string;
    id:string;
}

export interface IVoteProposalRequest {
	accountId:string;
    proposalId: string;
    choice: string;
}
