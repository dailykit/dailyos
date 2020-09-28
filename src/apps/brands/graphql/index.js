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
   LIST: gql`
      subscription brands {
         brands: brandsAggregate {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               domain
               title
               isPublished
            }
         }
      }
   `,
}
