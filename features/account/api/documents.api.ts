import { graphql } from '@/core/api/graphqlClient';
import { GET_DOCUMENTS } from './documents.queries';

export const fetchDocuments = async (user_id: string) => {
  const client = await graphql();

  try {
    const response = await client.request(GET_DOCUMENTS, {
      user_id,
    });
    const nodes =
      response.documentsCollection?.edges?.map((edge: any) => edge.node) ?? [];

    return nodes;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error('Failed to fetch documents');
  }
};
