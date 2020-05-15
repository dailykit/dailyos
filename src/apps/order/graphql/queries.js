import gql from 'graphql-tag'

export const ORDERS_SUMMARY = gql`
   subscription ordersSummary {
      orders(limit: 1) {
         summary
         currency
      }
   }
`

export const ORDER_AGGREGATE = gql`
   subscription ordersAggregate {
      ordersAggregate {
         aggregate {
            count
         }
      }
   }
`

export const ORDER_STATUSES = gql`
   subscription orderStatuses {
      order_orderStatusEnum {
         value
      }
   }
`

export const ORDERS = gql`
   subscription orders {
      orders(order_by: { updated_at: desc }) {
         id
         created_at
         deliveryInfo
         orderStatus
         paymentStatus
         tax
         discount
         itemTotal
         deliveryCost
         transactionId
         orderMealKitProducts {
            id
            assemblyStatus
            assemblyStation {
               name
            }
            comboProduct {
               name
            }
            comboProductComponent {
               label
            }
            recipeCardUri
            orderSachets {
               status
               isAssembled
            }
            simpleRecipeProductOption {
               simpleRecipeYield {
                  yield
               }
            }
         }
         orderReadyToEatProducts {
            id
            assemblyStatus
            simpleRecipeProduct {
               name
            }
            assemblyStation {
               name
            }
            comboProduct {
               id
               name
            }
            comboProductComponent {
               id
               label
            }
            simpleRecipeProductOption {
               simpleRecipeYield {
                  yield
               }
            }
         }
         orderInventoryProducts {
            id
            inventoryProduct {
               name
            }
            comboProduct {
               name
            }
            comboProductComponent {
               label
            }
            assemblyStation {
               name
            }
            assemblyStatus
            customizableProduct {
               name
            }
            inventoryProductOption {
               quantity
               label
            }
         }
      }
   }
`
