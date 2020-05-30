import gql from 'graphql-tag'

export const SUPPLIER_ITEMS = gql`
   query {
      supplierItems {
         id
         name
         bulkItemAsShippedId
         supplier {
            id
         }
         bulkItems {
            id
            processingName
            onHand
            shelfLife
            yield
            unit
         }
      }
   }
`

export const SETTINGS_USERS = gql`
   query {
      settings_user {
         lastName
         firstName
         id
      }
   }
`

export const STATIONS = gql`
   query {
      stations {
         id
         name
         bulkWorkOrders {
            id
         }
      }
   }
`

export const SACHET_ITEMS = gql`
   query SachetItems($bulkItemId: Int!) {
      sachetItems(where: { bulkItemId: { _eq: $bulkItemId } }) {
         id
         parLevel
         unitSize
         unit
         onHand
         committed
         consumed
      }
   }
`

export const PACKAGINGS = gql`
   query {
      packagings {
         id
         name
      }
   }
`

export const BULK_WORK_ORDER = gql`
   query BuulkWorkOrder($id: Int!) {
      bulkWorkOrder(id: $id) {
         status
         station {
            name
            id
         }
         user {
            lastName
            firstName
         }
         scheduledOn
         outputBulkItem {
            yield
            processingName
            onHand
            shelfLife
            supplierItem {
               name
            }
         }
         outputQuantity
         inputBulkItem {
            processingName
            onHand
            shelfLife
         }
      }
   }
`

export const SACHET_WORK_ORDER = gql`
   query SachetWorkOrder($id: Int!) {
      sachetWorkOrder(id: $id) {
         status
         station {
            name
            id
         }
         user {
            lastName
            firstName
         }
         scheduledOn
         outputSachetItem {
            id
            onHand
            parLevel
            unitSize
            unit
         }

         bulkItem {
            id
            processingName
            onHand
            shelfLife
            supplierItem {
               name
            }
         }
      }
   }
`

export const PURCHASE_ORDERS = gql`
   subscription PurchaseOrderItem($id: Int!) {
      purchaseOrderItem(id: $id) {
         id
         supplierItem {
            id
            name
         }
         status
         orderQuantity
         unit
      }
   }
`
