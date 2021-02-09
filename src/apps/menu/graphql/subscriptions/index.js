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
      collections: onDemand_collectionDetails(order_by: { created_at: desc }) {
         id
         name
         rrule(path: "text")
         categoriesCount
         productsCount
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
         productCategories(order_by: { position: desc_nulls_last }) {
            id
            position
            productCategoryName
            products(order_by: { position: desc_nulls_last }) {
               id
               position
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

export const BRAND_COLLECTIONS = gql`
   subscription BrandCollections {
      brandCollections: brands {
         id
         title
         domain
         collections {
            collectionId
            isActive
         }
      }
   }
`

export const BRAND_RECURRENCES = gql`
   subscription BrandRecurrences {
      brandRecurrences: brands {
         id
         title
         domain
         recurrences {
            recurrenceId
            isActive
         }
      }
   }
`
