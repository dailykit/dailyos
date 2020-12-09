import gql from 'graphql-tag'

export const QUERIES = {
   ORDER: {
      DETAILS: gql`
         subscription order(
            $id: oid!
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
               isAccepted
               isRejected
               deliveryPrice
               transactionId
               fulfillmentType
               total_mealkits: orderMealKitProducts_aggregate(
                  where: { assemblyStationId: $assemblyStationId }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               packed_mealkits: orderMealKitProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     assemblyStatus: { _eq: "COMPLETED" }
                  }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               assembled_mealkits: orderMealKitProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     isAssembled: { _eq: true }
                  }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }

               total_readytoeats: orderReadyToEatProducts_aggregate(
                  where: { assemblyStationId: $assemblyStationId }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               packed_readytoeats: orderReadyToEatProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     assemblyStatus: { _eq: "COMPLETED" }
                  }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               assembled_readytoeats: orderReadyToEatProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     isAssembled: { _eq: true }
                  }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }

               total_inventories: orderInventoryProducts_aggregate(
                  where: { assemblyStationId: $assemblyStationId }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               packed_inventories: orderInventoryProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     assemblyStatus: { _eq: "COMPLETED" }
                  }
               ) {
                  aggregate {
                     count(columns: id)
                  }
               }
               assembled_inventories: orderInventoryProducts_aggregate(
                  where: {
                     assemblyStationId: $assemblyStationId
                     isAssembled: { _eq: true }
                  }
               ) {
                  aggregate {
                     count(columns: id)
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
            order_orderStatusEnum {
               value
            }
         }
      `,
      MEALKITS: gql`
         subscription mealkits(
            $orderId: Int!
            $packingStationId: Int_comparison_exp = {}
            $assemblyStationId: Int_comparison_exp = {}
         ) {
            mealkits: orderMealKitProducts(
               where: {
                  orderId: { _eq: $orderId }
                  assemblyStationId: $assemblyStationId
                  orderModifierId: { _is_null: true }
               }
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
                  inventoryProducts: childOrderInventoryProducts {
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
                     orderSachets(
                        where: { packingStationId: $packingStationId }
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
                  mealKitProducts: childOrderMealKitProducts {
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
                     orderSachets(
                        where: { packingStationId: $packingStationId }
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
                  readyToEatProducts: childOrderReadyToEatProducts {
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
                     orderSachets(
                        where: { packingStationId: $packingStationId }
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
               orderSachets(where: { packingStationId: $packingStationId }) {
                  id
                  unit
                  status
                  quantity
                  isAssembled
                  isLabelled
                  isPortioned
                  ingredientName
                  processingName
                  orderModifierId
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
            subscription readytoeats(
               $orderId: Int!
               $packingStationId: Int_comparison_exp = {}
               $assemblyStationId: Int_comparison_exp = {}
            ) {
               readytoeats: orderReadyToEatProducts(
                  where: {
                     orderId: { _eq: $orderId }
                     assemblyStationId: $assemblyStationId
                     orderModifierId: { _is_null: true }
                  }
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
                     inventoryProducts: childOrderInventoryProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
                     mealKitProducts: childOrderMealKitProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
                     readyToEatProducts: childOrderReadyToEatProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
                  orderSachets(where: { packingStationId: $packingStationId }) {
                     id
                     unit
                     status
                     quantity
                     isAssembled
                     isLabelled
                     isPortioned
                     ingredientName
                     processingName
                     orderModifierId
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
            subscription inventories(
               $orderId: Int!
               $packingStationId: Int_comparison_exp = {}
               $assemblyStationId: Int_comparison_exp = {}
            ) {
               inventories: orderInventoryProducts(
                  where: {
                     orderId: { _eq: $orderId }
                     assemblyStationId: $assemblyStationId
                     orderModifierId: { _is_null: true }
                  }
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
                  orderSachets(where: { packingStationId: $packingStationId }) {
                     id
                     unit
                     status
                     quantity
                     isAssembled
                     isLabelled
                     isPortioned
                     ingredientName
                     processingName
                     orderModifierId
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
                     inventoryProducts: childOrderInventoryProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
                     mealKitProducts: childOrderMealKitProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
                     readyToEatProducts: childOrderReadyToEatProducts {
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
                        orderSachets(
                           where: { packingStationId: $packingStationId }
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
               order_by: { isAccepted: desc, updated_at: desc }
               where: $where
            ) {
               id
               created_at
               orderStatus
               paymentStatus
               tax
               discount
               itemTotal
               amountPaid
               deliveryPrice
               isAccepted
               isRejected
               transactionId
               fulfillmentType
               restaurant: deliveryInfo(path: "pickup.pickupInfo")
               customer: deliveryInfo(path: "dropoff.dropoffInfo")
               pickupWindow: deliveryInfo(path: "pickup.window")
               dropoffWindow: deliveryInfo(path: "dropoff.window")
               customer: deliveryInfo(path: "dropoff.dropoffInfo")
               deliveryCompany: deliveryInfo(path: "deliveryCompany")
               orderMealKitProducts(
                  where: { orderModifierId: { _is_null: true } }
               ) {
                  id
                  price
                  isAssembled
                  assemblyStatus
                  assemblyStation {
                     id
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
                  orderSachets(where: { orderModifierId: { _is_null: true } }) {
                     id
                     status
                     isAssembled
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
               orderReadyToEatProducts(
                  where: { orderModifierId: { _is_null: true } }
               ) {
                  id
                  price
                  isAssembled
                  assemblyStatus
                  simpleRecipeProduct {
                     id
                     name
                  }
                  assemblyStation {
                     id
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
               orderInventoryProducts(
                  where: { orderModifierId: { _is_null: true } }
               ) {
                  id
                  price
                  isAssembled
                  inventoryProduct {
                     id
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
                  assemblyStation {
                     id
                     name
                  }
                  assemblyStatus
                  customizableProduct {
                     id
                     name
                  }
                  inventoryProductOption {
                     id
                     quantity
                     label
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
