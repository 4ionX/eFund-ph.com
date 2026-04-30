import { gql } from 'graphql-request';

export const GET_CO_BORROWERS_WITH_CHILDREN = gql`
  query GetCoBorrowers($user_id: UUID!) {
    co_borrowersCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          id
          first_name
          middle_name
          last_name
          birth_date
          civil_status
          length_of_stay
          present_address
          previous_address
          source_of_income
          primary_contact_number
          secondary_contact_number
          social_media_link

          childrenCollection {
            edges {
              node {
                id
                first_name
                middle_name
                last_name
                present_address
                social_media_link
                school
              }
            }
          }
        }
      }
    }
  }
`;
