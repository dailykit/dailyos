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
         campaignType
      }
   }
`

export const CREATE_CAMPAIGN = gql`
   mutation CREATE_CAMPAIGN($campaignType: String!, $metaDetails: jsonb!) {
      createCampaign(
         object: { campaignType: $campaignType, metaDetails: $metaDetails }
      ) {
         id
         campaignType
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
         campaignType
         isActive
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
         campaignType
      }
   }
`
