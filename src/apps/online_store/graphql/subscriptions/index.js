import gql from 'graphql-tag'

export const COLLECTIONS_COUNT = gql`
   subscription CollectionsCount {
      collectionsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_COLLECTIONS = gql`
   subscription Collections {
      collections {
         id
         name
         startTime
         endTime
         rrule
      }
   }
`

export const S_COLLECTION = gql`
   subscription Collection($id: Int!) {
      collection(id: $id) {
         id
         name
         startTime
         endTime
         rrule
         productCategories {
            id
            productCategoryName
            products {
               id
               data
            }
         }
      }
   }
`

export const S_PRODUCT_CATEGORIES = gql`
   subscription ProductCategories {
      productCategories {
         id: name
         title: name
      }
   }
`

export const STORE_SETTINGS = gql`
   subscription StoreSettings($type: String!) {
      storeSettings(where: { type: { _eq: $type } }) {
         value
         identifier
      }
   }
`

export const RECURRENCES = gql`
   subscription Recurrence($type: String!) {
      recurrences(where: { type: { _eq: $type } }) {
         id
         rrule
         type
         isActive
         timeSlots {
            id
            from
            to
            isActive
            pickUpLeadTime
            pickUpPrepTime
            mileRanges {
               id
               from
               to
               leadTime
               prepTime
               isActive
               charges {
                  id
                  charge
                  orderValueFrom
                  orderValueUpto
                  autoDeliverySelection
               }
            }
         }
      }
   }
`
