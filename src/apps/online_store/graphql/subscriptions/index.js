import gql from 'graphql-tag'

export const COLLECTIONS_COUNT = gql`
   subscription CollectionsCount {
      menuCollectionsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_COLLECTIONS = gql`
   subscription Collections {
      menuCollections {
         id
         name
         categories
         availability
      }
   }
`

export const S_COLLECTION = gql`
   subscription Collection($id: Int!) {
      menuCollection(id: $id) {
         id
         name
         isValid
         isPublished
         active
         availability
         categories
         store
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
