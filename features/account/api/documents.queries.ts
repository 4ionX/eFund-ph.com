import { gql } from 'graphql-request';

export const GET_DOCUMENTS = gql`
  query GetDocuments($user_id: user_id!) {
    documentsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id_type
          id_url
          business_document_type
          business_document_url
        }
      }
    }
  }
`;
