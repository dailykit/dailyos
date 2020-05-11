import gql from 'graphql-tag'

export const CREATE_BULK_WORK_ORDER = gql`
   mutation CreateBulkWorkOrder(
      $object: inventory_bulkWorkOrder_insert_input!
   ) {
      createBulkWorkOrder(objects: [$object]) {
         affected_rows
         returning {
            id
         }
      }
   }
`
