import gql from 'graphql-tag'

export const CUSTOMERS_COUNT = gql`
   subscription CustomerCount {
      customers_aggregate {
         aggregate {
            count
         }
      }
   }
`
export const TOTAL_REVENUE = gql`
   subscription totalRevenue {
      ordersAggregate {
         aggregate {
            sum {
               amountPaid
            }
         }
      }
   }
`

export const CUSTOMER_ISTEST = gql`
   subscription CUSTOMER_ISTEST($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         isTest
      }
   }
`
