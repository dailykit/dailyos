import gql from 'graphql-tag'

export const CUSTOMERS_DATA = gql`
   query CUSTOMER_DATA {
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
export const CUSTOMER= gql`
query CUSTOMER($keycloakId: String!, $orderId: oid) {
   customer(keycloakId:$keycloakId) {
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
     orders(where: {id: {_eq: $orderId}}) {
       id
       itemTotal
       discount
       deliveryInfo
       amountPaid
       created_at
       orderCart{
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
 }
 
`

// query MyQuery($id: oid!) {
//    order(id: $id) {
//      created_at
//      orderCart {
//        cartInfo
//        customerInfo
//        deliveryPrice
//        orderId
//        paymentCard {
//          brand
//          expMonth
//          expYear
//          last4
//        }
//        paymentMethodId
//        paymentStatus
//      }
//    }
//  }
 