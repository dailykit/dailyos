import gql from 'graphql-tag'

export const S_SIMPLE_RECIPE_PRODUCTS = gql`
   subscription SimpleRecipeProducts {
      simpleRecipeProducts {
         id
         name
         simpleRecipe {
            name
         }
      }
   }
`

export const S_INVENTORY_PRODUCTS = gql`
   {
      inventoryProducts {
         id
         name
      }
   }
`

export const S_CUSTOMIZABLE_PRODUCTS = gql`
   {
      customizableProducts {
         id
         name
      }
   }
`

export const S_COMBO_PRODUCTS = gql`
   {
      comboProducts {
         id
         name
         comboProductComponents {
            id
            label
         }
      }
   }
`
