export interface ICreateProposalRequest {
    amount: number;
    target: string;
    deadline: number;
    description: string;
}

export interface IVoteProposalRequest {
    proposalId: string;
    choice: string;
}
