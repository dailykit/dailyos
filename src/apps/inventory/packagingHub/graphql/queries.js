import gql from 'graphql-tag'

export const CATEGORIES = gql`
   query PackagingCompanyBrand {
      packagingHub_packagingType {
         id
         name
         assets
      }
   }
`

export const PACKAGINGS = gql`
   query Packaging($id: Int!) {
      packagingHub_packaging(where: { packagingTypeId: { _eq: $id } }) {
         id
         packagingName
         assets
         height
         length
         width
         packagingCompanyBrand {
            name
         }
         thickness
         packagingPurchaseOptions(order_by: { quantity: asc }) {
            salesPrice
         }
      }
   }
`
