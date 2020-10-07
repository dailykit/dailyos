import gql from 'graphql-tag'

export const CUISINES = gql`
   query Cuisines {
      cuisineNames {
         id
         name
      }
   }
`

export const INGREDIENTS = gql`
   query Ingredients($where: ingredient_ingredient_bool_exp) {
      ingredients(where: $where) {
         id
         title: name
         name
         isValid
      }
   }
`

// TODO: add isValid on processing
export const PROCESSINGS = gql`
   query Processings($where: ingredient_ingredientProcessing_bool_exp) {
      ingredientProcessings(where: $where) {
         id
         title: processingName
         processingName
      }
   }
`

export const SACHETS = gql`
   query Sachets($where: ingredient_ingredientSachet_bool_exp) {
      ingredientSachets(where: $where) {
         id
         isValid
         quantity
         unit
         ingredient {
            id
            name
         }
      }
   }
`

export const SACHET_ITEMS = gql`
   query {
      sachetItems {
         id
         unitSize
         unit
         bulkItem {
            id
            processingName
            supplierItem {
               id
               name
               prices
            }
         }
      }
   }
`

export const BULK_ITEMS = gql`
   query BulkItems {
      bulkItems {
         id
         unit
         processingName
         supplierItem {
            id
            name
            prices
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
         prices
      }
   }
`

export const INVENTORY_PRODUCTS = gql`
   query InventoryProducts($where: products_inventoryProduct_bool_exp) {
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
   query SimpleRecipeProducts($where: products_simpleRecipeProduct_bool_exp) {
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
   query CustomizableProducts($where: products_customizableProduct_bool_exp) {
      customizableProducts(where: $where) {
         id
         name
         title: name
         isValid
      }
   }
`

export const COMBO_PRODUCTS = gql`
   query ComboProducts($where: products_comboProduct_bool_exp) {
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
      $where: products_inventoryProductOption_bool_exp
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
      $where: products_simpleRecipeProductOption_bool_exp
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
