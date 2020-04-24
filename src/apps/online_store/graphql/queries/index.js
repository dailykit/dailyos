import gql from 'graphql-tag'

export const RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         simpleRecipeYields {
            id
            yield
            mealKit
            readyToEat
         }
      }
   }
`

export const PRODUCTS = gql`
   {
      simpleRecipeProducts {
         id
         name
      }
   }
`
export const ACCOMPANIMENT_TYPES = gql`
   {
      accompanimentTypes {
         title
         id
      }
   }
`

export const COLLECTIONS = gql`
   {
      menucollections {
         id
         title
         categories {
            title
         }
      }
   }
`
