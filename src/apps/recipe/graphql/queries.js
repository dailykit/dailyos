import gql from 'graphql-tag'

export const INGREDIENTS = gql`
   {
      ingredients {
         id
         name
         createdAt
         ingredientProcessings {
            id
         }
      }
   }
`

export const CUISINES = gql`
   {
      cuisineNames {
         id
         name
      }
   }
`

// Issue: It should take ID, but is asking for Int
export const INGREDIENT = gql`
   query Ingredient($ID: Int!) {
      ingredient(id: $ID) {
         name
         image
         id
      }
   }
`

export const PROCESSINGS_OF_INGREDIENT = gql`
   query Ingredient($ingredientId: Int!) {
      ingredient(id: $ingredientId) {
         id
         ingredientProcessings {
            id
            processingName
         }
      }
   }
`

export const SACHETS_OF_PROCESSING = gql`
   query Processing($processingId: Int!, $ingredientId: Int!) {
      ingredientSachets(
         where: {
            ingredientId: { _eq: $ingredientId }
            ingredientProcessing: { id: { _eq: $processingId } }
         }
      ) {
         id
         quantity
         unit
         tracking
         defaultNutritionalValues
         liveMOF
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
`
//  Issue: Don't use name, but title
export const FETCH_PROCESSING_NAMES = gql`
   {
      masterProcessings {
         id
         name
      }
   }
`

export const FETCH_UNITS = gql`
   {
      units {
         id
         name
      }
   }
`

export const FETCH_STATIONS = gql`
   {
      stations {
         id
         name
      }
   }
`

export const FETCH_SACHET_ITEMS = gql`
   {
      sachetItems {
         id
         unitSize
      }
   }
`

export const FETCH_BULK_ITEMS = gql`
   {
      bulkItems {
         id
         processingName
      }
   }
`

export const FETCH_PACKAGINGS = gql`
   {
      packaging_packaging {
         id
         name
      }
   }
`

export const FETCH_LABEL_TEMPLATES = gql`
   {
      deviceHub_labelTemplate {
         id
         name
      }
   }
`

export const RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         author
         cookingTime
         simpleRecipeYields {
            id
         }
      }
   }
`

export const RECIPE = gql`
   query Recipe($id: Int!) {
      simpleRecipe(id: $id) {
         id
         name
         cookingTime
         type
         author
         description
         utensils
         cookingTime
         cuisine
      }
   }
`
