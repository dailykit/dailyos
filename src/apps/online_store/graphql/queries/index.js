import gql from 'graphql-tag'

export const STORE_SETTINGS = gql`
   query StoreSettings($type: String!) {
      storeSettings(where: { type: { _eq: $type } }) {
         value
         identifier
      }
   }
`

export const RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         isValid
         isPublished
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

export const CUSTOMIZABLE_PRODUCTS = gql`
   {
      customizableProducts {
         id
         name
         default
      }
   }
`

export const COMBO_PRODUCTS = gql`
   {
      comboProducts {
         id
         name
      }
   }
`

export const COMBO_PRODUCT = gql`
   query ComboProduct($id: Int!) {
      comboProduct(id: $id) {
         id
         name
         description
         tags
         comboProductComponents {
            id
            label
            customizableProduct {
               id
               name
            }
            inventoryProduct {
               id
               name
               inventoryProductOptions {
                  id
                  label
                  price
                  quantity
               }
            }
            simpleRecipeProduct {
               id
               name
               simpleRecipeProductOptions {
                  id
                  isActive
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
               }
            }
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
      menuCollections {
         id
         name
         categories
         availability
      }
   }
`
