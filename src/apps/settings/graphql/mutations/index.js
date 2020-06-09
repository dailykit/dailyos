import gql from 'graphql-tag'

export const CREATE_USER = gql`
   mutation insert_settings_user_one($object: settings_user_insert_input!) {
      insert_settings_user_one(object: $object) {
         id
      }
   }
`

export const DELETE_USER = gql`
   mutation delete_settings_user_by_pk($id: Int!) {
      delete_settings_user_by_pk(id: $id) {
         id
      }
   }
`

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

export const DELETE_ACCOMPANIMENT_TYPES = gql`
   mutation DeleteAccompanimentTypes($ids: [Int!]!) {
      delete_master_accompanimentType(where: { id: { _in: $ids } }) {
         returning {
            id
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

export const DELETE_PROCESSINGS = gql`
   mutation DeleteProcessings($ids: [Int!]!) {
      deleteMasterProcessing(where: { id: { _in: $ids } }) {
         returning {
            id
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

export const DELETE_CUISINES = gql`
   mutation DeleteCuisines($ids: [Int!]!) {
      deleteCuisineName(where: { id: { _in: $ids } }) {
         returning {
            id
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

export const DELETE_ALLERGENS = gql`
   mutation DeleteAllergens($ids: [Int!]!) {
      deleteMasterAllergen(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_UNITS = gql`
   mutation CreateUnits($objects: [unit_unit_insert_input!]!) {
      createUnit(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_UNITS = gql`
   mutation DeleteUnits($ids: [Int!]!) {
      deleteUnit(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`
