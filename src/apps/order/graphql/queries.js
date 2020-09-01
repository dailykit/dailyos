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

export const ORDER_BY_STATUS = gql`
   subscription orderByStatus {
      orderByStatus: order_orderStatusEnum {
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
            simpleRecipeProduct {
               name
            }
            simpleRecipeProductOption {
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
         orderReadyToEatProducts(
            where: { assemblyStationId: $assemblyStationId }
         ) {
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
         orderInventoryProducts(
            where: { assemblyStationId: $assemblyStationId }
         ) {
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
`

export const FETCH_INVENTORY = gql`
   subscription orderInventoryProduct($id: Int!) {
      orderInventoryProduct(id: $id) {
         id
         quantity
         assemblyStatus
         inventoryProduct {
            name
            sachetItem {
               id
               unit
               unitSize
               onHand
               bulkItem {
                  processingName
                  supplierItem {
                     name
                     supplier {
                        name
                     }
                  }
               }
            }
            supplierItem {
               id
               name
               unit
               unitSize
               supplier {
                  name
               }
               bulkItemAsShipped {
                  processingName
                  onHand
               }
            }
         }
         comboProduct {
            name
         }
         comboProductComponent {
            label
         }
         customizableProduct {
            name
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
