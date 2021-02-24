import gql from 'graphql-tag'

export const OCCURRENCES_DATES = gql`
   subscription occurrences_dates {
      occurrences_dates: subscriptionOccurences(distinct_on: fulfillmentDate) {
         date: fulfillmentDate
      }
   }
`

export const SUBSCRIPTION_OCCURENCES = gql`
   subscription subscriptionOccurences($fulfillmentDate: date_comparison_exp!) {
      subscriptionOccurences: subscriptionOccurencesAggregate(
         where: { fulfillmentDate: $fulfillmentDate }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            isValid
            isVisible
            startTimeStamp
            fulfillmentDate
            cutoffTimeStamp
            products: products_aggregate(
               where: {
                  _or: [
                     { inventoryProduct: { isArchived: { _eq: false } } }
                     { simpleRecipeProduct: { isArchived: { _eq: false } } }
                  ]
               }
            ) {
               aggregate {
                  count
               }
            }
            subscription {
               id
               rrule
               products: subscriptionProducts_aggregate(
                  where: {
                     _or: [
                        { inventoryProduct: { isArchived: { _eq: false } } }
                        { simpleRecipeProduct: { isArchived: { _eq: false } } }
                     ]
                  }
               ) {
                  aggregate {
                     count
                  }
               }
               customers: customers_aggregate(
                  where: { isSubscriber: { _eq: true } }
               ) {
                  aggregate {
                     count
                  }
               }
               itemCount: subscriptionItemCount {
                  count
                  price
                  serving: subscriptionServing {
                     size: servingSize
                     subscriptionTitle {
                        title
                     }
                  }
               }
            }
         }
      }
   }
`

export const SIMPLE_RECIPE_PRODUCT_OPTIONS = gql`
   query productOptions($type: String_comparison_exp!) {
      productOptions: simpleRecipeProductOptionsAggregate(
         where: {
            type: $type
            simpleRecipeProduct: {
               isArchived: { _eq: false }
               isPublished: { _eq: true }
            }
         }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            isActive
            price
            type
            recipeYield: simpleRecipeYield {
               size: yield(path: "serving")
               recipe: simpleRecipe {
                  cuisine
                  cookingTime
                  author
                  assets
                  image
               }
            }
            recipeProduct: simpleRecipeProduct {
               id
               name
            }
         }
      }
   }
`

export const PRODUCT_CATEGORIES = gql`
   query productCategories {
      productCategories {
         id: name
         title: name
      }
   }
`

export const TITLES = gql`
   subscription subscriptions {
      titles: subscription_subscriptionTitle {
         id
         title
      }
   }
`

export const TITLE = gql`
   subscription subscription($id: Int!) {
      title: subscription_subscriptionTitle_by_pk(id: $id) {
         id
         title
         isValid
         isActive
         defaultSubscriptionServingId
         servings: subscriptionServings(order_by: { servingSize: asc }) {
            id
            isActive
            size: servingSize
         }
      }
   }
`

export const SERVING = gql`
   subscription serving($id: Int!) {
      serving: subscription_subscriptionServing_by_pk(id: $id) {
         id
         isValid
         isActive
         size: servingSize
         counts: subscriptionItemCounts(order_by: { count: asc }) {
            id
            count
            isActive
         }
      }
   }
`

export const ITEM_COUNT = gql`
   subscription itemCount($id: Int!) {
      itemCount: subscription_subscriptionItemCount_by_pk(id: $id) {
         id
         tax
         count
         price
         isValid
         isActive
         isTaxIncluded
         subscriptions(order_by: { id: desc }) {
            id
            rrule
         }
      }
   }
`

export const SUBSCRIPTION_OCCURENCES_LIST = gql`
   subscription subscription_occurences($id: Int!) {
      subscription_occurences: subscription_subscription_by_pk(id: $id) {
         id
         occurences_aggregate: subscriptionOccurences_aggregate {
            aggregate {
               count
            }
            nodes {
               id
               startTimeStamp
               fulfillmentDate
               cutoffTimeStamp
               products: products_aggregate(
                  where: {
                     _or: [
                        { inventoryProduct: { isArchived: { _eq: false } } }
                        { simpleRecipeProduct: { isArchived: { _eq: false } } }
                     ]
                  }
               ) {
                  aggregate {
                     count
                  }
               }
               subscription {
                  products: subscriptionProducts_aggregate(
                     where: {
                        _or: [
                           { inventoryProduct: { isArchived: { _eq: false } } }
                           {
                              simpleRecipeProduct: {
                                 isArchived: { _eq: false }
                              }
                           }
                        ]
                     }
                  ) {
                     aggregate {
                        count
                     }
                  }
               }
            }
         }
      }
   }
`

export const SUBSCRIPTION_ZIPCODES = gql`
   subscription subscription_zipcodes($id: Int!) {
      subscription_zipcodes: subscription_subscription_zipcode(
         where: { subscriptionId: { _eq: $id } }
         order_by: { zipcode: asc }
      ) {
         zipcode
         isActive
         deliveryTime
         deliveryPrice
         subscriptionId
         isDeliveryActive
         isPickupActive
         subscriptionPickupOptionId
         subscriptionPickupOption {
            id
            time
            address
         }
      }
   }
`

export const SUBSCRIPTION_CUSTOMERS = gql`
   query subscription_customers($id: Int!) {
      subscription_customers: subscription_subscription_by_pk(id: $id) {
         id
         customers: customers_aggregate {
            aggregate {
               count
            }
            nodes {
               id
               email
               customer: platform_customer {
                  lastName
                  firstName
                  phoneNumber
               }
            }
         }
      }
   }
`

export const SUBSCRIPTION = gql`
   subscription subscription($id: Int!) {
      subscription: subscription_subscription_by_pk(id: $id) {
         id
         endDate
         startDate
      }
   }
`

export const INVENTORY_PRODUCT_OPTIONS = gql`
   query inventoryProductOptions {
      inventoryProductOptions: inventoryProductOptionsAggregate(
         where: {
            inventoryProduct: {
               isArchived: { _eq: false }
               isPublished: { _eq: true }
            }
         }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            inventoryProduct {
               id
               name
            }
            quantity
         }
      }
   }
`
