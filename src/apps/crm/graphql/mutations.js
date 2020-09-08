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

export const DELETE_COUPON = gql`
   mutation DELETE_COUPON($id: Int!) {
      deleteCoupon(id: $id) {
         id
      }
   }
`
