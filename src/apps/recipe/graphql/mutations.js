import gql from 'graphql-tag'

export const CREATE_INGREDIENT = gql`
   mutation CreateIngredient($name: String) {
      createIngredient(objects: { name: $name }) {
         returning {
            id
            name
         }
      }
   }
`

export const UPDATE_INGREDIENT = gql`
   mutation UpdateIngredient($id: Int!, $set: ingredient_ingredient_set_input) {
      updateIngredient(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_PROCESSINGS = gql`
   mutation CreateProcessings(
      $procs: [ingredient_ingredientProcessing_insert_input!]!
   ) {
      createIngredientProcessing(objects: $procs) {
         returning {
            id
            processingName
         }
      }
   }
`

export const DELETE_PROCESSING = gql`
   mutation DeleteProcessing($id: Int!) {
      deleteIngredientProcessing(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SACHET = gql`
   mutation CreateSachet(
      $objects: [ingredient_ingredientSachet_insert_input!]!
   ) {
      createIngredientSachet(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_SACHET = gql`
   mutation UpdateSachet(
      $id: Int!
      $set: ingredient_ingredientSachet_set_input
   ) {
      updateIngredientSachet(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_MODE = gql`
   mutation UpdateMode(
      $id: Int!
      $set: ingredient_modeOfFulfillment_set_input
   ) {
      updateModeOfFulfillment(pk_columns: { id: $id }, _set: $set) {
         id
      }
   }
`

export const DELETE_SACHET = gql`
   mutation DeleteSachet(
      $ingredientId: Int!
      $processingId: Int!
      $sachetId: Int!
   ) {
      deleteIngredientSachet(
         where: {
            id: { _eq: $sachetId }
            ingredientId: { _eq: $ingredientId }
            ingredientProcessingId: { _eq: $processingId }
         }
      ) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE = gql`
   mutation CreateRecipe($name: jsonb) {
      createSimpleRecipe(objects: { name: $name }) {
         returning {
            id
            name
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_YIELDS = gql`
   mutation CreateSimpleRecipeYields(
      $objects: [simpleRecipe_simpleRecipeYield_insert_input!]!
   ) {
      createSimpleRecipeYield(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_YIELD = gql`
   mutation DeleteSimpleRecipeYield($id: Int!) {
      deleteSimpleRecipeYield(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_YIELD_SACHET = gql`
   mutation CreateSimpleRecipeSachet(
      $objects: [simpleRecipe_simpleRecipeYield_ingredientSachet_insert_input!]!
   ) {
      createSimpleRecipeSachet(objects: $objects) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const UPDATE_SIMPLE_RECIPE_YIELD_SACHET = gql`
   mutation UpdateSimpleRecipeSachet(
      $sachetId: Int!
      $yieldId: Int!
      $set: simpleRecipe_simpleRecipeYield_ingredientSachet_set_input
   ) {
      updateSimpleRecipeSachet(
         where: {
            ingredientSachetId: { _eq: $sachetId }
            recipeYieldId: { _eq: $yieldId }
         }
         _set: $set
      ) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_YIELD_SACHETS = gql`
   mutation DeleteSimpleRecipeSachet(
      $sachetIds: [Int!]!
      $servingIds: [Int!]!
   ) {
      deleteSimpleRecipeSachet(
         where: {
            ingredientSachetId: { _in: $sachetIds }
            simpleRecipeYield: { id: { _in: $servingIds } }
         }
      ) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const UPDATE_RECIPE = gql`
   mutation UpdateSimpleRecipe(
      $id: Int!
      $set: simpleRecipe_simpleRecipe_set_input
   ) {
      updateSimpleRecipe(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`
