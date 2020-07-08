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
