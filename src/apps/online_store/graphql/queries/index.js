import gql from 'graphql-tag'

export const RECIPES = gql`
   {
      recipes {
         id
         name
         servings {
            size
         }
      }
   }
`

export const PRODUCTS = gql`
   {
      products {
         id
         title
         items {
            label
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
