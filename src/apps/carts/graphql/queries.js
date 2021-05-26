import gql from 'graphql-tag'

export const QUERIES = {
   CART: {
      ONE: gql`
         subscription cart($id: Int!) {
            cart(id: $id) {
               id
               customerId
               customerInfo
               paymentMethodId
               fulfillmentInfo
               customerKeycloakId
               billing: billingDetails
               subscriptionOccurenceId
               subscriptionOccurence {
                  id
                  fulfillmentDate
               }
               occurenceCustomer: subscriptionOccurenceCustomer {
                  itemCountValid: validStatus(path: "itemCountValid")
                  addedProductsCount: validStatus(path: "addedProductsCount")
                  pendingProductsCount: validStatus(
                     path: "pendingProductsCount"
                  )
               }
               brand {
                  id
                  title
                  domain
                  onDemandSettings(
                     where: {
                        onDemandSetting: {
                           identifier: {
                              _in: [
                                 "Location"
                                 "Pickup Availability"
                                 "Delivery Availability"
                              ]
                           }
                        }
                     }
                  ) {
                     onDemandSetting {
                        identifier
                        value
                     }
                  }
                  subscriptionStoreSettings(
                     where: {
                        subscriptionStoreSetting: {
                           identifier: {
                              _in: [
                                 "Location"
                                 "Pickup Availability"
                                 "Delivery Availability"
                              ]
                           }
                        }
                     }
                  ) {
                     subscriptionStoreSetting {
                        identifier
                        value
                     }
                  }
               }
               address
               fulfillmentInfo
               products: cartItems_aggregate(where: { level: { _eq: 1 } }) {
                  aggregate {
                     count
                  }
                  nodes {
                     id
                     addOnLabel
                     addOnPrice
                     name: displayName
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
               subscriptionId
               subscriptionAddressId
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
               defaultCartItem
            }
         }
      `,
   },
   CATEGORIES: {
      LIST: gql`
         query categories(
            $subscriptionId: Int_comparison_exp
            $subscriptionOccurenceId: Int_comparison_exp
         ) {
            categories: productCategories(
               where: {
                  subscriptionOccurenceProducts: {
                     _or: [
                        { subscriptionId: $subscriptionId }
                        { subscriptionOccurenceId: $subscriptionOccurenceId }
                     ]
                     isVisible: { _eq: true }
                  }
               }
            ) {
               name
               productsAggregate: subscriptionOccurenceProducts_aggregate(
                  where: {
                     _or: [
                        { subscriptionId: $subscriptionId }
                        { subscriptionOccurenceId: $subscriptionOccurenceId }
                     ]
                  }
               ) {
                  aggregate {
                     count
                  }
                  nodes {
                     id
                     cartItem
                     addOnLabel
                     addOnPrice
                     isAvailable
                     isSingleSelect
                     productOption {
                        id
                        label
                        simpleRecipeYield {
                           yield
                           simpleRecipe {
                              id
                              type
                           }
                        }
                        product {
                           name
                           assets
                           additionalText
                        }
                     }
                  }
               }
            }
         }
      `,
   },
   SUBSCRIPTION: {
      ZIPCODE: {
         LIST: gql`
            query zipcodes(
               $where: subscription_subscription_zipcode_bool_exp = {}
            ) {
               zipcodes: subscription_subscription_zipcode(where: $where) {
                  zipcode
                  deliveryTime
                  deliveryPrice
                  isPickupActive
                  isDeliveryActive
                  defaultAutoSelectFulfillmentMode
                  pickupOptionId: subscriptionPickupOptionId
                  pickupOption: subscriptionPickupOption {
                     id
                     time
                     address
                  }
               }
            }
         `,
      },
   },
   FULFILLMENT: {
      ONDEMAND: {
         PICKUP: gql`
            subscription OndemandPickup($brandId: Int!) {
               onDemandPickup: fulfillmentTypes(
                  where: {
                     isActive: { _eq: true }
                     value: { _eq: "ONDEMAND_PICKUP" }
                  }
               ) {
                  recurrences(
                     where: {
                        isActive: { _eq: true }
                        brands: {
                           _and: {
                              brandId: { _eq: $brandId }
                              isActive: { _eq: true }
                           }
                        }
                     }
                  ) {
                     id
                     type
                     rrule
                     timeSlots(where: { isActive: { _eq: true } }) {
                        id
                        to
                        from
                        pickUpPrepTime
                     }
                  }
               }
            }
         `,
         DELIVERY: gql`
            subscription OnDemandDelivery($distance: numeric!, $brandId: Int!) {
               onDemandDelivery: fulfillmentTypes(
                  where: {
                     isActive: { _eq: true }
                     value: { _eq: "ONDEMAND_DELIVERY" }
                  }
               ) {
                  recurrences(
                     where: {
                        isActive: { _eq: true }
                        brands: {
                           _and: {
                              brandId: { _eq: $brandId }
                              isActive: { _eq: true }
                           }
                        }
                     }
                  ) {
                     id
                     type
                     rrule
                     timeSlots(where: { isActive: { _eq: true } }) {
                        id
                        to
                        from
                        mileRanges(
                           where: {
                              isActive: { _eq: true }
                              from: { _lte: $distance }
                              to: { _gte: $distance }
                           }
                        ) {
                           id
                           to
                           from
                           isActive
                           prepTime
                           charges {
                              id
                              charge
                              orderValueFrom
                              orderValueUpto
                           }
                        }
                     }
                  }
               }
            }
         `,
      },
      PREORDER: {
         PICKUP: gql`
            subscription PreOrderPickup($brandId: Int!) {
               preOrderPickup: fulfillmentTypes(
                  where: {
                     isActive: { _eq: true }
                     value: { _eq: "PREORDER_PICKUP" }
                  }
               ) {
                  recurrences(
                     where: {
                        isActive: { _eq: true }
                        brands: {
                           _and: {
                              brandId: { _eq: $brandId }
                              isActive: { _eq: true }
                           }
                        }
                     }
                  ) {
                     id
                     type
                     rrule
                     timeSlots(where: { isActive: { _eq: true } }) {
                        id
                        to
                        from
                        pickUpLeadTime
                     }
                  }
               }
            }
         `,
         DELIVERY: gql`
            subscription PreOrderDelivery($distance: numeric!, $brandId: Int!) {
               preOrderDelivery: fulfillmentTypes(
                  where: {
                     isActive: { _eq: true }
                     value: { _eq: "PREORDER_DELIVERY" }
                  }
               ) {
                  recurrences(
                     where: {
                        isActive: { _eq: true }
                        brands: {
                           _and: {
                              brandId: { _eq: $brandId }
                              isActive: { _eq: true }
                           }
                        }
                     }
                  ) {
                     id
                     type
                     rrule
                     timeSlots(where: { isActive: { _eq: true } }) {
                        id
                        to
                        from
                        mileRanges(
                           where: {
                              isActive: { _eq: true }
                              from: { _lte: $distance }
                              to: { _gte: $distance }
                           }
                        ) {
                           id
                           to
                           from
                           isActive
                           leadTime
                           charges {
                              id
                              charge
                              orderValueFrom
                              orderValueUpto
                           }
                        }
                     }
                  }
               }
            }
         `,
      },
   },
}
