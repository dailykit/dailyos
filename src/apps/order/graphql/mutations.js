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

export const UPSERT_SETTING = gql`
   mutation upsertSetting($object: settings_appSettings_insert_input!) {
      upsertSetting: insert_settings_appSettings_one(
         object: $object
         on_conflict: {
            constraint: appSettings_pkey
            update_columns: [value, app, type, identifier]
         }
      ) {
         id
      }
   }
`

export const CREATE_PRINT_JOB = gql`
   mutation createPrintJob(
      $url: String!
      $title: String!
      $printerId: Int!
      $source: String!
      $contentType: String!
   ) {
      createPrintJob(
         url: $url
         title: $title
         source: $source
         printerId: $printerId
         contentType: $contentType
      ) {
         success
         message
      }
   }
`
