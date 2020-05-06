import gql from 'graphql-tag'

export const S_INGREDIENTS = gql`
   subscription Ingredients {
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

export const S_RECIPES = gql`
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

export const S_RECIPE = gql`
   subscription($id: Int!) {
      simpleRecipe(id: $id) {
         id
         name
         author
         type
         description
         cookingTime
         cuisine
         utensils
      }
   }
`
