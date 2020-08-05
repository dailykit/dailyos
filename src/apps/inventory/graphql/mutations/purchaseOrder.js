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

export const UPDATE_PURCHASE_ORDER = gql`
   mutation UpdatePurchaseOrderItem($id: Int!, $status: String!) {
      updatePurchaseOrderItem(
         where: { id: { _eq: $id } }
         _set: { status: $status }
      ) {
         returning {
            id
            status
         }
      }
   }
`
