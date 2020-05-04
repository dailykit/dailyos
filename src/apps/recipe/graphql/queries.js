import gql from 'graphql-tag'

export const INGREDIENTS = gql`
   {
      ingredients {
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
      labelTemplates {
         id
         title
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
   query Recipe($ID: ID!) {
      recipe(id: $ID) {
         id
         name
         cookingTime
         type
         chef
         description
         utensils
         cookingTime
         servings {
            size
            sachets {
               id
               ingredient {
                  id
               }
               quantity {
                  value
                  unit {
                     title
                  }
               }
            }
         }
         ingredients {
            ingredient {
               id
               name
            }
            processing {
               id
               name {
                  title
               }
            }
         }
         procedures {
            name
            steps {
               title
               description
            }
         }
      }
   }
`
