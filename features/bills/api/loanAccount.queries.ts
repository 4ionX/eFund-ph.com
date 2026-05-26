import { gql } from 'graphql-request';

export const GET_LOAN_ACCOUNTS = gql`
  query GetLoanAccounts($user_id: UUID!, $limit: Int!, $offset: Int!) {
    loan_contractsCollection(
      filter: { user_id: { eq: $user_id }, status: { eq: "Released" } }
      first: $limit
      offset: $offset
      orderBy: { updated_at: DescNullsLast }
    ) {
      edges {
        node {
          id
          approved_amount
          loan_type
          released_at

          loan_accounts {
            id
            status
            total_amount_paid
          }
        }
      }
    }
  }
`;

export const GET_LOAN_TRANSACTION = gql`
  query GetLoanTransaction(
    $loan_account_id: UUID!
    $limit: Int!
    $after: Cursor
  ) {
    loan_repayment_schedulesCollection(
      filter: { loan_account_id: { eq: $loan_account_id } }
      first: $limit
      after: $after
      orderBy: { installment_number: AscNullsLast }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          installment_number
          due_amount
          amount_paid
          due_date
          running_balance
          overdue_amount
          payment_status
          penalty_amount
          penalty_amount_paid

          loan_ledgersCollection {
            edges {
              node {
                id
                reference_number
                reference_type
                amount_paid
                remarks
                transaction_date
              }
            }
          }
        }
      }
    }
  }
`;
