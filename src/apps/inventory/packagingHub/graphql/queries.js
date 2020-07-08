import gql from 'graphql-tag'

export const CATEGORIES = gql`
   query PackagingCompanyBrand {
      packagingHub_packagingCompanyBrand {
         id
         name
         assets
      }
   }
`
