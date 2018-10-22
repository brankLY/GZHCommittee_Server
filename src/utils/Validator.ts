import * as debug from 'debug';
import { format } from 'util';
import { IInitMemberRequest } from '../interfaces/member';
import { ICreateProposalRequest, IVoteProposalRequest } from '../interfaces/proposal';

const LOG = debug('GZHCommittee_Server:Validator');

export class Validator {
  static VALIDATE_INIT_MEMBER_REQUEST(options: any): IInitMemberRequest {
    const method: string = 'VALIDATE_INIT_MEMBER_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty InitMemberRequest');
    }
    if (!options.member1) {
      throw new Error('Missing Required Option Property "member1"');
    }
    if (!options.member2) {
      throw new Error('Missing Required Option Property "member2"');
    }
    if (!options.member3) {
      throw new Error('Missing Required Option Property "member3"');
    }
    if (!options.member4) {
      throw new Error('Missing Required Option Property "member4"');
    }
    if (!options.member5) {
      throw new Error('Missing Required Option Property "member5"');
    }
    LOG('%s - Valid. Exit', method);
    return {
      member1: options.member1,
      member2: options.member2,
      member3: options.member3,
      member4: options.member4,
      member5: options.member5,
    };
  }
  
  static VALIDATE_CREATE_PROPOSAL_REQUEST(options: any): ICreateProposalRequest {
    const method: string = 'VALIDATE_CREATE_PROPOSAL_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty CreateProposalRequest');
    }
    if (!options.amount) {
      throw new Error(format('%j is not a valid CreateProposalRequest Object, Missing Required property %s', options, 'amount'));
    }
    if (!options.target) {
      throw new Error(format('%j is not a valid CreateProposalRequest Object, Missing Required property %s', options, 'target'));
    }
    if (!options.description) {
      throw new Error(format('%j is not a valid CreateProposalRequest Object, Missing Required property %s', options, 'description'));
    }
    if (!options.deadline) {
      throw new Error(format('%j is not a valid CreateProposalRequest Object, Missing Required property %s', options, 'deadline'));
    }
    LOG('%s - Valid. Exit', method);
  
    let amount = options.amount;
    if (typeof options.amount === 'string') {
      amount = parseFloat(options.amount);
    }

    return {
      amount: amount,
      deadline: options.deadline,
      target: options.target,
      description: options.description
    };
  }
  
  static VALIDATE_VOTE_PROPOSAL_REQUEST(options: any): IVoteProposalRequest {
    const method: string = 'VALIDATE_VOTE_PROPOSAL_REQUEST';
    LOG('%s - Enter', method);
    if (!options) {
      throw new Error('Empty VoteProposalRequest');
    }
    if (!options.proposalId) {
      throw new Error(format('%j is not a valid VoteProposalRequest Object, Missing Required property %s', options, 'proposalId'));
    }
    if (!options.choice) {
      throw new Error(format('%j is not a valid VoteProposalRequest Object, Missing Required property %s', options, 'choice'));
    }
    LOG('%s - Valid. Exit', method);

    return {
      proposalId: options.proposalId,
    };
  }
}
