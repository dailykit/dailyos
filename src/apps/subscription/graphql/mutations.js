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
