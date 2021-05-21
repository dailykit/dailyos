import gql from 'graphql-tag'

export const QUERIES = {
   CART: {
      LIST: gql`
         subscription carts($where: order_cart_bool_exp = {}) {
            carts: cartsAggregate(where: $where) {
               aggregate {
                  count
               }
               nodes {
                  id
                  source
                  customerInfo
                  brand {
                     id
                     title
                  }
                  fulfillmentInfo
               }
            }
         }
      `,
   },
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
      ADDRESS: {
         LIST: gql`
            query addresses($where: platform_customerAddress_bool_exp = {}) {
               addresses: platform_customerAddresses(where: $where) {
                  id
                  lat
                  lng
                  line1
                  line2
                  city
                  state
                  country
                  zipcode
                  label
                  notes
                  landmark
               }
            }
         `,
      },
      PAYMENT_METHODS: {
         LIST: gql`
            query paymentMethods(
               $where: platform_stripePaymentMethod_bool_exp = {}
            ) {
               paymentMethods: platform_stripePaymentMethods(where: $where) {
                  id: stripePaymentMethodId
                  last4
                  expMonth
                  expYear
                  name: cardHolderName
               }
            }
         `,
      },
   },
}
