import gql from 'graphql-tag'

export const CUSTOMERS_LISTING = gql`
   query CUSTOMER_LISTING($brandId: Int!) {
      customers(
         where: {
            isArchived: { _eq: false }
            brandCustomers: { brand: { id: { _eq: $brandId } } }
         }
      ) {
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
   query CUSTOMER_DATA($keycloakId: String!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_customers(where: { keycloakId: { _eq: $keycloakId } }) {
            customer {
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
      }
   }
`

export const ORDERS_LISTING = gql`
   query ORDERS_LISTING($keycloakId: String!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_customers(where: { keycloakId: { _eq: $keycloakId } }) {
            customer {
               orders {
                  id
                  itemTotal
                  products: deliveryInfo(path: "orderInfo.products")
                  discount
                  discount
                  amountPaid
                  created_at
                  channel: cart {
                     source
                  }
               }
               orders_aggregate {
                  aggregate {
                     count
                  }
               }
            }
         }
      }
   }
`

export const REFERRAL_LISTING = gql`
   query REFERRAL_LISTING($keycloakId: String!, $brandId: Int!) {
      customerReferrals(
         where: {
            customerReferrer: { keycloakId: { _eq: $keycloakId } }
            brandId: { _eq: $brandId }
         }
      ) {
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
`

export const WALLET_LISTING = gql`
   query WALLET_LISTING($keycloakId: String!, $brandId: Int!) {
      walletTransactions(
         where: {
            wallet: {
               keycloakId: { _eq: $keycloakId }
               brandId: { _eq: $brandId }
            }
         }
      ) {
         created_at
         id
         orderCart {
            orderId
         }
         type
         amount
         wallet {
            amount
         }
      }
   }
`

export const LOYALTYPOINTS_LISTING = gql`
   query LOYALTYPOINTS_LISTING($keycloakId: String!, $brandId: Int!) {
      loyaltyPointsTransactions(
         where: {
            loyaltyPoint: {
               keycloakId: { _eq: $keycloakId }
               brandId: { _eq: $brandId }
            }
         }
      ) {
         created_at
         id
         type
         points
         cart {
            orderId
         }
         loyaltyPoint {
            balanceAmount: points
         }
      }
   }
`

export const ORDER = gql`
   query ORDER($orderId: oid!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_Orders(where: { id: { _eq: $orderId } }) {
            id
            itemTotal
            discount
            amountPaid
            created_at
            cart {
               source
               billingDetails
               walletAmountUsed
               cartItemViews(where: { level: { _eq: 1 } }) {
                  id
                  displayName
                  displayImage
                  unitPrice
                  childs {
                     displayName
                     displayImage
                     unitPrice
                  }
               }
               paymentMethodId
               #  paymentCart {
               #   brand
               #   last4
               #   expMonth
               #   expYear
               # }
            }
            deliveryService {
               logo
               companyName
            }
            driverInfo: deliveryInfo(path: "assigned.driverInfo")
            deliveryFee: deliveryInfo(path: "deliveryFee")
         }
      }
   }
`

export const ALL_DATA = gql`
   query ALLCUSTOMER_DATA($keycloakId: String!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_customers(where: { keycloakId: { _eq: $keycloakId } }) {
            customer {
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
      }
   }
`
export const STATUS = gql`
   query STATUS($oid: oid!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_Orders(where: { id: { _eq: $oid } }) {
            id
            cart {
               status
               transactionId
               paymentStatus
               transactionRemark
            }
         }
      }
   }
`

export const SUBSCRIPTION = gql`
   query SUBSCRIPTION($keycloakId: String!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_customers(where: { keycloakId: { _eq: $keycloakId } }) {
            customer {
               subscriptionId
               ordered: subscriptionOccurences_aggregate(
                  where: { cart: { orderId: { _is_null: false } } }
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
      }
   }
`
export const SUBSCRIPTION_PLAN = gql`
   query SUBSCRIPTION_PLAN($keycloakId: String!, $brandId: Int!) {
      brand(id: $brandId) {
         brand_customers(where: { keycloakId: { _eq: $keycloakId } }) {
            customer {
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
      }
   }
`
export const OCCURENCES = gql`
   query OCCURENCES($sid: Int!, $keycloakId: String!, $brandId: Int!) {
      subscriptionOccurencesAggregate(
         where: {
            subscriptionId: { _eq: $sid }
            brand_subscriptionOccurences: { id: { _eq: $brandId } }
         }
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
               cart {
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
