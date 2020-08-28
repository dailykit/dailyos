import gql from 'graphql-tag'

export const RECIPE_SALE_COUNT = gql`
   subscription RecipeSaleCount {
      TotalRecipeSales: simple_recipe_sale_meal_kit {
         data: count
         label: recipe {
            id
            name
         }
      }
   }
`
