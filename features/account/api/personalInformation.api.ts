import { graphql } from '@/core/api/graphqlClient';
import { GET_PERSONAL_INFORMATION } from './personalInformation.queries';

export const fetchPersonalInformation = async (user_id: string) => {
  const client = await graphql();

  try {
    const response = await client.request(GET_PERSONAL_INFORMATION, {
      user_id,
    });
    const nodes =
      response.personal_informationsCollection?.edges?.map(
        (edge: any) => edge.node,
      ) ?? [];

    return nodes;
  } catch (error) {
    console.error('Error fetching personal information:', error);
    throw new Error('Failed to fetch personal information');
  }
};
