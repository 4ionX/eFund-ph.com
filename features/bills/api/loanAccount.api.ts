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

export const fetchLoanTransactions = async (loanAccountId: string) => {
  try {
    const client = await graphql();

    const allNodes: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;
    const PAGE_SIZE = 30;

    while (hasNextPage) {
      const res: any = await client.request(GET_LOAN_TRANSACTION, {
        loan_account_id: loanAccountId,
        limit: PAGE_SIZE,
        after: cursor,
      });

      const collection: any = res?.loan_repayment_schedulesCollection;
      const edges: any[] = collection?.edges ?? [];
      const pageInfo: { hasNextPage: boolean; endCursor: string | null } =
        collection?.pageInfo;

      const nodes = edges.map((e: any) => {
        const schedule = e.node;
        return {
          ...schedule,
          loan_ledgers:
            schedule.loan_ledgersCollection?.edges?.map((l: any) => l.node) ??
            [],
        };
      });

      allNodes.push(...nodes);
      hasNextPage = pageInfo?.hasNextPage ?? false;
      cursor = pageInfo?.endCursor ?? null;
    }

    return {
      data: allNodes,
      count: allNodes.length,
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
