import gql from 'graphql-tag'

export const CREATE_COLLECTION = gql`
   mutation CreateCollection($name: String!, $availability: jsonb) {
      createMenuCollection(
         objects: { name: $name, availability: $availability }
      ) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_COLLECTIONS = gql`
   mutation DeleteCollections($ids: [Int!]!) {
      deleteMenuCollection(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_COLLECTION = gql`
   mutation UpdateCollection(
      $id: Int!
      $set: onlineStore_menuCollection_set_input
   ) {
      updateMenuCollection(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_COLLECTION_PRODUCT_CATEGORY_PRODUCTS = gql`
   mutation createCollectionProductCategoryProducts(
      $objects: [onDemand_collection_productCategory_product_insert_input!]!
   ) {
      createCollectionProductCategoryProducts(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_COLLECTION_PRODUCT_CATEGORY_PRODUCT = gql`
   mutation DeleteCollectionProductCategoryProduct($id: Int!) {
      deleteCollectionProductCategoryProduct(id: $id) {
         id
      }
   }
`

export const UPDATE_STORE_SETTING = gql`
   mutation UpdateStoreSetting(
      $type: String!
      $identifier: String!
      $value: jsonb!
   ) {
      updateStoreSetting(
         where: { type: { _eq: $type }, identifier: { _eq: $identifier } }
         _set: { value: $value }
      ) {
         returning {
            value
         }
      }
   }
`

export const CREATE_RECURRENCE = gql`
   mutation createRecurrence($object: fulfilment_recurrence_insert_input!) {
      createRecurrence(object: $object) {
         id
      }
   }
`

export const UPDATE_RECURRENCE = gql`
   mutation UpdateRecurrence($id: Int!, $set: fulfilment_recurrence_set_input) {
      updateRecurrence(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_RECURRENCE = gql`
   mutation DeleteRecurrence($id: Int!) {
      deleteRecurrenceByPK(id: $id) {
         id
      }
   }
`

export const CREATE_TIME_SLOTS = gql`
   mutation createTimeSlot($objects: [fulfilment_timeSlot_insert_input!]!) {
      createTimeSlots(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_TIME_SLOT = gql`
   mutation UpdateTimeSlot($id: Int!, $set: fulfilment_timeSlot_set_input) {
      updateTimeSlot(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_TIME_SLOT = gql`
   mutation DeleteTimeSlot($id: Int!) {
      deleteTimeSlotByPK(id: $id) {
         id
      }
   }
`

export const CREATE_MILE_RANGES = gql`
   mutation CreateMileRanges($objects: [fulfilment_mileRange_insert_input!]!) {
      createMileRanges(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_MILE_RANGE = gql`
   mutation UpdateMileRange($id: Int!, $set: fulfilment_mileRange_set_input) {
      updateMileRange(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_MILE_RANGE = gql`
   mutation DeleteMileRange($id: Int!) {
      deleteMileRangeByPK(id: $id) {
         id
      }
   }
`

export const CREATE_CHARGES = gql`
   mutation Charges($objects: [fulfilment_charge_insert_input!]!) {
      createCharges(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_CHARGE = gql`
   mutation UpdateCharge($id: Int!, $set: fulfilment_charge_set_input) {
      updateCharge(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_CHARGE = gql`
   mutation DeleteCharge($id: Int!) {
      deleteChargeByPK(id: $id) {
         id
      }
   }
`
