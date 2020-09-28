import gql from 'graphql-tag'

export const BRANDS = {
   AGGREGATE: gql`
      subscription brands {
         brandsAggregate {
            aggregate {
               count
            }
         }
      }
   `,
   LIST: gql`
      subscription brands {
         brands: brandsAggregate {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               domain
               title
               isPublished
            }
         }
      }
   `,
   BRAND: gql`
      subscription brand($id: Int!) {
         brand(id: $id) {
            id
            domain
            title
            isDefault
            isPublished
         }
      }
   `,
   UPDATE: gql`
      mutation updateBrand($id: Int!, $_set: brands_brand_set_input!) {
         updateBrand(pk_columns: { id: $id }, _set: $_set) {
            id
         }
      }
   `,
}
