import gql from 'graphql-tag'

export const QUERIES = {
   CART: {
      ONE: gql`
         subscription cart($id: Int!) {
            cart(id: $id) {
               id
               tax
               discount
               itemTotal
               totalPrice
               customerId
               customerInfo
               deliveryPrice
               paymentMethodId
               walletAmountUsed
               loyaltyPointsUsed
               customerKeycloakId
               brand {
                  id
                  title
                  domain
               }
               address
               fulfillmentInfo
               products: cartItems_aggregate(
                  where: { levelType: { _eq: "orderItem" } }
               ) {
                  aggregate {
                     count
                  }
                  nodes {
                     id
                     price: unitPrice
                     image: displayImage
                     productOption: productOptionView {
                        id
                        name: displayName
                     }
                  }
               }
            }
         }
      `,
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
         ONE: gql`
            query paymentMethod($id: String!) {
               paymentMethod: platform_stripePaymentMethod(
                  stripePaymentMethodId: $id
               ) {
                  id: stripePaymentMethodId
                  last4
                  expMonth
                  expYear
                  name: cardHolderName
               }
            }
         `,
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
   MENU: gql`
      query menu($params: jsonb!) {
         menu: onDemand_getMenuV2(args: { params: $params }) {
            data
         }
      }
   `,
   PRODUCTS: {
      LIST: gql`
         query products($where: products_product_bool_exp = {}) {
            products(where: $where) {
               id
               name
               type
               assets
               tags
               additionalText
               description
               price
               discount
               isPopupAllowed
               isPublished
               defaultProductOptionId
            }
         }
      `,
   },
}
