import gql from 'graphql-tag'

export const CREATE_PRODUCT = gql`
   mutation CreateProduct($title: String!) {
      createProduct(title: $title) {
         success
         product {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_PRODUCT = gql`
   mutation CreateSimpleRecipeProduct(
      $objects: [onlineStore_simpleRecipeProduct_insert_input!]!
   ) {
      createSimpleRecipeProduct(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS = gql`
   mutation CreateSimpleRecipeProductOption(
      $objects: [onlineStore_simpleRecipeProductOption_insert_input!]!
   ) {
      createSimpleRecipeProductOption(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const CREATE_COLLECTION = gql`
   mutation CreateCollection($title: String) {
      createMenuCollection(title: $title) {
         success
         message
         menuCollection {
            id
            title
         }
      }
   }
`

export const UPDATE_PRODUCT = gql`
   mutation UpdateProduct($input: UpdateProductInput) {
      updateProduct(input: $input) {
         success
         product {
            id
            title
         }
      }
   }
`

export const UPDATE_COLLECTION = gql`
   mutation UpdateCollection($input: UpdateMenuCollectionInput) {
      updateMenuCollection(input: $input) {
         success
         message
         menuCollection {
            id
            title
            categories {
               title
               products {
                  id
                  title
               }
            }
            availability
         }
      }
   }
`
