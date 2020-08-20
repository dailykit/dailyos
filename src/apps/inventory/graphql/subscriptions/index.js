import gql from 'graphql-tag'

export const SUPPLIER_ITEMS_SUBSCRIPTION = gql`
   subscription SupplierItems {
      supplierItems {
         id
         name
         bulkItemAsShippedId
         supplier {
            id
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
            bulkDensity
            yield
            shelfLife
            isAvailable
            labor
            unit
         }
      }
   }
`

export const PURCHASE_ORDERS_PACKAGING_SUBSCRIPTION = gql`
   subscription Packagings {
      packagings {
         id
         name

         supplier {
            id
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
         bulkItemAsShipped {
            id
            name: processingName
            awaiting
            onHand
            committed
            parLevel
            maxLevel
            isAvailable
            shelfLife
            unit
            yield
            consumed
            image
            labor
            bulkDensity

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
         unit
         unitSize
         prices
         sku

         leadTime
         supplier {
            id
            name
            contactPerson
         }
         bulkItems {
            id
            name: processingName
            awaiting
            onHand
            committed
            parLevel
            maxLevel
            isAvailable
            shelfLife
            unit
            image
            labor
            yield
            consumed
            bulkDensity

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
         name
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
         packaging {
            packagingName: name
         }
      }
   }
`

export const SUPPLIER_SUBSCRIPTION = gql`
   subscription Supplier($id: Int!) {
      supplier(id: $id) {
         id
         name
         logo
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
export const ALL_SUPPLIERS_SUBSCRIPTION = gql`
   subscription AllSuppliers {
      suppliers {
         id
         name
         available
         contactPerson
      }
   }
`

export const PACKAGING_SUBSCRIPTION = gql`
   subscription Packaging($id: Int!) {
      packaging(id: $id) {
         id
         packagingName: name
         packagingSku

         images: assets(path: "images")

         supplier {
            name
            contactPerson
         }

         leadTime
         minOrderValue
         unitPrice
         caseQuantity
         unitQuantity

         length
         width
         height
         LWHUnit

         parLevel
         maxLevel
         onHand
         awaiting
         committed
         consumed
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

export const PACKAGINGS_LIST_SUBSCRIPTION = gql`
   subscription Packagings {
      packagings {
         id
         name
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
   subscription MasterProcessings($supplierItemId: Int!) {
      masterProcessingsAggregate(
         where: {
            _not: { bulkItems: { supplierItemId: { _eq: $supplierItemId } } }
         }
      ) {
         nodes {
            id
            title: name
            description
         }
      }
   }
`
export const MASTER_ALLERGENS_SUBSCRIPTION = gql`
   subscription {
      masterAllergens {
         id
         title: name
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
         id
         status
         station {
            name
            id
         }
         user {
            id
            lastName
            firstName
         }
         scheduledOn
         outputYield
         outputBulkItem {
            id
            yield
            processingName
            onHand
            shelfLife
         }
         supplierItem {
            id
            name
         }
         outputQuantity
         inputBulkItem {
            id
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
            unit
         }
         status
         orderQuantity
         unit
      }
   }
`

export const PACKAGING_PURCHASE_ORDER_SUBSCRIPTION = gql`
   subscription PurchaseOrderItem($id: Int!) {
      purchaseOrderItem(id: $id) {
         id
         packaging {
            id
            packagingName: name
            onHand
         }
         status
         orderQuantity
         unit
      }
   }
`

export const PACKAGINGS_LISTINGS_SUBSCRIPTION = gql`
   subscription PackagingsListings {
      packagings {
         id
         packagingName: name
         supplier {
            name
         }

         type

         parLevel
         onHand
         maxLevel
         awaiting
         committed
      }
   }
`

export const PACKAGING_SPECS_SUBSCRIPTION = gql`
   subscription Packaging($id: Int!) {
      packaging(id: $id) {
         id
         packagingSpecification {
            id
            fdaCompliant
            innerWaterResistant
            outerWaterResistant
            innerGreaseResistant
            outerGreaseResistant
            compostable
            recyclable
            microwaveable
            recycled
            opacity
            compressibility
            packagingMaterial
         }
      }
   }
`

export const GET_BULK_ITEMS_SUBSCRIPTION = gql`
   subscription GetBulkItems($supplierItemId: Int!) {
      bulkItems(where: { supplierItemId: { _eq: $supplierItemId } }) {
         id
         processingName
         shelfLife
         onHand
         unit
      }
   }
`
