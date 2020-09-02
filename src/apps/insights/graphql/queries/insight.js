import gql from 'graphql-tag'

export const GET_INSIGHT = gql`
   query GetInsight($id: uuid!) {
      insight(id: $id) {
         id
         options
         query
         switches
      }
   }
`
