import gql from 'graphql-tag'

export const MUTATIONS = {
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
   CART: {
      INSERT: gql`
         mutation createCart($object: order_cart_insert_input!) {
            createCart(object: $object) {
               id
            }
         }
      `,
   },
}

export const QUERIES = {
   BRAND: {
      LIST: gql`
         query brands {
            brands(
               where: { isArchived: { _eq: false }, isPublished: { _eq: true } }
               order_by: { title: asc }
            ) {
               id
               title
               domain
            }
         }
      `,
   },
   CUSTOMER: {
      LIST: gql`
         query customers($where: crm_brand_customer_bool_exp = {}) {
            customers: brandCustomers(where: $where) {
               id
               keycloakId
               subscriptionPaymentMethodId
               customer {
                  id
                  email
                  isTest
                  platform_customer {
                     id: keycloakId
                     firstName
                     lastName
                     phoneNumber
                     fullName
                     stripeCustomerId
                     customerByClients: CustomerByClients {
                        id: keycloakId
                        clientId
                        organizationStripeCustomerId
                     }
                  }
               }
            }
         }
      `,
   },
   ORGANIZATION: gql`
      query organizations {
         organizations {
            id
            stripeAccountId
            stripeAccountType
            stripePublishableKey
         }
      }
   `,
}
