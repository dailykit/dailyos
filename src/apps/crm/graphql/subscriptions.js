import gql from 'graphql-tag'

export const CUSTOMERS_COUNT = gql`
   subscription CustomerCount {
      customers_aggregate(where: { isArchived: { _eq: false } }) {
         aggregate {
            count
         }
      }
   }
`
export const TOTAL_REVENUE = gql`
   subscription totalRevenue {
      ordersAggregate(where: { customer: { isArchived: { _eq: false } } }) {
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
      coupons(where: { isArchived: { _eq: false } }) {
         id
         code
         isActive
         isCouponValid
      }
   }
`
export const CAMPAIGN_LISTING = gql`
   subscription CAMPAIGN_LISTING {
      campaigns(where: { isArchived: { _eq: false } }) {
         id
         type
         conditionId
         isActive
         isRewardMulti
         metaDetails
         isCampaignValid
      }
   }
`

export const COUPON_TOTAL = gql`
   subscription COUPON_TOTAL {
      couponsAggregate(where: { isArchived: { _eq: false } }) {
         aggregate {
            count
         }
      }
   }
`
export const CAMPAIGN_TOTAL = gql`
   subscription CAMPAIGN_TOTAL {
      campaignsAggregate(where: { isArchived: { _eq: false } }) {
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
         isCouponValid
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
         isCampaignValid
         isRewardMulti
         metaDetails
         campaignType {
            rewardTypes {
               rewardType {
                  id
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
export const REWARD_DATA_BY_CAMPAIGN_ID = gql`
   subscription REWARD_DATA_BY_CAMPAIGN_ID($campaignId: Int!) {
      crm_reward(where: { campaignId: { _eq: $campaignId } }) {
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

export const BRAND_COUPONS = gql`
   subscription BRAND_COUPONS {
      brands {
         id
         domain
         title
         brand_coupons {
            couponId
            isActive
         }
      }
   }
`
export const BRAND_CAMPAIGNS = gql`
   subscription BRAND_CAMPAIGN {
      brands {
         id
         domain
         title
         brand_campaigns {
            campaignId
            isActive
         }
      }
   }
`
export const WALLET_N_REFERRAL = gql`
   subscription WALLET_N_REFERRAL($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         wallet {
            amount
         }
         customerReferralDetails {
            customerReferrals_aggregate {
               aggregate {
                  count
               }
            }
         }
      }
   }
`

export const LOYALTYPOINT_COUNT = gql`
   subscription LOYALTYPOINT_COUNT($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         loyaltyPoint {
            points
         }
      }
   }
`
export const SIGNUP_COUNT = gql`
   subscription SIGNUP_COUNT($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         customerReferralDetails {
            customerReferrals_aggregate(
               where: { signupStatus: { _eq: "COMPLETE" } }
            ) {
               aggregate {
                  count
               }
            }
         }
      }
   }
`
