import gql from 'graphql-tag'

export const CUSTOMERS_LISTING = gql`
   query CUSTOMER_LISTING {
      customers {
         keycloakId
         source
         platform_customer {
            firstName
            lastName
         }
         orders_aggregate {
            aggregate {
               count
               sum {
                  amountPaid
                  discount
               }
            }
         }
      }
   }
`
export const CUSTOMER_DATA = gql`
   query CUSTOMER_DATA($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         source
         platform_customer {
            firstName
            lastName
            email
            phoneNumber
            defaultStripePaymentMethod {
               brand
               last4
               expMonth
               expYear
            }
            defaultCustomerAddress {
               line1
               line2
               city
               state
               zipcode
               country
            }
         }
         orders_aggregate {
            aggregate {
               count
               sum {
                  amountPaid
               }
            }
         }
      }
   }
`

export const ORDERS_LISTING = gql`
   query ORDERS_LISTING($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         orders {
            id
            itemTotal
            products: deliveryInfo(path: "orderInfo.products")
            discount
            discount
            amountPaid
            created_at
         }
         orders_aggregate {
            aggregate {
               count
            }
         }
      }
   }
`

export const ORDER = gql`
   query ORDER($orderId: oid!) {
      order(id: $orderId) {
         id
         itemTotal
         discount

         amountPaid
         created_at
         orderCart {
            cartInfo
            paymentMethodId
            paymentCard {
               brand
               last4
               expMonth
               expYear
            }
         }
         deliveryService {
            logo
            companyName
         }
         driverInfo: deliveryInfo(path: "assigned.driverInfo")
      }
   }
`
