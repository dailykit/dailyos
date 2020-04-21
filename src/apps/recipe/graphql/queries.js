import { gql } from 'apollo-boost'

export const INGREDIENTS = gql`
   {
      ingredients {
         id
         name
      }
   }
`

export const INGREDIENT = gql`
   query Ingredient($ID: ID!) {
      ingredient(id: $ID) {
         id
         name
         image
         processings {
            id
         }
         sachets {
            id
         }
      }
   }
`

export const PROCESSINGS_OF_INGREDIENT = gql`
   query Ingredient($ingredientId: ID!) {
      ingredient(id: $ingredientId) {
         id
         processings {
            id
            name {
               title
            }
            sachets {
               id
            }
            recipes {
               id
            }
         }
      }
   }
`

export const SACHETS_OF_PROCESSING = gql`
   query Processing($processingId: ID!) {
      processing(id: $processingId) {
         id
         sachets {
            id
            quantity {
               value
               unit {
                  id
                  title
               }
            }
            tracking
            modes {
               isActive
               type
               station {
                  id
                  title
               }
               supplierItems {
                  isDefault
                  item {
                     id
                     title
                  }
                  accuracy
                  packaging {
                     id
                     title
                  }
                  isLabelled
                  labelTemplate {
                     id
                     title
                  }
               }
            }
         }
      }
   }
`

export const FETCH_PROCESSING_NAMES = gql`
   {
      processingNames {
         id
         title
      }
   }
`

export const FETCH_UNITS = gql`
   {
      units {
         id
         title
      }
   }
`

export const FETCH_STATIONS = gql`
   {
      stations {
         id
         title
      }
   }
`

export const FETCH_SUPPLIER_ITEMS = gql`
   {
      supplierItems {
         id
         title
      }
   }
`

export const FETCH_PACKAGINGS = gql`
   {
      packagings {
         id
         title
      }
   }
`

export const FETCH_LABEL_TEMPLATES = gql`
   {
      labelTemplates {
         id
         title
      }
   }
`

export const RECIPES = gql`
   {
      recipes {
         id
         name
      }
   }
`

export const RECIPE = gql`
   query Recipe($ID: ID!) {
      recipe(id: $ID) {
         id
         name
         cookingTime
         type
         chef
         description
         utensils
         cookingTime
         servings {
            size
            sachets {
               id
               ingredient {
                  id
               }
               quantity {
                  value
                  unit {
                     title
                  }
               }
            }
         }
         ingredients {
            ingredient {
               id
               name
            }
            processing {
               id
               name {
                  title
               }
            }
         }
         procedures {
            name
            steps {
               title
               description
            }
         }
      }
   }
`
