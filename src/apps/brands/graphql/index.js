import gql from 'graphql-tag'

export const BRANDS = {
   AGGREGATE: gql`
      subscription brands {
         brandsAggregate {
            aggregate {
               count
            }
         }
      }
   `,
}
