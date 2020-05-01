import gql from 'graphql-tag'

export const SUPPLIERS = gql`
   query {
      suppliers {
         id
         name
         contactPerson
         available
      }
   }
`

export const SUPPLIER = gql`
   query Supplier($id: Int!) {
      supplier(id: $id) {
         id
         name
         contactPerson
         available
         shippingTerms
         paymentTerms
      }
   }
`
