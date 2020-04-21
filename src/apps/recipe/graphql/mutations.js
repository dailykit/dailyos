import { gql } from 'apollo-boost'

export const CREATE_INGREDIENT = gql`
   mutation CreateIngredient($name: String) {
      createIngredient(name: $name) {
         success
         message
         ingredient {
            id
            name
         }
      }
   }
`

export const UPDATE_INGREDIENT = gql`
   mutation UpdateIngredient(
      $ingredientId: ID!
      $name: String!
      $image: String
   ) {
      updateIngredient(
         input: { id: $ingredientId, name: $name, image: $image }
      ) {
         success
         message
         ingredient {
            id
            name
            image
         }
      }
   }
`

export const CREATE_PROCESSINGS = gql`
   mutation CreateProcessings($ingredientId: ID!, $processingNames: [ID!]!) {
      createProcessings(
         input: {
            ingredientId: $ingredientId
            processingNames: $processingNames
         }
      ) {
         id
         sachets {
            id
         }
         name {
            title
         }
         recipes {
            id
         }
      }
   }
`

export const DELETE_PROCESSING = gql`
   mutation DeleteProcessing($input: DeleteProcessingInput) {
      deleteProcessing(input: $input) {
         success
         message
         processing {
            id
         }
      }
   }
`

export const CREATE_SACHET = gql`
   mutation CreateSachet($input: CreateSachetInput!) {
      createSachet(input: $input) {
         success
         message
         sachet {
            id
            quantity {
               value
               unit {
                  id
                  title
               }
            }
            tracking
            modes {
               isActive
               type
               station {
                  id
                  title
               }
               supplierItems {
                  isDefault
                  item {
                     id
                     title
                  }
                  accuracy
                  packaging {
                     id
                     title
                  }
                  isLabelled
                  labelTemplate {
                     id
                     title
                  }
               }
            }
         }
      }
   }
`

export const DELETE_SACHET = gql`
   mutation DeleteSachet($input: DeleteSachetInput!) {
      deleteSachet(input: $input) {
         success
         message
         sachet {
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
