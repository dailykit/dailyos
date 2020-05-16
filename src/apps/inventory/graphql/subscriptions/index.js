import gql from 'graphql-tag'

export const SUPPLIER_ITEMS_SUBSCRIPTION = gql`
   subscription SupplierItems {
      supplierItems {
         id
         name
         supplier {
            name
            contactPerson
         }
      }
   }
`

export const BULK_WORK_ORDERS_SUBSCRIPTION = gql`
   subscription BulkWorkOrders {
      bulkWorkOrders {
         id
         status
         scheduledOn
         station {
            name
         }
         user {
            firstName
            lastName
         }
      }
   }
`

export const SACHET_WORK_ORDERS_SUBSCRIPTION = gql`
   subscription SachetWorkOrders {
      sachetWorkOrders {
         id
         status
         scheduledOn
         station {
            name
         }
         user {
            firstName
            lastName
         }
      }
   }
`

export const PURCHASE_ORDERS_SUBSCRIPTION = gql`
   subscription PurchaseOrderItems {
      purchaseOrderItems {
         id
         supplierItem {
            name
         }
         status
      }
   }
`
