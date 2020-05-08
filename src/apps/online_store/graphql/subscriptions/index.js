import gql from 'graphql-tag'

export const S_SIMPLE_RECIPE_PRODUCTS = gql`
   subscription SimpleRecipeProducts {
      simpleRecipeProducts {
         id
         name
         simpleRecipe {
            name
         }
      }
   }
`

export const S_SIMPLE_RECIPE_PRODUCT = gql`
   subscription SimpleRecipeProduct($id: Int!) {
      simpleRecipeProduct(id: $id) {
         id
         name
         accompaniments
         default
         tags
         description
         simpleRecipeProductOptions {
            id
            isActive
            price
            type
            simpleRecipeYield {
               id
               yield
            }
         }
      }
   }
`

export const S_INVENTORY_PRODUCTS = gql`
   {
      inventoryProducts {
         id
         name
      }
   }
`

export const S_INVENTORY_PRODUCT = gql`
   subscription($id: Int!) {
      inventoryProduct(id: $id) {
         id
         name
         accompaniments
         tags
         description
         supplierItem {
            id
            name
            unitSize
            unit
         }
         sachetItem {
            id
            unitSize
            unit
            bulkItem {
               processingName
               supplierItem {
                  name
               }
            }
         }
         inventoryProductOptions {
            id
            label
            price
            quantity
         }
      }
   }
`

export const S_SACHET_ITEMS = gql`
   subscription SachetItems {
      sachetItems {
         id
         unitSize
         unit
         bulkItem {
            processingName
            supplierItem {
               name
            }
         }
      }
   }
`

export const S_SUPPLIER_ITEMS = gql`
   subscription SupplierItems {
      supplierItems {
         id
         name
         unitSize
         unit
      }
   }
`

export const S_CUSTOMIZABLE_PRODUCTS = gql`
   {
      customizableProducts {
         id
         name
      }
   }
`

export const S_COMBO_PRODUCTS = gql`
   {
      comboProducts {
         id
         name
         comboProductComponents {
            id
            label
         }
      }
   }
`
