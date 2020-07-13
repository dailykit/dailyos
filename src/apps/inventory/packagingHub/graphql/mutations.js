import gql from 'graphql-tag'

export const REGISTER_PURCHASE_ORDER = gql`
   mutation RegisterPurchaseOrder {
      insert_organizationPurchaseOrders_purchaseOrder(objects: {}) {
         returning {
            id
            organizationId
         }
      }
   }
`
