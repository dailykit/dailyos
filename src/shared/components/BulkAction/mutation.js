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
export const CONCATENATE_ARRAY_COLUMN = gql`
   query ConcatenateArrayColumn($concatData: concatenateArrayColumn_args!) {
      concatenateArrayColumn(args: $concatData) {
         message
         success
      }
   }
`
