import { gql } from 'apollo-boost'

export const CREATE_SUPPLIER = gql`
   mutation CreateSupplier($object: inventory_supplier_insert_input!) {
      createSupplier(objects: [$object]) {
         returning {
            id
            name
         }
      }
   }
`
