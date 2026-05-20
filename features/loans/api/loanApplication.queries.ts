import { gql } from 'graphql-request';

export const GET_LOAN_APPLICATION = gql`
  query GetLoanApplications(
    $user_id: UUID!
    $limit: Int!
    $offset: Int!
    $status: String
  ) {
    loan_applicationsCollection(
      filter: { user_id: { eq: $user_id }, status: { eq: $status } }
      first: $limit
      offset: $offset
      orderBy: { created_at: DescNullsLast }
    ) {
      edges {
        node {
          id
          loan_type
          loan_amount
          disbursement_method
          account_name
          account_number
          provider
          status
          created_at
          updated_at
        }
      }
    }
  }
`;

export const GET_LOAN_CONTRACT = gql`
  query GetLoanContract($user_id: UUID!, $loan_application_id: UUID!) {
    personal_informationsCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          first_name
          middle_name
          last_name
        }
      }
    }

    co_borrowersCollection(filter: { user_id: { eq: $user_id } }) {
      edges {
        node {
          first_name
          middle_name
          last_name
        }
      }
    }

    loan_contractsCollection(
      filter: { loan_application_id: { eq: $loan_application_id } }
    ) {
      edges {
        node {
          id
          interest
          processing_fee
          notes
          others
          approved_amount
          service_fee
          total_deduction
          amortization_amount
          number_of_payments
          net_proceeds
          due_dates
          status
          repayment_frequency
          signature_url
          created_at
          updated_at
        }
      }
    }
  }
`;
