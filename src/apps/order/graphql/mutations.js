import gql from 'graphql-tag'

export const UPDATE_ORDER_STATUS = gql`
   mutation updateOrder($id: oid!, $orderStatus: String!) {
      updateOrder(
         pk_columns: { id: $id }
         _set: { orderStatus: $orderStatus }
      ) {
         id
      }
   }
`
