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

export const COUPON_LISTING = gql`
   subscription COUPON_LISTING {
      coupons {
         id
         code
         isActive
      }
   }
`

export const COUPON_TOTAL = gql`
   subscription COUPON_TOTAL {
      couponsAggregate {
         aggregate {
            count
         }
      }
   }
`
export const COUPON_DATA = gql`
   subscription COUPON_DATA($id: Int!) {
      coupon(id: $id) {
         id
         code
         isActive
         metaDetails
         visibleConditionId
      }
   }
`

export const CAMPAIGN_DATA = gql`
   subscription CAMPAIGN_DATA($id: Int!) {
      campaign(id: $id) {
         campaignType
         conditionId
         id
         isActive
         isRewardMulti
         metaDetails
      }
   }
`
