import gql from 'graphql-tag'

export const CUSTOMERS_LISTING = gql`
   query CUSTOMER_LISTING {
      customers(where: { isArchived: { _eq: false } }) {
         keycloakId
         source
         platform_customer {
            firstName
            lastName
            email
            phoneNumber
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
         isTest
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
            channel: orderCart {
               cartSource
            }
         }
         orders_aggregate {
            aggregate {
               count
            }
         }
      }
   }
`

export const REFERRAL_LISTING = gql`
   query REFERRAL_LISTING($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         customerReferralDetails {
            customerReferrals_aggregate {
               aggregate {
                  count
               }
               nodes {
                  keycloakId
                  customer {
                     platform_customer {
                        firstName
                        lastName
                        phoneNumber
                        email
                     }
                  }
                  referralStatus
               }
            }
         }
      }
   }
`

export const WALLET_LISTING = gql`
   query WALLET_LISTING($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         wallet {
            amount
            walletTransactions_aggregate {
               aggregate {
                  count
               }
               nodes {
                  created_at
                  id
                  orderCart {
                     orderId
                  }
                  type
                  amount
                  wallet {
                     balanceAmount: amount
                  }
               }
            }
         }
      }
   }
`

export const LOYALTYPOINTS_LISTING = gql`
   query LOYALTYPOINTS_LISTING($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         loyaltyPoint {
            points
            loyaltyPointTransactions_aggregate {
               aggregate {
                  count
               }
               nodes {
                  created_at
                  id
                  type
                  points
                  orderCart {
                     orderId
                  }
                  loyaltyPoint {
                     balanceAmount: points
                  }
               }
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
         channel: orderCart {
            cartSource
         }
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
         deliveryFee: deliveryInfo(path: "deliveryFee")
      }
   }
`

export const ALL_DATA = gql`
   query ALL_DATA($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         platform_customers {
            customerAddresses {
               id
               line1
               line2
               city
               zipcode
               state
               country
            }
            stripePaymentMethods {
               stripePaymentMethodId
               brand
               last4
               expMonth
               expYear
            }
         }
      }
   }
`
export const STATUS = gql`
   query STATUS($oid: oid!) {
      order(id: $oid) {
         id
         orderStatus
         transactionId
         paymentStatus
         orderCart {
            transactionRemark
         }
      }
   }
`

export const SUBSCRIPTION = gql`
   query SUBSCRIPTION($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         subscriptionId
         ordered: subscriptionOccurences_aggregate(
            where: { orderCart: { orderId: { _is_null: false } } }
         ) {
            aggregate {
               count
            }
         }
         skipped: subscriptionOccurences_aggregate(
            where: { isSkipped: { _eq: true } }
         ) {
            aggregate {
               count
            }
         }
      }
   }
`
export const SUBSCRIPTION_PLAN = gql`
   query SUBSCRIPTION_PLAN($keycloakId: String!) {
      customer(keycloakId: $keycloakId) {
         isSubscriber
         subscription {
            rrule
            subscriptionItemCount {
               count
               plan: subscriptionServing {
                  subscriptionTitle {
                     title
                  }
               }
            }
         }
      }
   }
`
export const OCCURENCES = gql`
   query OCCURENCES($sid: Int!, $keycloakId: String!) {
      subscriptionOccurencesAggregate(
         where: { subscriptionId: { _eq: $sid } }
      ) {
         occurenceCount: aggregate {
            count
         }
         nodes {
            fulfillmentDate
            startTimeStamp
            cutoffTimeStamp
            customers(where: { keycloakId: { _eq: $keycloakId } }) {
               isSkipped
               orderCart {
                  orderId
                  id
                  amount
               }
            }
         }
      }
   }
`
export const REWARD_DATA = gql`
   query REWARD_DATA($id: Int!) {
      crm_reward_by_pk(id: $id) {
         campaignId
         conditionId
         couponId
         id
         rewardValue
         type
         priority
      }
   }
`
