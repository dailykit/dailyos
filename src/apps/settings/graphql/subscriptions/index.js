import gql from 'graphql-tag'

export const PROCESSINGS = gql`
   subscription Processings {
      masterProcessings {
         id
         name
         ingredientProcessings {
            id
         }
      }
   }
`

export const CUISINES = gql`
   subscription Cuisines {
      cuisineNames {
         id
         name
         simpleRecipes {
            id
         }
      }
   }
`

export const ACCOMPANIMENT_TYPES = gql`
   subscription AccompanimentTypes {
      master_accompanimentType {
         id
         name
      }
   }
`

export const ALLERGENS = gql`
   subscription Allergens {
      masterAllergens {
         id
         name
         description
      }
   }
`
