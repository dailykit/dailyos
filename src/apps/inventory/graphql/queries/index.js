import { gql } from 'apollo-boost'

export const AVAILABLE_SUPPLIERS = gql`
   query {
      suppliers {
         id
         name
         contactPerson
         available
      }
   }
`
export const MASTER_PROCESSINGS = gql`
   query {
      masterProcessings {
         id
         name
         description
      }
   }
`
