import gql from 'graphql-tag'

export const SIMPLE_RECIPE_UPDATE = gql`
   mutation UpdateSimpleRecipe(
      $ids: [Int!]
      $_set: simpleRecipe_simpleRecipe_set_input
   ) {
      updateSimpleRecipe(where: { id: { _in: $ids } }, _set: $_set) {
         affected_rows
      }
   }
`
export const UPDATE_PRODUCTS = gql`
   mutation UpdateProducts($ids: [Int!], $_set: products_product_set_input) {
      updateProducts(where: { id: { _in: $ids } }, _set: $_set) {
         affected_rows
      }
   }
`
export const UPDATE_INGREDIENTS = gql`
   mutation UpdateIngredients(
      $ids: [Int!]
      $_set: ingredient_ingredient_set_input
   ) {
      updateIngredient(where: { id: { _in: $ids } }, _set: $_set) {
         affected_rows
      }
   }
`
