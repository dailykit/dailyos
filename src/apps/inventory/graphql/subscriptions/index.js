import gql from 'graphql-tag'

export const SUPPLIER_ITEMS_SUBSCRIPTION = gql`
   subscription SupplierItems {
      supplierItems {
         id
         name
         bulkItemAsShippedId
         supplier {
            name
            contactPerson
         }
         bulkItems {
            id
            processingName
            awaiting
            onHand
            committed
            parLevel
            maxLevel
            isAvailable
            unit
         }
      }
   }
`

export const SUPPLIER_ITEM_SUBSCRIPTION = gql`
   subscription SupplierItem($id: Int!) {
      supplierItem(id: $id) {
         id
         name
         bulkItemAsShippedId
         unit
         unitSize
         prices
         sku

         leadTime
         supplier {
            name
            contactPerson
         }
         bulkItems {
            id
            processingName
            awaiting
            onHand
            committed
            parLevel
            maxLevel
            isAvailable
            shelfLife
            unit
            consumed

            sachetItems {
               id
               onHand
               awaiting
               consumed
               unit
               unitSize
               parLevel
               committed
            }
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

export const SUPPLIER_SUBSCRIPTION = gql`
   subscription Supplier($id: Int!) {
      supplier(id: $id) {
         id
         name
         contactPerson
         available
         address
         paymentTerms
         shippingTerms
      }
   }
`

export const SUPPLIERS_SUBSCRIPTION = gql`
   subscription Suppliers {
      suppliers(where: { available: { _eq: true } }) {
         id
         name
         contactPerson
         available
      }
   }
`

export const PACKAGING_SUBSCRIPTION = gql`
   subscription Packaging($id: Int!) {
      packaging(id: $id) {
         id
         name
         unitPrice
         dimensions
         sku
         parLevel
         maxLevel
         awaiting
         onHand
         consumed
         innWaterRes
         heatSafe
         outWaterRes
         recyclable
         compostable
         fdaComp
         type
         packagingType
         sealingType
         innGreaseRes
         outGreaseRes
         leakResistance
         compressableFrom
         packOpacity
         committed
         unitQuantity
         caseQuantity
         unitPrice
         minOrderValue
         leadTime
         supplier {
            id
            name
            contactPerson
         }
      }
   }
`

export const PACKAGINGS_SUBSCRIPTION = gql`
   subscription Packagings {
      packagings {
         id
         name
         unitPrice
         dimensions
         sku
         parLevel
         maxLevel
         unitQuantity
         caseQuantity
         unitPrice
         isAvailable
         minOrderValue
         awaiting
         onHand
         committed
         leadTime
         type
         supplier {
            id
            name
            contactPerson
         }
      }
   }
`

export const ALL_AVAILABLE_SUPPLIERS_COUNT_SUBSCRIPTION = gql`
   subscription Suppliers {
      suppliersAggregate(where: { available: { _eq: true } }) {
         aggregate {
            count
         }
      }
   }
`

export const SUPPLIERS_COUNT_SUBSCRIPTION = gql`
   subscription Suppliers {
      suppliersAggregate {
         aggregate {
            count
         }
      }
   }
`
export const SUPPLIER_ITEMS_COUNT_SUBSCRIPTION = gql`
   subscription SupplierItems {
      supplierItemsAggregate {
         aggregate {
            count
         }
      }
   }
`
export const BULK_WORK_ORDERS_COUNT_SUBSCRIPTION = gql`
   subscription BulkWorkOrders {
      bulkWorkOrdersAggregate {
         aggregate {
            count
         }
      }
   }
`
export const SACHET_WORK_ORDERS_COUNT_SUBSCRIPTION = gql`
   subscription SachetWorkOrders {
      sachetWorkOrdersAggregate {
         aggregate {
            count
         }
      }
   }
`

export const PURCHASE_ORDERS_COUNT_SUBSCRIPTION = gql`
   subscription PurchaseOrders {
      purchaseOrderItemsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const PACKAGINGS_COUNT_SUBSCRIPTION = gql`
   subscription Packagings {
      packagingAggregate {
         aggregate {
            count
         }
      }
   }
`
export const UNITS_SUBSCRIPTION = gql`
   subscription Units {
      units {
         id
         name
      }
   }
`

export const MASTER_PROCESSINGS_SUBSCRIPTION = gql`
   subscription {
      masterProcessings {
         id
         name
         description
      }
   }
`
export const MASTER_ALLERGENS_SUBSCRIPTION = gql`
   subscription {
      masterAllergens {
         id
         name
         description
      }
   }
`

export const SETTINGS_USERS_SUBSCRIPTION = gql`
   subscription {
      settings_user {
         lastName
         firstName
         id
      }
   }
`

export const STATIONS_SUBSCRIPTION = gql`
   subscription {
      stations {
         id
         name
         bulkWorkOrders {
            id
         }
      }
   }
`

export const SACHET_ITEMS_SUBSCRIPTION = gql`
   subscription SachetItems($bulkItemId: Int!) {
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

export const BULK_WORK_ORDER_SUBSCRIPTION = gql`
   subscription BulkWorkOrder($id: Int!) {
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

export const SACHET_WORK_ORDER_SUBSCRIPTION = gql`
   subscription SachetWorkOrder($id: Int!) {
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

export const PURCHASE_ORDER_SUBSCRIPTION = gql`
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
