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
