import gql from 'graphql-tag'

export const CREATE_PACKAGING = gql`
   mutation CreatePackaging($object: packaging_packaging_insert_input!) {
      createPackaging(objects: [$object]) {
         returning {
            id
            name
            unitPrice
            dimensions
            sku
            parLevel
            maxLevel
            unitQuantity
            caseQuantity
            unitPrice
            minOrderValue
            leadTime
         }
      }
   }
`
