import gql from 'graphql-tag'

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
