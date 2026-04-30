import { gql } from 'graphql-request';

export const GET_PERSONAL_INFORMATION = gql`
  query GetPersonalInformation($user_id: user_id!) {
    personal_informationsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
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
        }
      }
    }
  }
`;
