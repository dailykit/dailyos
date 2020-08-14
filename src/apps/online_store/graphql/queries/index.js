import gql from 'graphql-tag'

export const BULK_ITEMS = gql`
   query BulkItems {
      bulkItems {
         id
         unit
         processingName
         supplierItem {
            name
         }
      }
   }
`

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
         title: name
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
         assets
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
         assets
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

export const CUSTOMIZABLE_PRODUCTS = gql`
   query CustomizableProducts(
      $where: onlineStore_customizableProduct_bool_exp
   ) {
      customizableProducts(where: $where) {
         id
         name
         title: name
         isValid
      }
   }
`

export const COMBO_PRODUCTS = gql`
   query ComboProducts($where: onlineStore_comboProduct_bool_exp) {
      comboProducts(where: $where) {
         id
         name
         title: name
         isValid
      }
   }
`

export const INVENTORY_PRODUCT_OPTIONS = gql`
   query InventoryProductOptions(
      $where: onlineStore_inventoryProductOption_bool_exp
   ) {
      inventoryProductOptions(where: $where) {
         id
         label
         price
         inventoryProduct {
            name
            assets
            id
         }
      }
   }
`

export const SIMPLE_RECIPE_PRODUCT_OPTIONS = gql`
   query SimpleRecipeProductOptions(
      $where: onlineStore_simpleRecipeProductOption_bool_exp
   ) {
      simpleRecipeProductOptions(where: $where) {
         id
         price
         simpleRecipeYield {
            id
            yield
         }
         type
         simpleRecipeProduct {
            id
            name
            assets
         }
      }
   }
`
