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
   mutation UpdateIngredient(
      $ingredientId: Int!
      $name: String!
      $image: String
   ) {
      updateIngredient(
         where: { id: { _eq: $ingredientId } }
         _set: { image: $image, name: $name }
      ) {
         returning {
            id
            image
            name
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
   mutation DeleteProcessing($ingredientId: Int!, $processingId: Int!) {
      deleteIngredientProcessing(
         where: {
            id: { _eq: $processingId }
            ingredientId: { _eq: $ingredientId }
         }
      ) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SACHET = gql`
   mutation CreateSachet(
      $sachet: [ingredient_ingredientSachet_insert_input!]!
   ) {
      createIngredientSachet(objects: $sachet) {
         returning {
            id
            tracking
            quantity
            unit
            modeOfFulfillments {
               id
               type
               isLive
               accuracy
               station {
                  name
               }
               sachetItem {
                  unitSize
               }
               bulkItem {
                  processingName
               }
               labelTemplate {
                  name
               }
               packaging {
                  name
               }
            }
         }
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
   mutation CreateRecipe($objects: [simpleRecipe_simpleRecipe_insert_input!]!) {
      createSimpleRecipe(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const UPDATE_RECIPE = gql`
   mutation UpdateRecipe($input: UpdateRecipeInput) {
      updateRecipe(input: $input) {
         success
         message
         recipe {
            id
            name
            chef
         }
      }
   }
`
