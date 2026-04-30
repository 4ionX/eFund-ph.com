import { graphql } from '@/core/api/graphqlClient';
import {
  GET_LOAN_APPLICATION,
  GET_LOAN_CONTRACT,
} from './loanApplication.queries';

export const fetchLoanApplications = async (
  userId: string,
  limit: number,
  offset: number,
) => {
  const client = await graphql();
  const res = await client.request(GET_LOAN_APPLICATION, {
    user_id: userId,
    limit,
    offset,
  });

  const nodes =
    res.loan_applicationsCollection?.edges?.map((e: any) => e.node) ?? [];

  const count = res.loan_applicationsCollectionAggregate?.aggregate?.count ?? 0;

  return {
    data: nodes,
    count,
  };
};

export const fetchLoanContract = async (
  user_id: string,
  loan_application_id: string,
) => {
  try {
    const client = await graphql();
    const response = await client.request(GET_LOAN_CONTRACT, {
      user_id: user_id,
      loan_application_id: loan_application_id,
    });

    return {
      personalInfo:
        response.personal_informationsCollection?.edges?.[0]?.node ?? null,

      coBorrowers: response.co_borrowersCollection?.edges?.[0]?.node ?? null,

      contractInfo: response.loan_contractsCollection?.edges?.[0]?.node ?? null,
    };
  } catch (error: any) {
    console.error('Error fetching loan information:', error);

    throw new Error(
      error?.response?.errors?.[0]?.message ||
        error?.message ||
        'Failed to fetch loan information',
    );
  }
};
