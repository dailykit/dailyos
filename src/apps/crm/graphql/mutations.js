import gql from 'graphql-tag'

export const ISTEST = gql`
   mutation ISTEST($keycloakId: String!, $isTest: Boolean!) {
      updateCustomer(
         pk_columns: { keycloakId: $keycloakId }
         _set: { isTest: $isTest }
      ) {
         isTest
      }
   }
`

export const COUPON_ACTIVE = gql`
   mutation COUPON_ACTIVE($couponId: Int!, $isActive: Boolean!) {
      updateCoupon(
         pk_columns: { id: $couponId }
         _set: { isActive: $isActive }
      ) {
         isActive
      }
   }
`

export const CAMPAIGN_ACTIVE = gql`
   mutation CAMPAIGN_ACTIVE($campaignId: Int!, $isActive: Boolean!) {
      updateCampaign(
         pk_columns: { id: $campaignId }
         _set: { isActive: $isActive }
      ) {
         id
         isActive
         type
      }
   }
`

export const CREATE_CAMPAIGN = gql`
   mutation CREATE_CAMPAIGN($type: String!, $metaDetails: jsonb!) {
      createCampaign(object: { type: $type, metaDetails: $metaDetails }) {
         id
         type
         isActive
         metaDetails
      }
   }
`

export const CREATE_COUPON = gql`
   mutation CREATE_COUPON($couponCode: String!) {
      createCoupon(object: { code: $couponCode }) {
         id
         code
      }
   }
`
export const CREATE_REWARD = gql`
   mutation CREATE_REWARD(
      $rewardType: String!
      $couponId: Int
      $campaignId: Int
   ) {
      insert_crm_reward(
         objects: {
            type: $rewardType
            couponId: $couponId
            campaignId: $campaignId
         }
      ) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_COUPON = gql`
   mutation UPDATE_COUPON($id: Int!, $set: crm_coupon_set_input) {
      updateCoupon(pk_columns: { id: $id }, _set: $set) {
         id
         code
         isActive
      }
   }
`
export const UPDATE_CAMPAIGN = gql`
   mutation UPDATE_CAMPAIGN($id: Int!, $set: crm_campaign_set_input) {
      updateCampaign(pk_columns: { id: $id }, _set: $set) {
         id
         type
         isActive
      }
   }
`
export const UPDATE_REWARD = gql`
   mutation UPDATE_REWARD($id: Int!, $set: crm_reward_set_input!) {
      update_crm_reward_by_pk(pk_columns: { id: $id }, _set: $set) {
         id
         type
      }
   }
`

export const DELETE_COUPON = gql`
   mutation DELETE_COUPON($id: Int!) {
      deleteCoupon(id: $id) {
         id
      }
   }
`

export const DELETE_CAMPAIGN = gql`
   mutation DELETE_CAMPAIGN($campaignId: Int!) {
      deleteCampaign(id: $campaignId) {
         id
         type
      }
   }
`

export const DELETE_REWARD = gql`
   mutation DELETE_REWARD($id: Int!) {
      delete_crm_reward_by_pk(id: $id) {
         id
         campaignId
         type
      }
   }
`
export const UPSERT_BRAND_COUPON = gql`
   mutation UPSERT_BRAND_COUPON($object: crm_brand_coupon_insert_input!) {
      createBrandCoupon(
         object: $object
         on_conflict: {
            constraint: brand_coupon_pkey
            update_columns: isActive
         }
      ) {
         brandId
         couponId
         isActive
      }
   }
`
