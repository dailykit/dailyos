import gql from 'graphql-tag'

export const CUISINES = gql`
   query Cuisines {
      cuisineNames {
         id
         name
      }
   }
`

export const INGREDIENTS = gql`
   query Ingredients($where: ingredient_ingredient_bool_exp) {
      ingredients(where: $where) {
         id
         title: name
         name
         isValid
      }
   }
`

// TODO: add isValid on processing
export const PROCESSINGS = gql`
   query Processings($where: ingredient_ingredientProcessing_bool_exp) {
      ingredientProcessings(where: $where) {
         id
         title: processingName
         processingName
      }
   }
`

export const SACHETS = gql`
   query Sachets($where: ingredient_ingredientSachet_bool_exp) {
      ingredientSachets(where: $where) {
         id
         isValid
         quantity
         unit
         ingredient {
            id
            name
         }
      }
   }
`

export const SACHET_ITEMS = gql`
   query {
      sachetItems {
         id
         unitSize
         unit
         bulkItem {
            id
            processingName
            supplierItem {
               id
               name
            }
         }
      }
   }
`

export const BULK_ITEMS = gql`
   query {
      bulkItems {
         id
         processingName
         supplierItem {
            id
            name
         }
      }
   }
`
