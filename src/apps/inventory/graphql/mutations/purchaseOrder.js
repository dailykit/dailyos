import gql from 'graphql-tag'

export const CREATE_PURCHASE_ORDER = gql`
   mutation CreatePurchaseOrderItem(
      $object: inventory_purchaseOrderItem_insert_input!
   ) {
      createPurchaseOrderItem(objects: [$object]) {
         returning {
            id
            status
         }
      }
   }
`
