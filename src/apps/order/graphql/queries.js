import gql from 'graphql-tag'

export const ORDER_DELIVERY_INFO = gql`
   subscription order($id: oid!) {
      order(id: $id) {
         id
         deliveryInfo
         deliveryPartnershipId
      }
   }
`

export const DELIVERY_SERVICE = gql`
   query service($id: Int!) {
      service: partnerships_deliveryPartnership_by_pk(id: $id) {
         id
         details: deliveryCompany {
            id
            name
            assets
            website
            description
            established
         }
      }
   }
`

export const DELIVERY_SERVICES = gql`
   query deliveryServices {
      deliveryServices(where: { isActive: { _eq: true } }) {
         id
         logo
         companyName
         isThirdParty
         partnershipId
      }
   }
`

export const NEW_NOTIF = gql`
   subscription displayNotifications {
      displayNotifications(where: { type: { app: { _eq: "Order" } } }) {
         type {
            audioUrl
         }
      }
   }
`

export const NOTIFICATIONS = gql`
   subscription displayNotifications {
      displayNotifications(
         order_by: { created_at: desc }
         where: { type: { app: { _eq: "Order" } } }
      ) {
         id
         content
         created_at
         updated_at
         type {
            isGlobal
            isLocal
            playAudio
            audioUrl
         }
      }
   }
`

export const ALL_ORDERS_AGGREGATE = gql`
   subscription orders {
      orders: ordersAggregate {
         aggregate {
            count
            sum {
               amount: amountPaid
            }
            avg {
               amountPaid
            }
         }
      }
   }
`

export const ORDER_BY_STATUS = gql`
   subscription orderByStatus {
      orderByStatus: order_orderStatusEnum(order_by: { index: asc }) {
         value
         orders: orders_aggregate {
            aggregate {
               count
               sum {
                  amount: amountPaid
               }
               avg {
                  amountPaid
               }
            }
         }
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
   subscription orders(
      $limit: Int
      $offset: Int
      $where: order_order_bool_exp = {}
   ) {
      orders(
         limit: $limit
         offset: $offset
         order_by: { updated_at: desc }
         where: $where
      ) {
         id
         created_at
         deliveryInfo
         orderStatus
         paymentStatus
         tax
         discount
         itemTotal
         amountPaid
         deliveryPrice
         transactionId
         fulfillmentType
         orderMealKitProducts {
            id
            price
            isAssembled
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
            price
            isAssembled
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
            price
            isAssembled
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
   subscription order(
      $id: oid!
      $packingStationId: Int_comparison_exp = {}
      $assemblyStationId: Int_comparison_exp = {}
   ) {
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
         fulfillmentType
         orderMealKitProducts(
            where: { assemblyStationId: $assemblyStationId }
         ) {
            id
            isAssembled
            assemblyStatus
            labelTemplateId
            assemblyStationId
            assemblyStation {
               id
               name
            }
            comboProductId
            comboProduct {
               id
               name
            }
            comboProductComponentId
            comboProductComponent {
               id
               label
            }
            simpleRecipeProductId
            simpleRecipeProduct {
               id
               name
            }
            simpleRecipeProductOptionId
            simpleRecipeProductOption {
               id
               simpleRecipeYield {
                  yield
               }
            }
            orderSachets(where: { packingStationId: $packingStationId }) {
               id
               status
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
                  bulkItemId
                  bulkItem {
                     id
                     sop
                     yield
                     shelfLife
                     bulkDensity
                     supplierItemId
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
                  supplierItemId
                  supplierItem {
                     name
                  }
               }
            }
         }
         orderReadyToEatProducts(
            where: { assemblyStationId: $assemblyStationId }
         ) {
            id
            quantity
            isAssembled
            assemblyStatus
            labelTemplateId
            assemblyStationId
            assemblyStation {
               id
               name
            }
            comboProductId
            comboProduct {
               id
               name
            }
            comboProductComponentId
            comboProductComponent {
               id
               label
            }
            simpleRecipeProductId
            simpleRecipeProduct {
               id
               name
            }
            simpleRecipeProductOptionId
            simpleRecipeProductOption {
               id
               simpleRecipeYield {
                  yield
               }
            }
         }
         orderInventoryProducts(
            where: { assemblyStationId: $assemblyStationId }
         ) {
            id
            quantity
            isAssembled
            assemblyStatus
            labelTemplateId
            inventoryProductId
            inventoryProduct {
               id
               name
            }
            comboProductId
            comboProduct {
               id
               name
            }
            comboProductComponentId
            comboProductComponent {
               id
               label
            }
            assemblyStationId
            assemblyStation {
               id
               name
            }
            inventoryProductOptionId
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
         unit
         status
         quantity
         isAssembled
         isLabelled
         isPortioned
         ingredientName
         processingName
         labelTemplateId
         packingStationId
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
         mealkit: orderMealKitProduct {
            orderId
            product: simpleRecipeProduct {
               id
               name
            }
         }
      }
   }
`

export const FETCH_INVENTORY = gql`
   subscription orderInventoryProduct($id: Int!) {
      orderInventoryProduct(id: $id) {
         id
         quantity
         assemblyStatus
         inventoryProductId
         inventoryProduct {
            id
            name
            supplierItemId
            supplierItem {
               id
               name
               unit
               unitSize
               supplierId
               supplier {
                  id
                  name
               }
            }
            sachetItemId
            sachetItem {
               unit
               unitSize
               bulkItemId
               bulkItem {
                  supplierItemId
                  supplierItem {
                     unit
                     name
                     unitSize
                     supplierId
                     supplier {
                        id
                        name
                     }
                  }
               }
            }
         }
         comboProductId
         comboProduct {
            id
            name
         }
         comboProductComponentId
         comboProductComponent {
            id
            label
         }
      }
   }
`

export const FETCH_READYTOEAT = gql`
   subscription orderReadyToEatProduct($id: Int!) {
      orderReadyToEatProduct(id: $id) {
         assemblyStatus
         comboProduct {
            name
         }
         comboProductComponent {
            label
         }
         customizableProduct {
            name
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
   }
`

export const ORDERS_AGGREGATE = gql`
   query ordersAggregate($where: order_order_bool_exp = {}) {
      ordersAggregate(where: $where) {
         aggregate {
            count
         }
      }
   }
`

export const STATIONS = gql`
   subscription stations {
      stations {
         id
         title: name
      }
   }
`

export const STATION = gql`
   query station($id: Int!) {
      station(id: $id) {
         id
         name
      }
   }
`

export const PLANNED = {
   INVENTORY_PRODUCTS: gql`
      subscription inventoryProducts($order: order_order_bool_exp) {
         inventoryProducts: inventoryProductsAggregate(
            where: { orderInventoryProducts: { order: $order } }
         ) {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               name
               products: orderInventoryProducts_aggregate(
                  where: { order: $order }
               ) {
                  aggregate {
                     count(columns: id)
                     sum {
                        quantity
                     }
                  }
               }
               options: inventoryProductOptions(
                  where: { orderInventoryProducts: { order: $order } }
               ) {
                  id
                  label
                  products: orderInventoryProducts_aggregate(
                     where: { order: $order }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
                  assembledProducts: orderInventoryProducts_aggregate(
                     where: { order: $order, isAssembled: { _eq: true } }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
               }
            }
         }
      }
   `,
   INVENTORY_PRODUCT: gql`
      subscription inventoryProduct(
         $id: Int!
         $order: order_order_bool_exp = {}
      ) {
         inventoryProduct(id: $id) {
            id
            name
            products: orderInventoryProducts_aggregate(
               where: { order: $order }
            ) {
               aggregate {
                  count(columns: id)
                  sum {
                     quantity
                  }
               }
            }
            options: inventoryProductOptions(
               where: { orderInventoryProducts: { order: $order } }
            ) {
               id
               label
               orderInventoryProducts: orderInventoryProducts_aggregate(
                  where: { order: $order }
               ) {
                  aggregate {
                     total: count(columns: id)
                  }
                  nodes {
                     id
                     orderId
                     quantity
                     isAssembled
                  }
               }
            }
         }
      }
   `,
   READY_TO_EAT_PRODUCTS: gql`
      subscription simpleRecipeProducts($order: order_order_bool_exp) {
         simpleRecipeProducts: simpleRecipeProductsAggregate(
            where: { orderReadyToEatProducts: { order: $order } }
         ) {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               name
               options: simpleRecipeProductOptions(
                  where: { orderReadyToEatProducts: { order: $order } }
               ) {
                  id
                  yield: simpleRecipeYield {
                     id
                     size: yield(path: "serving")
                  }
                  products: orderReadyToEatProducts_aggregate(
                     where: { order: $order }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
                  assembledProducts: orderReadyToEatProducts_aggregate(
                     where: { order: $order, isAssembled: { _eq: true } }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
               }
            }
         }
      }
   `,
   READY_TO_EAT_PRODUCT: gql`
      subscription simpleRecipeProduct(
         $id: Int!
         $order: order_order_bool_exp = {}
      ) {
         simpleRecipeProduct(id: $id) {
            id
            name
            products: orderReadyToEatProducts_aggregate(
               where: { order: $order }
            ) {
               aggregate {
                  count
                  sum {
                     quantity
                  }
               }
            }
            options: simpleRecipeProductOptions(
               where: { orderReadyToEatProducts: { order: $order } }
            ) {
               id
               yield: simpleRecipeYield {
                  id
                  size: yield(path: "serving")
               }
               orderReadyToEatProducts: orderReadyToEatProducts_aggregate(
                  where: { order: $order }
               ) {
                  aggregate {
                     total: count(columns: id)
                     sum {
                        quantity
                     }
                  }
                  nodes {
                     id
                     orderId
                     quantity
                     isAssembled
                  }
               }
            }
         }
      }
   `,
   MEAL_KIT_PRODUCTS: gql`
      subscription simpleRecipeProducts($order: order_order_bool_exp) {
         simpleRecipeProducts: simpleRecipeProductsAggregate(
            where: { orderMealKitProducts: { order: $order } }
         ) {
            aggregate {
               count(columns: id)
            }
            nodes {
               id
               name
               options: simpleRecipeProductOptions(
                  where: { orderMealKitProducts: { order: $order } }
               ) {
                  id
                  yield: simpleRecipeYield {
                     id
                     size: yield(path: "serving")
                  }
                  products: orderMealKitProducts_aggregate(
                     where: { order: $order }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
                  assembledProducts: orderMealKitProducts_aggregate(
                     where: { order: $order, isAssembled: { _eq: true } }
                  ) {
                     aggregate {
                        count(columns: id)
                        sum {
                           quantity
                        }
                     }
                  }
               }
            }
         }
      }
   `,
   MEAL_KIT_PRODUCT: gql`
      subscription simpleRecipeProduct(
         $id: Int!
         $order: order_order_bool_exp = {}
      ) {
         simpleRecipeProduct(id: $id) {
            id
            name
            products: orderMealKitProducts_aggregate(where: { order: $order }) {
               aggregate {
                  count
                  sum {
                     quantity
                  }
               }
            }
            options: simpleRecipeProductOptions(
               where: { orderMealKitProducts: { order: $order } }
            ) {
               id
               yield: simpleRecipeYield {
                  id
                  size: yield(path: "serving")
               }
               orderMealKitProducts: orderMealKitProducts_aggregate(
                  where: { order: $order }
               ) {
                  aggregate {
                     total: count(columns: id)
                     sum {
                        quantity
                     }
                  }
                  nodes {
                     id
                     orderId
                     quantity
                     isAssembled
                  }
               }
            }
         }
      }
   `,
   MEAL_KIT_SACHETS: gql`
      subscription ingredients($order: order_order_bool_exp = {}) {
         ingredients: ingredientsAggregate(
            where: {
               ingredientSachets: {
                  orderSachets: { orderMealKitProduct: { order: $order } }
               }
            }
         ) {
            aggregate {
               count
            }
            nodes {
               id
               name
               processings: ingredientProcessings_aggregate(
                  where: {
                     ingredientSachets: {
                        orderSachets: { orderMealKitProduct: { order: $order } }
                     }
                  }
               ) {
                  aggregate {
                     count(columns: processingName)
                  }
                  nodes {
                     id
                     name: processingName
                     sachets: ingredientSachets_aggregate(
                        where: {
                           orderSachets: {
                              orderMealKitProduct: { order: $order }
                           }
                        }
                     ) {
                        aggregate {
                           count(columns: id)
                        }
                        nodes {
                           id
                           unit
                           quantity
                           allOrderSachets: orderSachets_aggregate(
                              where: { orderMealKitProduct: { order: $order } }
                           ) {
                              aggregate {
                                 count(columns: id)
                                 sum {
                                    quantity
                                 }
                              }
                              nodes {
                                 id
                                 isAssembled
                                 orderMealKitProduct {
                                    id
                                    orderId
                                    simpleRecipeProduct {
                                       id
                                       name
                                    }
                                 }
                              }
                           }
                           completedOrderSachets: orderSachets_aggregate(
                              where: {
                                 orderMealKitProduct: { order: $order }
                                 status: { _eq: "PACKED" }
                              }
                           ) {
                              aggregate {
                                 count(columns: id)
                                 sum {
                                    quantity
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }
   `,
}

export const STATIONS_BY_USER = gql`
   subscription stations($email: String_comparison_exp!) {
      stations(where: { assignedUsers: { user: { email: $email } } }) {
         id
         name
         defaultKotPrinter {
            name
            state
            printNodeId
         }
         defaultLabelPrinter {
            name
            state
            printNodeId
         }
         defaultScale {
            id
            active
            deviceNum
            deviceName
         }
      }
   }
`

export const SETTINGS = gql`
   subscription settings {
      settings: settings_appSettings {
         id
         app
         type
         identifier
         value
      }
   }
`

export const LABEL_TEMPLATE = gql`
   query labelTemplate($id: Int!) {
      labelTemplate(id: $id) {
         id
         name
      }
   }
`

export const DEVICES = {
   PRINTERS: gql`
      query printers($type: String_comparison_exp!) {
         printers(where: { printerType: $type }) {
            name
            printNodeId
         }
      }
   `,
}
