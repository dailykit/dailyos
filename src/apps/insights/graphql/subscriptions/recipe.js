import gql from 'graphql-tag'

export const RECIPE_SALE_COUNT = gql`
   query RecipeSaleCount {
      RecipeSalesInMealKits: insights_simple_recipe_sale_meal_kit {
         data: count
         label: recipe {
            id
            name
         }
      }
      RecipeSalesInReadyToEats: insights_simple_recipe_sale_ready_to_eat {
         data: count
         label: recipe {
            id
            name
         }
      }
   }
`

const query = `
   query mealKitProductsOrders(
      $includeSimpleRecipeProductName: Boolean!
      $includeDefaultCartItem: Boolean!
      $options: order_orderMealKitProduct_bool_exp
   ) {
      orderMealKitProductsAggregate(where: $options) {
         aggregate {
            count
         }
         nodes {
            id
            simpleRecipeProduct {
               id
               name @include(if: $includeSimpleRecipeProductName)
               defaultCartItem
                  @include(if: $includeDefaultCartItem)
            }
         }
      }
   }
`

export const SAMPLE_QUERY = gql`
   ${query}
`
