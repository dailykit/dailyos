import gql from 'graphql-tag'

export const CREATE_ACCOMPANIMENT_TYPES = gql`
   mutation CreateAccompanimentTypes(
      $objects: [master_accompanimentType_insert_input!]!
   ) {
      insert_master_accompanimentType(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const CREATE_PROCESSINGS = gql`
   mutation CreateProcessings(
      $objects: [master_processingName_insert_input!]!
   ) {
      createMasterProcessing(objects: $objects) {
         returning {
            id
            name
            description
         }
      }
   }
`

export const CREATE_CUISINES = gql`
   mutation CreateCuisines($objects: [master_cuisineName_insert_input!]!) {
      createCuisineName(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const CREATE_ALLERGENS = gql`
   mutation CreateAllergens($objects: [master_allergenName_insert_input!]!) {
      createMasterAllergen(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`
