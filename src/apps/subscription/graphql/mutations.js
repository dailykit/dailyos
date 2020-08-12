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
      insert_subscription_subscriptionTitle_one(
         object: $object
         on_conflict: {
            update_columns: [title]
            constraint: subscriptionTitle_pkey
         }
      ) {
         id
         title
      }
   }
`
