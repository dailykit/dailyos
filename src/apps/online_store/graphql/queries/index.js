import gql from 'graphql-tag'

export const RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         simpleRecipeYields {
            id
            yield
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

export const SIMPLE_RECIPE_PRODUCTS = gql`
   {
      simpleRecipeProducts {
         id
         name
         simpleRecipeProductOptions {
            type
            isActive
            price
            simpleRecipeYield {
               id
               yield
            }
         }
      }
   }
`

export const INVENTORY_PRODUCTS = gql`
   {
      inventoryProducts {
         id
         name
         inventoryProductOptions {
            id
            label
            price
            quantity
         }
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
