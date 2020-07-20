import gql from 'graphql-tag'

export const REGISTER_PURCHASE_ORDER = gql`
   mutation RegisterPurchaseOrder($amount: numeric!) {
      insert_organizationPurchaseOrders_purchaseOrder {
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

export const REMOVE_CART_ITEM = gql`
   mutation RemoveCartItem($id: Int!) {
      delete_organizationPurchaseOrders_purchaseOrderItem_by_pk(id: $id) {
         id
      }
   }
`

export const CHANGE_CART_ITEM_QUANTITY = gql`
   mutation ChangeCartItemQuantity($id: Int!, $quantity: Int!) {
      update_organizationPurchaseOrders_purchaseOrderItem(
         where: { id: { _eq: $id } }
         _inc: { quantity: $quantity }
      ) {
         affected_rows
      }
   }
`
