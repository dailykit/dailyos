import gql from 'graphql-tag'

export const QUERIES = {
   ORDER: {
      SOURCE: gql`
         query orderSource($orderId: oid!) {
            orderSource: order_thirdPartyOrder(
               where: { order: { id: { _eq: $orderId } } }
            ) {
               id
               thirdPartyCompany {
                  title
                  imageUrl
               }
            }
         }
      `,
      DETAILS: gql`
         subscription order($id: oid!) {
            order(id: $id) {
               id
               tax
               discount
               itemTotal
               isAccepted
               isRejected
               created_at
               deliveryPrice
               fulfillmentType
               thirdPartyOrderId
               thirdPartyOrder {
                  id
                  thirdPartyOrderId
                  products: parsedData(path: "items")
                  emailContent: parsedData(path: "HtmlDocument")
               }
               cartId
               cart {
                  id
                  status
                  source
                  isTest
                  paymentStatus
                  transactionId
                  fulfillmentInfo
                  customer: customerInfo
                  assembledProducts: orderItems_aggregate(
                     where: {
                        levelType: { _eq: "orderItem" }
                        isAssembled: { _eq: true }
                     }
                  ) {
                     aggregate {
                        count
                     }
                  }
                  packedProducts: orderItems_aggregate(
                     where: {
                        levelType: { _eq: "orderItem" }
                        assemblyStatus: { _eq: "COMPLETED" }
                     }
                  ) {
                     aggregate {
                        count
                     }
                  }
                  totalProducts: orderItems_aggregate(
                     where: { levelType: { _eq: "orderItem" } }
                  ) {
                     aggregate {
                        count
                     }
                  }
               }
            }
         }
      `,
      PRODUCTS: gql`
         subscription products($where: order_cartItemView_bool_exp!) {
            products: order_cartItemView(
               where: $where
               order_by: { created_at: desc }
            ) {
               id
               isAssembled
               assemblyStatus
               displayName
               displayImage
               operationConfigId
               operationConfig {
                  labelTemplateId
                  stationId
               }
               parent {
                  productOptionId
                  productOption {
                     id
                     type
                  }
               }
               totalSachets: childs_aggregate {
                  aggregate {
                     count
                  }
               }
               packedSachets: childs_aggregate(
                  where: { packingStatus: { _eq: "COMPLETED" } }
               ) {
                  aggregate {
                     count
                  }
               }
               assembledSachets: childs_aggregate(
                  where: { isAssembled: { _eq: true } }
               ) {
                  aggregate {
                     count
                  }
               }
            }
         }
      `,
      DELIVERY_INFO: gql`
         subscription order($id: oid!) {
            order(id: $id) {
               id
               deliveryInfo
               deliveryPartnershipId
            }
         }
      `,
      STATUSES: gql`
         subscription orderStatuses {
            order_orderStatusEnum(order_by: { index: asc }) {
               value
            }
         }
      `,
      MEALKITS: gql`
         subscription mealkits($orderId: Int!) {
            mealkits: orderMealKitProducts(
               where: {
                  orderId: { _eq: $orderId }
                  orderModifierId: { _is_null: true }
               }
               order_by: { created_at: desc }
            ) {
               id
               isAssembled
               hasModifiers
               assemblyStatus
               labelTemplateId
               assemblyStationId
               order {
                  isAccepted
                  isRejected
               }
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
                     id
                     yield
                  }
               }
               orderModifiers {
                  inventoryProducts: childOrderInventoryProducts(
                     order_by: { created_at: desc }
                  ) {
                     id
                     quantity
                     isAssembled
                     assemblyStatus
                     labelTemplateId
                     order {
                        isAccepted
                        isRejected
                     }
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
                        id
                        quantity
                        label
                     }
                     orderSachets(order_by: { position: desc_nulls_last }) {
                        id
                        unit
                        status
                        quantity
                        position
                        isAssembled
                        isLabelled
                        isPortioned
                        ingredientName
                        processingName
                        packingStationId
                        packaging {
                           id
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
                                 id
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
                              id
                              name
                           }
                        }
                     }
                  }
                  mealKitProducts: childOrderMealKitProducts(
                     order_by: { created_at: desc }
                  ) {
                     id
                     isAssembled
                     assemblyStatus
                     labelTemplateId
                     order {
                        isAccepted
                        isRejected
                     }
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
                           id
                           yield
                        }
                     }
                     orderSachets(order_by: { position: desc_nulls_last }) {
                        id
                        unit
                        status
                        quantity
                        position
                        isAssembled
                        isLabelled
                        isPortioned
                        ingredientName
                        processingName
                        packingStationId
                        packaging {
                           id
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
                                 id
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
                              id
                              name
                           }
                        }
                     }
                  }
                  readyToEatProducts: childOrderReadyToEatProducts(
                     order_by: { created_at: desc }
                  ) {
                     id
                     quantity
                     isAssembled
                     assemblyStatus
                     labelTemplateId
                     order {
                        isAccepted
                        isRejected
                     }
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
                           id
                           yield
                        }
                     }
                     orderSachets(order_by: { position: desc_nulls_last }) {
                        id
                        unit
                        status
                        quantity
                        position
                        isAssembled
                        isLabelled
                        isPortioned
                        ingredientName
                        processingName
                        packingStationId
                        packaging {
                           id
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
                                 id
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
                              id
                              name
                           }
                        }
                     }
                  }
               }
               orderSachets(order_by: { position: desc_nulls_last }) {
                  id
                  unit
                  status
                  quantity
                  position
                  isAssembled
                  isLabelled
                  isPortioned
                  ingredientName
                  processingName
                  orderModifierId
                  packingStationId
                  packaging {
                     id
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
                           id
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
                        id
                        name
                     }
                  }
               }
            }
         }
      `,
      READY_TO_EAT: {
         LIST: gql`
            subscription readytoeats($orderId: Int!) {
               readytoeats: orderReadyToEatProducts(
                  where: {
                     orderId: { _eq: $orderId }
                     orderModifierId: { _is_null: true }
                  }
                  order_by: { created_at: desc }
               ) {
                  id
                  isAssembled
                  hasModifiers
                  order {
                     isAccepted
                     isRejected
                  }
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
                        id
                        yield
                     }
                  }
                  orderModifiers {
                     inventoryProducts: childOrderInventoryProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        quantity
                        isAssembled
                        assemblyStatus
                        order {
                           isAccepted
                           isRejected
                        }
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
                           id
                           quantity
                           label
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                     mealKitProducts: childOrderMealKitProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        isAssembled
                        assemblyStatus
                        order {
                           isAccepted
                           isRejected
                        }
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
                              id
                              yield
                           }
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                     readyToEatProducts: childOrderReadyToEatProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        quantity
                        isAssembled
                        order {
                           isAccepted
                           isRejected
                        }
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
                              id
                              yield
                           }
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                  }
                  orderSachets(order_by: { position: desc_nulls_last }) {
                     id
                     unit
                     status
                     quantity
                     position
                     isAssembled
                     isLabelled
                     isPortioned
                     ingredientName
                     processingName
                     orderModifierId
                     packingStationId
                     packaging {
                        id
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
                              id
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
                           id
                           name
                        }
                     }
                  }
               }
            }
         `,
         ONE: gql`
            subscription orderReadyToEatProduct($id: Int!) {
               orderReadyToEatProduct(id: $id) {
                  id
                  hasModifiers
                  isAssembled
                  assemblyStatus
                  comboProduct {
                     id
                     name
                  }
                  comboProductComponent {
                     id
                     label
                  }
                  customizableProduct {
                     id
                     name
                  }
                  simpleRecipeProduct {
                     id
                     name
                  }
                  simpleRecipeProductOption {
                     id
                     simpleRecipeYield {
                        id
                        yield
                     }
                  }
               }
            }
         `,
      },
      INVENTORY: {
         LIST: gql`
            subscription inventories($orderId: Int!) {
               inventories: orderInventoryProducts(
                  where: {
                     orderId: { _eq: $orderId }
                     orderModifierId: { _is_null: true }
                  }

                  order_by: { created_at: desc }
               ) {
                  id
                  hasModifiers
                  isAssembled
                  order {
                     isAccepted
                     isRejected
                  }
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
                  inventoryProductId
                  inventoryProduct {
                     id
                     name
                  }
                  comboProductComponentId
                  comboProductComponent {
                     id
                     label
                  }
                  inventoryProductOptionId
                  inventoryProductOption {
                     id
                     quantity
                     label
                  }
                  orderSachets(order_by: { position: desc_nulls_last }) {
                     id
                     unit
                     status
                     quantity
                     position
                     isAssembled
                     isLabelled
                     isPortioned
                     ingredientName
                     processingName
                     orderModifierId
                     packingStationId
                     packaging {
                        id
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
                              id
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
                           id
                           name
                        }
                     }
                  }
                  orderModifiers {
                     inventoryProducts: childOrderInventoryProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        quantity
                        isAssembled
                        order {
                           isAccepted
                           isRejected
                        }
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
                           id
                           quantity
                           label
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                     mealKitProducts: childOrderMealKitProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        isAssembled
                        assemblyStatus
                        order {
                           isAccepted
                           isRejected
                        }
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
                              id
                              yield
                           }
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                     readyToEatProducts: childOrderReadyToEatProducts(
                        order_by: { created_at: desc }
                     ) {
                        id
                        quantity
                        isAssembled
                        order {
                           isAccepted
                           isRejected
                        }
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
                              id
                              yield
                           }
                        }
                        orderSachets(order_by: { position: desc_nulls_last }) {
                           id
                           unit
                           status
                           quantity
                           position
                           isAssembled
                           isLabelled
                           isPortioned
                           ingredientName
                           processingName
                           packingStationId
                           packaging {
                              id
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
                                    id
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
                                 id
                                 name
                              }
                           }
                        }
                     }
                  }
               }
            }
         `,
         ONE: gql`
            subscription orderInventoryProduct($id: Int!) {
               orderInventoryProduct(id: $id) {
                  id
                  quantity
                  hasModifiers
                  isAssembled
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
         `,
      },
      SACHET: {
         ONE: gql`
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
                  packagingId
                  packaging {
                     id
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
                           id
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
                        id
                        name
                     }
                  }
                  orderMealKitProductId
                  mealkit: orderMealKitProduct {
                     id
                     order {
                        isAccepted
                        isRejected
                     }
                  }
                  orderReadyToEatProductId
                  readyToEat: orderReadyToEatProduct {
                     id
                     order {
                        isAccepted
                        isRejected
                     }
                  }
                  orderInventoryProductId
                  inventory: orderInventoryProduct {
                     id
                     order {
                        isAccepted
                        isRejected
                     }
                  }
               }
            }
         `,
         MULTIPLE: gql`
            subscription sachets($where: order_cartItemView_bool_exp!) {
               sachets: order_cartItemView(
                  where: $where
                  order_by: { position: desc, created_at: desc }
               ) {
                  id
                  position
                  stationId
                  isAssembled
                  packingStatus
                  displayName
                  displayUnit
                  displayBulkDensity
                  displayUnitQuantity
                  supplierItemId
                  supplierItem {
                     id
                     supplierItemName
                  }
                  operationConfigId
                  operationConfig {
                     id
                     stationId
                     station {
                        id
                        name
                     }
                     labelTemplateId
                     labelTemplate {
                        id
                        name
                     }
                     packagingId
                     packaging {
                        id
                        name
                     }
                  }
               }
            }
         `,
      },
   },
   ORDERS: {
      LIST: gql`
         subscription orders(
            $limit: Int
            $offset: Int
            $where: order_order_bool_exp = {}
         ) {
            orders(
               limit: $limit
               offset: $offset
               order_by: { created_at: desc }
               where: $where
            ) {
               id
               tax
               discount
               itemTotal
               amountPaid
               created_at
               isAccepted
               isRejected
               deliveryPrice
               transactionId
               fulfillmentType
               thirdPartyOrderId
               thirdPartyOrder {
                  id
                  source
                  thirdPartyOrderId
                  products: parsedData(path: "items")
               }
               brand {
                  id
                  onDemandName: onDemandSettings(
                     where: {
                        onDemandSetting: { identifier: { _eq: "Brand Name" } }
                     }
                  ) {
                     name: value(path: "name")
                  }
                  onDemandLogo: onDemandSettings(
                     where: {
                        onDemandSetting: { identifier: { _eq: "Brand Logo" } }
                     }
                  ) {
                     url: value(path: "url")
                  }
                  subscriptionSettings: subscriptionStoreSettings(
                     where: {
                        subscriptionStoreSetting: {
                           identifier: { _eq: "theme-brand" }
                        }
                     }
                  ) {
                     name: value(path: "name")
                     logo: value(path: "logo.url")
                  }
               }
               cartId
               cart {
                  id
                  status
                  orderStatus {
                     title
                  }
                  isTest
                  source
                  address
                  transactionId
                  paymentStatus
                  fulfillmentInfo
                  customer: customerInfo
                  orderItems_aggregate(
                     where: { levelType: { _eq: "orderItem" } }
                  ) {
                     aggregate {
                        count
                     }
                     nodes {
                        id
                        isAssembled
                        assemblyStatus
                        displayName
                        displayImage
                        parent {
                           productOptionId
                           productOption {
                              id
                              type
                           }
                        }
                        totalSachets: childs_aggregate {
                           aggregate {
                              count
                           }
                        }
                        packedSachets: childs_aggregate(
                           where: { packingStatus: { _eq: "COMPLETED" } }
                        ) {
                           aggregate {
                              count
                           }
                        }
                        assembledSachets: childs_aggregate(
                           where: { isAssembled: { _eq: true } }
                        ) {
                           aggregate {
                              count
                           }
                        }
                     }
                  }
               }
            }
         }
      `,
      AGGREGATE: {
         BY_AMOUNT: gql`
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
         `,
         BY_STATUS: gql`
            subscription orderByStatus {
               orderByStatus: order_orderStatusEnum(order_by: { index: asc }) {
                  value
                  title
                  orders: orders_aggregate(
                     where: {
                        _or: [
                           { isRejected: { _eq: false } }
                           { isRejected: { _is_null: true } }
                        ]
                     }
                  ) {
                     aggregate {
                        count
                        sum {
                           amountPaid
                        }
                        avg {
                           amountPaid
                        }
                     }
                  }
               }
            }
         `,
         TOTAL: gql`
            subscription orders($where: order_order_bool_exp = {}) {
               orders: ordersAggregate(where: $where) {
                  aggregate {
                     count
                     sum {
                        amountPaid
                     }
                     avg {
                        amountPaid
                     }
                  }
               }
            }
         `,
         CANCELLED: gql`
            subscription orders {
               orders: ordersAggregate(where: { isRejected: { _eq: true } }) {
                  aggregate {
                     count
                     sum {
                        amountPaid
                     }
                     avg {
                        amountPaid
                     }
                  }
               }
            }
         `,
      },
   },
   DELIVERY: {
      SERVICE: gql`
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
      `,
      SERVICES: gql`
         query deliveryServices {
            deliveryServices(where: { isActive: { _eq: true } }) {
               id
               logo
               companyName
               isThirdParty
               partnershipId
            }
         }
      `,
   },
   NOTIFICATION: {
      LIST: gql`
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
      `,
      NEW: gql`
         subscription displayNotifications {
            displayNotifications(where: { type: { app: { _eq: "Order" } } }) {
               type {
                  audioUrl
               }
            }
         }
      `,
   },
   STATIONS: {
      ONE: gql`
         query station($id: Int!) {
            station(id: $id) {
               id
               name
            }
         }
      `,
      LIST: gql`
         subscription stations {
            stations {
               id
               title: name
            }
         }
      `,
      BY_USER: gql`
         subscription stations($email: String_comparison_exp!) {
            stations(where: { assignedUsers: { user: { email: $email } } }) {
               id
               name
               defaultKotPrinterId
               defaultKotPrinter {
                  name
                  state
                  printNodeId
               }
               defaultLabelPrinterId
               defaultLabelPrinter {
                  name
                  state
                  printNodeId
               }
               defaultScaleId
               defaultScale {
                  id
                  active
                  deviceNum
                  deviceName
               }
               attachedLabelPrinters {
                  printNodeId
                  labelPrinter {
                     name
                     state
                     printNodeId
                  }
               }
               attachedKotPrinters {
                  printNodeId
                  kotPrinter {
                     name
                     state
                     printNodeId
                  }
               }
               assignedScales {
                  id
                  active
                  deviceNum
                  deviceName
               }
            }
         }
      `,
   },
   PLANNED: {
      PRODUCTS: {
         INVENTORY: {
            LIST: gql`
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
                              where: {
                                 order: $order
                                 isAssembled: { _eq: true }
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
            `,
            ONE: gql`
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
                              sachets: orderSachets(
                                 where: {
                                    orderInventoryProduct: { order: $order }
                                 }
                              ) {
                                 id
                                 unit
                                 status
                                 quantity
                                 isAssembled
                                 isLabelled
                                 isPortioned
                                 ingredientName
                                 processingName
                                 packaging {
                                    id
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
                                          id
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
                                       id
                                       name
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            `,
         },
         READY_TO_EAT: {
            LIST: gql`
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
                              where: {
                                 order: $order
                                 isAssembled: { _eq: true }
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
            `,
            ONE: gql`
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
                              sachets: orderSachets(
                                 where: {
                                    orderReadyToEatProduct: { order: $order }
                                 }
                              ) {
                                 id
                                 unit
                                 status
                                 quantity
                                 isAssembled
                                 isLabelled
                                 isPortioned
                                 ingredientName
                                 processingName
                                 packaging {
                                    id
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
                                          id
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
                                       id
                                       name
                                    }
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            `,
            SACHET: {
               LIST: gql`
                  subscription ingredients($order: order_order_bool_exp = {}) {
                     ingredients: ingredientsAggregate(
                        where: {
                           ingredientSachets: {
                              orderSachets: {
                                 orderReadyToEatProduct: { order: $order }
                              }
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
                                    orderSachets: {
                                       orderReadyToEatProduct: { order: $order }
                                    }
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
                                          orderReadyToEatProduct: {
                                             order: $order
                                          }
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
                                          where: {
                                             orderReadyToEatProduct: {
                                                order: $order
                                             }
                                          }
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
                                             orderReadyToEatProduct {
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
                                             orderReadyToEatProduct: {
                                                order: $order
                                             }
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
            },
         },
         MEAL_KIT: {
            LIST: gql`
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
                              where: {
                                 order: $order
                                 isAssembled: { _eq: true }
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
            `,
            ONE: gql`
               subscription simpleRecipeProduct(
                  $id: Int!
                  $order: order_order_bool_exp = {}
               ) {
                  simpleRecipeProduct(id: $id) {
                     id
                     name
                     products: orderMealKitProducts_aggregate(
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
            SACHET: {
               LIST: gql`
                  subscription ingredients($order: order_order_bool_exp = {}) {
                     ingredients: ingredientsAggregate(
                        where: {
                           ingredientSachets: {
                              orderSachets: {
                                 orderMealKitProduct: { order: $order }
                              }
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
                                    orderSachets: {
                                       orderMealKitProduct: { order: $order }
                                    }
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
                                       quantity
                                       allOrderSachets: orderSachets_aggregate(
                                          where: {
                                             orderMealKitProduct: {
                                                order: $order
                                             }
                                          }
                                       ) {
                                          aggregate {
                                             count(columns: id)
                                             sum {
                                                quantity
                                             }
                                          }
                                          nodes {
                                             id
                                             quantity
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
                                             orderMealKitProduct: {
                                                order: $order
                                             }
                                             status: { _eq: "COMPLETED" }
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
               ONE: gql`
                  subscription ingredients($order: order_order_bool_exp = {}) {
                     ingredients: ingredientsAggregate(
                        where: {
                           ingredientSachets: {
                              orderSachets: {
                                 orderMealKitProduct: { order: $order }
                              }
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
                                    orderSachets: {
                                       orderMealKitProduct: { order: $order }
                                    }
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
                                          where: {
                                             orderMealKitProduct: {
                                                order: $order
                                             }
                                          }
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
                                             orderMealKitProduct: {
                                                order: $order
                                             }
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
            },
         },
      },
   },
   SETTINGS: {
      LIST: gql`
         subscription settings {
            settings: settings_appSettings {
               id
               app
               type
               identifier
               value
            }
         }
      `,
   },
   LABEL_TEMPLATE: {
      ONE: gql`
         query labelTemplate($id: Int!) {
            labelTemplate(id: $id) {
               id
               name
            }
         }
      `,
   },
}

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

export const QUERIES2 = {
   ORDERS_AGGREGATE: gql`
      subscription ordersAggregate {
         ordersAggregate: order_ordersAggregate {
            title
            value
            count: totalOrders
            sum: totalOrderSum
            avg: totalOrderAverage
         }
      }
   `,
}
