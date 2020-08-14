import gql from 'graphql-tag'

export const INSERT_OCCURENCE_PRODUCTS = gql`
   mutation insertOccurenceProducts(
      $objects: [subscription_subscriptionOccurence_product_insert_input!]!
   ) {
      insertOccurenceProducts: insert_subscription_subscriptionOccurence_product(
         objects: $objects
      ) {
         affected_rows
      }
   }
`

export const UPSERT_SUBSCRIPTION_TITLE = gql`
   mutation upsertSubscriptionTitle(
      $object: subscription_subscriptionTitle_insert_input!
   ) {
      upsertSubscriptionTitle: insert_subscription_subscriptionTitle_one(
         object: $object
         on_conflict: {
            constraint: subscriptionTitle_pkey
            update_columns: [title, defaultSubscriptionServingId]
         }
      ) {
         id
         title
      }
   }
`

export const UPSERT_SUBSCRIPTION_SERVING = gql`
   mutation upsertSubscriptionServing(
      $object: subscription_subscriptionServing_insert_input!
   ) {
      upsertSubscriptionServing: insert_subscription_subscriptionServing_one(
         object: $object
         on_conflict: {
            update_columns: [servingSize]
            constraint: subscriptionServing_pkey
         }
      ) {
         id
         size: servingSize
      }
   }
`

export const UPSERT_ITEM_COUNT = gql`
   mutation upsertItemCount(
      $object: subscription_subscriptionItemCount_insert_input!
   ) {
      upsertItemCount: insert_subscription_subscriptionItemCount_one(
         object: $object
         on_conflict: {
            constraint: subscriptionItemCount_pkey
            update_columns: [count, price]
         }
      ) {
         id
         count
         price
      }
   }
`

export const INSERT_SUBSCRIPTION = gql`
   mutation insertSubscription(
      $objects: [subscription_subscription_insert_input!]!
   ) {
      insertSubscription: insert_subscription_subscription(objects: $objects) {
         affected_rows
      }
   }
`

export const INSERT_SUBSCRIPTION_ZIPCODES = gql`
   mutation insertSubscriptionZipcodes(
      $objects: [subscription_subscription_zipcode_insert_input!]!
   ) {
      insertSubscriptionZipcodes: insert_subscription_subscription_zipcode(
         objects: $objects
      ) {
         affected_rows
      }
   }
`
