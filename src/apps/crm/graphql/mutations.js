import gql from 'graphql-tag'

export const ISTEST = gql`
   mutation ISTEST($keycloakId: String!, $isTest: Boolean!) {
      updateCustomer(
         pk_columns: { keycloakId: $keycloakId }
         _set: { isTest: $isTest }
      ) {
         isTest
      }
   }
`
