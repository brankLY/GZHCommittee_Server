export interface ICreateProposalRequest {
    amount: number;
    target: string;
    deadline: string;
    description: string;
}

export interface IVoteProposalRequest {
    proposalId: string;
    choice: string;
}
