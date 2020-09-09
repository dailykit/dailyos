import gql from 'graphql-tag'

export const FACTS = gql`
   query Facts {
      facts {
         id
         query
      }
   }
`
