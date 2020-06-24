import gql from 'graphql-tag'

export const SACHET_ITEMS = gql`
   query SachetItems {
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

export const SUPPLIER_ITEMS = gql`
   query SupplierItems {
      supplierItems {
         id
         name
         unitSize
         unit
      }
   }
`

export const INVENTORY_PRODUCTS = gql`
   query InventoryProducts($where: onlineStore_inventoryProduct_bool_exp) {
      inventoryProducts(where: $where) {
         id
         name
         title: name
         isValid
         isPublished
      }
   }
`

export const SIMPLE_RECIPE_PRODUCTS = gql`
   query SimpleRecipeProducts(
      $where: onlineStore_simpleRecipeProduct_bool_exp
   ) {
      simpleRecipeProducts(where: $where) {
         id
         name
         title: name
         isValid
         isPublished
         simpleRecipe {
            id
            name
         }
      }
   }
`

export const SIMPLE_RECIPES = gql`
   query SimpleRecipes($where: simpleRecipe_simpleRecipe_bool_exp) {
      simpleRecipes(where: $where) {
         id
         name
         title: name
         isValid
         simpleRecipeYields {
            id
            yield
         }
      }
   }
`
