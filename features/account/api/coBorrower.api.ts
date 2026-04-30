import { graphql } from '@/core/api/graphqlClient';
import { GET_CO_BORROWERS_WITH_CHILDREN } from './coBorrower.queries';

export const fetchCoBorrowers = async (user_id: string) => {
  const client = await graphql();
  const res = await client.request(GET_CO_BORROWERS_WITH_CHILDREN, {
    user_id,
  });

  return res;
};
