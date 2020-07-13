import gql from 'graphql-tag'

export const REGISTER_PURCHASE_ORDER = gql`
   mutation RegisterPurchaseOrder {
      insert_organizationPurchaseOrders_purchaseOrder(objects: {}) {
         returning {
            id
            organizationId
         }
      }
   }
`

export const CREATE_PURCHASE_ORDER_ITEMS = gql`
   mutation CreatePurchaseOrderItems(
      $objects: [organizationPurchaseOrders_purchaseOrderItem_insert_input!]!
   ) {
      insert_organizationPurchaseOrders_purchaseOrderItem(objects: $objects) {
         returning {
            id
         }
      }
   }
`
