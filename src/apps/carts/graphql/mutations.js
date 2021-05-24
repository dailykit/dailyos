import gql from 'graphql-tag'

export const MUTATIONS = {
   CART: {
      ITEM: {
         DELETE: gql`
            mutation deleteCartItem($id: Int!) {
               deleteCartItem(id: $id) {
                  id
               }
            }
         `,
      },
      UPDATE: gql`
         mutation updateCart($id: Int!, $_set: order_cart_set_input = {}) {
            updateCart(pk_columns: { id: $id }, _set: $_set) {
               id
            }
         }
      `,
   },
   BRAND: {
      CUSTOMER: {
         UPDATE: gql`
            mutation updateBrandCustomers(
               $where: crm_brand_customer_bool_exp!
               $_set: crm_brand_customer_set_input!
            ) {
               updateBrandCustomers(where: $where, _set: $_set) {
                  affected_rows
               }
            }
         `,
      },
   },
   STRIPE: {
      PAYMENT_METHOD: {
         CREATE: gql`
            mutation paymentMethod(
               $object: platform_stripePaymentMethod_insert_input!
            ) {
               paymentMethod: platform_createStripePaymentMethod(
                  object: $object
               ) {
                  keycloakId
                  stripePaymentMethodId
               }
            }
         `,
      },
   },
}
