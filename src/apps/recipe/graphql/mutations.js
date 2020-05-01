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
         }
      }
      #   createSachet(input: $input) {
      #      success
      #      message
      #      sachet {
      #         id
      #         quantity {
      #            value
      #            unit {
      #               id
      #               title
      #            }
      #         }
      #         tracking
      #         modes {
      #            isActive
      #            type
      #            station {
      #               id
      #               title
      #            }
      #            supplierItems {
      #               isDefault
      #               item {
      #                  id
      #                  title
      #               }
      #               accuracy
      #               packaging {
      #                  id
      #                  title
      #               }
      #               isLabelled
      #               labelTemplate {
      #                  id
      #                  title
      #               }
      #            }
      #         }
      #      }
      #   }
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

export const CREATE_RECIPE = gql`
   mutation CreateRecipe($name: String) {
      createRecipe(name: $name) {
         success
         message
         recipe {
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
