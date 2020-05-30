import gql from 'graphql-tag'

export const CREATE_SUPPLIER_ITEM = gql`
   mutation CreateSupplierItem(
      $name: String!
      $supplierId: Int!
      $unit: String!
      $unitSize: Int!
      $leadTime: jsonb!
      $prices: jsonb!
      $sku: String!
   ) {
      createSupplierItem(
         objects: {
            name: $name
            supplierId: $supplierId
            unit: $unit
            unitSize: $unitSize
            leadTime: $leadTime
            prices: $prices
            sku: $sku
         }
      ) {
         returning {
            id
         }
      }
   }
`

export const ADD_BULK_ITEM = gql`
   mutation UpdateSupplierItem($bulkItemAsShippedId: Int!, $itemId: Int!) {
      updateSupplierItem(
         where: { id: { _eq: $itemId } }
         _set: { bulkItemAsShippedId: $bulkItemAsShippedId }
      ) {
         returning {
            id
         }
      }
   }
`

export const CREATE_BULK_ITEM = gql`
   mutation CreateBulkItem(
      $processingName: String!
      $itemId: Int!
      $unit: String!
      $yield: jsonb
      $shelfLife: jsonb
      $parLevel: numeric
      $nutritionInfo: jsonb
      $maxLevel: numeric
      $labor: jsonb
      $bulkDensity: numeric
      $allergens: jsonb
   ) {
      createBulkItem(
         objects: {
            processingName: $processingName
            supplierItemId: $itemId
            unit: $unit
            yield: $yield
            shelfLife: $shelfLife
            parLevel: $parLevel
            nutritionInfo: $nutritionInfo
            maxLevel: $maxLevel
            labor: $labor
            bulkDensity: $bulkDensity
            allergens: $allergens
         }
      ) {
         returning {
            id
            processing {
               id
               name
            }
         }
      }
   }
`
export const CREATE_SACHET_ITEM = gql`
   mutation CreateSachetItem(
      $unitSize: numeric!
      $bulkItemId: Int!
      $unit: String!
      $par: numeric!
      $maxLevel: numeric!
   ) {
      createSachetItem(
         objects: {
            unitSize: $unitSize
            bulkItemId: $bulkItemId
            unit: $unit
            maxLevel: $maxLevel
            parLevel: $par
         }
      ) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_BULK_ITEM_AVAILABILITY = gql`
   mutation UpdateBulkItem($id: Int!, $availability: Boolean!) {
      updateBulkItem(
         where: { id: { _eq: $id } }
         _set: { isAvailable: $availability }
      ) {
         affected_rows
      }
   }
`

export const UPDATE_SUPPLIER_ITEM = gql`
   mutation UpdateSupplierItem(
      $id: Int!
      $object: inventory_supplierItem_set_input!
   ) {
      updateSupplierItem(where: { id: { _eq: $id } }, _set: $object) {
         affected_rows
      }
   }
`
