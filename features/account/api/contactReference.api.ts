import { graphql } from '@/core/api/graphqlClient';
import { GET_CONTACT_REFERENCE } from './contactReference.queries';

export const fetchContactReference = async (user_id: string) => {
  const client = await graphql();

  try {
    const response = await client.request(GET_CONTACT_REFERENCE, {
      user_id,
    });
    const nodes =
      response.contact_referencesCollection?.edges?.map(
        (edge: any) => edge.node,
      ) ?? [];

    return nodes;
  } catch (error) {
    console.error('Error fetching contact reference:', error);
    throw new Error('Failed to fetch contact reference');
  }
};
