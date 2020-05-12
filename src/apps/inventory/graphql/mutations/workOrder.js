import gql from 'graphql-tag'

export const CREATE_BULK_WORK_ORDER = gql`
   mutation CreateBulkWorkOrder(
      $object: inventory_bulkWorkOrder_insert_input!
   ) {
      createBulkWorkOrder(objects: [$object]) {
         affected_rows
         returning {
            id
            status
         }
      }
   }
`

export const UPDATE_BULK_WORK_ORDER_STATUS = gql`
   mutation UpdateBulkWorkOrderStatus($id: Int!, $status: String!) {
      updateBulkWorkOrder(
         where: { id: { _eq: $id } }
         _set: { status: $status }
      ) {
         affected_rows
         returning {
            id
            status
         }
      }
   }
`
