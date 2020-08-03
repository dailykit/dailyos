import gql from 'graphql-tag'

export const CUSTOMER_DATA = gql`
   query CUSTOMER_DATA {
      customers {
         keycloakId
         platform_customer {
            firstName
            lastName
         }
         orders_aggregate {
            aggregate {
               count
               sum {
                  amountPaid
                  discount
               }
            }
         }
      }
   }
`
