import { graphql } from '@/core/api/graphqlClient';
import { GET_LOAN_ACCOUNTS, GET_LOAN_TRANSACTION } from './loanAccount.queries';

export const fetchLoanAccounts = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  try {
    const client = await graphql();

    const res = await client.request(GET_LOAN_ACCOUNTS, {
      user_id: userId,
      limit,
      offset,
    });

    const nodes =
      res?.loan_contractsCollection?.edges?.map((e: any) => e.node) ?? [];

    const count =
      res?.loan_contractsCollectionAggregate?.aggregate?.count ?? nodes.length;

    return {
      data: nodes,
      count,
      error: null,
    };
  } catch (err: any) {
    console.log('❌ fetchLoanAccounts error:', err);

    throw new Error(
      err?.response?.errors?.[0]?.message ||
        err?.message ||
        'Failed to fetch loan information',
    );
  }
};

export const fetchLoanTransactions = async (
  loanAccountId: string,
  limit: number,
  offset: number,
) => {
  try {
    const client = await graphql();

    const res = await client.request(GET_LOAN_TRANSACTION, {
      loan_account_id: loanAccountId,
      limit,
      offset,
    });

    const nodes =
      res?.loan_repayment_schedulesCollection?.edges?.map((e: any) => {
        const schedule = e.node;

        return {
          ...schedule,
          loan_ledgers:
            schedule.loan_ledgersCollection?.edges?.map((l: any) => l.node) ??
            [],
        };
      }) ?? [];

    const count =
      res?.loan_repayment_schedulesCollectionAggregate?.aggregate?.count ??
      nodes.length;

    return {
      data: nodes,
      count,
      error: null,
    };
  } catch (err: any) {
    console.log('❌ fetchLoanTransactions error:', err);

    return {
      data: [],
      count: 0,
      error:
        err?.response?.errors?.[0]?.message ||
        err?.message ||
        'Failed to fetch loan transactions',
    };
  }
};
