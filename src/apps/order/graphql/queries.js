import gql from 'graphql-tag'

export const SUMMARY = gql`
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
      orders(
         order_by: { updated_at: desc }
         where: { orderStatus: { _neq: "DELIVERED" } }
      ) {
         id
         created_at
         deliveryInfo
         orderStatus
         paymentStatus
         tax
         discount
         itemTotal
         deliveryPrice
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
            simpleRecipeProduct {
               name
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
            simpleRecipeProduct {
               name
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

export const ORDER = gql`
   subscription order($id: oid!) {
      order(id: $id) {
         id
         created_at
         deliveryInfo
         orderStatus
         paymentStatus
         tax
         discount
         itemTotal
         deliveryPrice
         transactionId
         orderMealKitProducts {
            id
            assemblyStatus
            recipeCardUri
            assemblyStation {
               name
            }
            comboProduct {
               name
            }
            comboProductComponent {
               label
            }
            simpleRecipeProduct {
               name
            }
            simpleRecipeProductOption {
               simpleRecipeYield {
                  yield
               }
            }
            orderSachets {
               id
               status
               labelUri
               quantity
               isAssembled
               isLabelled
               isPortioned
               ingredientName
               processingName
               packaging {
                  name
               }
               sachetItemId
               sachetItem {
                  id
                  bulkItem {
                     id
                     sop
                     yield
                     shelfLife
                     bulkDensity
                     supplierItem {
                        name
                     }
                  }
               }
               bulkItemId
               bulkItem {
                  id
                  sop
                  yield
                  shelfLife
                  bulkDensity
                  supplierItem {
                     name
                  }
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
            simpleRecipeProduct {
               name
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

export const FETCH_ORDER_MEALKIT = gql`
   subscription orderMealKitProduct($id: Int!) {
      orderMealKitProduct(id: $id) {
         id
         assemblyStatus
         recipeCardUri
         assemblyStation {
            name
         }
         comboProduct {
            name
         }
         comboProductComponent {
            label
         }
         simpleRecipeProduct {
            name
         }
         simpleRecipeProductOption {
            simpleRecipeYield {
               yield
            }
         }
         orderSachets {
            id
            status
            labelUri
            quantity
            isAssembled
            ingredientName
            processingName
            isLabelled
            isPortioned
            packaging {
               name
            }
            sachetItemId
            sachetItem {
               id
               bulkItem {
                  id
                  sop
                  yield
                  shelfLife
                  bulkDensity
                  supplierItem {
                     name
                  }
               }
            }
            bulkItemId
            bulkItem {
               id
               sop
               yield
               shelfLife
               bulkDensity
               supplierItem {
                  name
               }
            }
         }
      }
   }
`

export const FETCH_ORDER_SACHET = gql`
   subscription orderSachet($id: Int!) {
      orderSachet(id: $id) {
         id
         status
         labelUri
         quantity
         isAssembled
         ingredientName
         processingName
         isLabelled
         isPortioned
         packaging {
            name
         }
         sachetItemId
         sachetItem {
            id
            bulkItem {
               id
               sop
               yield
               shelfLife
               bulkDensity
               supplierItem {
                  name
               }
            }
         }
         bulkItemId
         bulkItem {
            id
            sop
            yield
            shelfLife
            bulkDensity
            supplierItem {
               name
            }
         }
      }
   }
`
