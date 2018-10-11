export interface ICreateProposalRequest {
    amount: number;
    target: string;
}

export interface IVoteProposalRequest {
    proposalId: string;
}
