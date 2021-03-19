import gql from 'graphql-tag'

export const PICKUP_OPTIONS = gql`
   query pickup_options {
      pickup_options: subscription_subscriptionPickupOption {
         id
         time
         address
      }
   }
`

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
                  productOption: { product: { isArchived: { _eq: false } } }
               }
            ) {
               aggregate {
                  count
               }
            }
            addOnProducts: addOnProducts_aggregate(
               where: {
                  productOption: { product: { isArchived: { _eq: false } } }
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
                     productOption: { product: { isArchived: { _eq: false } } }
                  }
               ) {
                  aggregate {
                     count
                  }
               }
               addOnProducts: subscriptionAddOnProducts_aggregate(
                  where: {
                     productOption: { product: { isArchived: { _eq: false } } }
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
      productOptions: productOptionsAggregate(
         where: {
            type: $type
            simpleRecipeYieldId: { _is_null: false }
            product: { isArchived: { _eq: false }, isPublished: { _eq: true } }
         }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            price
            type
            label
            quantity
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
            product {
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
                     productOption: { product: { isArchived: { _eq: false } } }
                  }
               ) {
                  aggregate {
                     count
                  }
               }
               addOnProducts: addOnProducts_aggregate(
                  where: {
                     productOption: { product: { isArchived: { _eq: false } } }
                  }
               ) {
                  aggregate {
                     count
                  }
               }
               subscription {
                  id
                  products: subscriptionProducts_aggregate(
                     where: {
                        productOption: {
                           product: { isArchived: { _eq: false } }
                        }
                     }
                  ) {
                     aggregate {
                        count
                     }
                  }
                  addOnProducts: subscriptionAddOnProducts_aggregate(
                     where: {
                        productOption: {
                           product: { isArchived: { _eq: false } }
                        }
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
   query productOptions($type: String_comparison_exp!) {
      productOptions: productOptionsAggregate(
         where: {
            product: { isArchived: { _eq: false }, isPublished: { _eq: true } }
            type: $type
         }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            type
            label
            product {
               id
               name
            }
            quantity
         }
      }
   }
`

export const ADDON_PRODUCTS = gql`
   subscription addOnProducts(
      $where: subscription_subscriptionOccurence_addOn_bool_exp!
   ) {
      addOnProducts: subscription_subscriptionOccurence_addOn_aggregate(
         where: $where
         order_by: { created_at: desc }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            unitPrice
            isVisible
            isAvailable
            isSingleSelect
            productCategory
            productOptionId
            productOption {
               id
               type
               label
               productId
               product {
                  id
                  name
               }
            }
         }
      }
   }
`

export const PLAN_PRODUCTS = gql`
   subscription planProducts(
      $where: subscription_subscriptionOccurence_product_bool_exp!
   ) {
      planProducts: subscription_subscriptionOccurence_product_aggregate(
         where: $where
         order_by: { created_at: desc }
      ) {
         aggregate {
            count
         }
         nodes {
            id
            isVisible
            addOnPrice
            addOnLabel
            isAvailable
            isSingleSelect
            productCategory
            productOptionId
            productOption {
               id
               type
               label
               productId
               product {
                  id
                  name
               }
            }
         }
      }
   }
`
