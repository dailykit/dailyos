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
export const CAMPAIGN_LISTING = gql`
   subscription CAMPAIGN_LISTING {
      campaigns {
         id
         type
         conditionId
         isActive
         isRewardMulti
         metaDetails
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
export const CAMPAIGN_TOTAL = gql`
   subscription CAMPAIGN_TOTAL {
      campaignsAggregate {
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
         isRewardMulti
         metaDetails
         visibleConditionId
      }
   }
`

export const CAMPAIGN_DATA = gql`
   subscription CAMPAIGN_DATA($id: Int!) {
      campaign(id: $id) {
         type
         conditionId
         id
         isActive
         isRewardMulti
         metaDetails
         campaignType {
            rewardTypes {
               rewardType {
                  value
               }
            }
         }
      }
   }
`
export const CAMPAIGN_TYPE = gql`
   subscription CAMPAIGN_TYPE {
      crm_campaignType {
         id
         value
      }
   }
`
export const REWARD_TYPE = gql`
   subscription REWARD_TYPE {
      crm_rewardType(where: { useForCoupon: { _eq: true } }) {
         id
         value
      }
   }
`

export const REWARD_DATA_BY_COUPON_ID = gql`
   subscription REWARD_DATA_BY_COUPON_ID($couponId: Int!) {
      crm_reward(where: { couponId: { _eq: $couponId } }) {
         conditionId
         id
         couponId
         campaignId
         priority
         rewardValue
         type
      }
   }
`
