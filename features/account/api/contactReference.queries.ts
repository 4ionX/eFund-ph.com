import { gql } from 'graphql-request';

export const GET_CONTACT_REFERENCE = gql`
  query GetContactReference($user_id: user_id!) {
    contact_referencesCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          contact_name
          contact_number
          relationship
        }
      }
    }
  }
`;
