import gql from 'graphql-tag'

export const UPDATE_ORDER = gql`
   mutation updateOrder(
      $id: oid!
      $_set: order_order_set_input
      $_append: order_order_append_input
   ) {
      updateOrder(pk_columns: { id: $id }, _set: $_set, _append: $_append) {
         id
      }
   }
`

export const UPDATE_ORDER_SACHET = gql`
   mutation updateOrderSachet($id: Int!, $_set: order_orderSachet_set_input!) {
      updateOrderSachet(pk_columns: { id: $id }, _set: $_set) {
         id
      }
   }
`

export const UPDATE_ORDER_STATUS = gql`
   mutation updateOrder($id: oid!, $orderStatus: String!) {
      updateOrder(
         pk_columns: { id: $id }
         _set: { orderStatus: $orderStatus }
      ) {
         id
      }
   }
`

export const UPDATE_INVENTORY_PRODUCT = gql`
   mutation updateOrderInventoryProduct($id: Int!, $assemblyStatus: String!) {
      updateOrderInventoryProduct(
         pk_columns: { id: $id }
         _set: { assemblyStatus: $assemblyStatus }
      ) {
         id
         assemblyStatus
      }
   }
`

export const UPDATE_READYTOEAT = gql`
   mutation updateOrderReadyToEatProduct($id: Int!, $assemblyStatus: String!) {
      updateOrderReadyToEatProduct(
         pk_columns: { id: $id }
         _set: { assemblyStatus: $assemblyStatus }
      ) {
         id
         assemblyStatus
      }
   }
`
