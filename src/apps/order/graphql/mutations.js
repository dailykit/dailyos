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
   mutation updateOrderInventoryProduct(
      $id: Int!
      $_set: order_orderInventoryProduct_set_input!
   ) {
      updateOrderInventoryProduct(pk_columns: { id: $id }, _set: $_set) {
         id
         assemblyStatus
      }
   }
`

export const UPDATE_READYTOEAT = gql`
   mutation updateOrderReadyToEatProduct(
      $id: Int!
      $_set: order_orderReadyToEatProduct_set_input!
   ) {
      updateOrderReadyToEatProduct(pk_columns: { id: $id }, _set: $_set) {
         id
         isAssembled
         assemblyStatus
      }
   }
`

export const UPDATE_SETTING = gql`
   mutation update_settings_appSettings(
      $app: String_comparison_exp!
      $identifier: String_comparison_exp!
      $type: String_comparison_exp!
      $_set: settings_appSettings_set_input!
   ) {
      update_settings_appSettings(
         where: { app: $app, identifier: $identifier, type: $type }
         _set: $_set
      ) {
         affected_rows
         returning {
            value
         }
      }
   }
`
