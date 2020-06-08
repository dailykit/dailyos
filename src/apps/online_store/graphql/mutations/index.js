import gql from 'graphql-tag'

export const CREATE_INVENTORY_PRODUCT = gql`
   mutation CreateInventoryProduct(
      $objects: [onlineStore_inventoryProduct_insert_input!]!
   ) {
      createInventoryProduct(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_INVENTORY_PRODUCTS = gql`
   mutation DeleteInventoryProducts($ids: [Int!]!) {
      deleteInventoryProduct(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_INVENTORY_PRODUCT = gql`
   mutation UpdateInventoryProduct(
      $id: Int!
      $set: onlineStore_inventoryProduct_set_input
   ) {
      updateInventoryProduct(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_INVENTORY_PRODUCT_OPTIONS = gql`
   mutation CreateInventoryProductOptions(
      $objects: [onlineStore_inventoryProductOption_insert_input!]!
   ) {
      createInventoryProductOption(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_INVENTORY_PRODUCT_OPTION = gql`
   mutation UpdateInventoryProductOption(
      $id: Int
      $set: onlineStore_inventoryProductOption_set_input
   ) {
      updateInventoryProductOption(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_INVENTORY_PRODUCT_OPTION = gql`
   mutation DeleteInventoryProductOption($id: Int_comparison_exp) {
      deleteInventoryProductOption(where: { id: $id }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_PRODUCT = gql`
   mutation CreateSimpleRecipeProduct(
      $objects: [onlineStore_simpleRecipeProduct_insert_input!]!
   ) {
      createSimpleRecipeProduct(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_PRODUCTS = gql`
   mutation DeleteSimpleRecipeProducts($ids: [Int!]!) {
      deleteSimpleRecipeProduct(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_SIMPLE_RECIPE_PRODUCT = gql`
   mutation UpdateSimpleRecipeProduct(
      $id: Int!
      $set: onlineStore_simpleRecipeProduct_set_input
   ) {
      updateSimpleRecipeProduct(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_PRODUCT_OPTIONS = gql`
   mutation CreateSimpleRecipeProductOption(
      $objects: [onlineStore_simpleRecipeProductOption_insert_input!]!
   ) {
      createSimpleRecipeProductOption(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_SIMPLE_RECIPE_PRODUCT_OPTION = gql`
   mutation UpdateSimpleRecipeProductOption(
      $id: Int
      $set: onlineStore_simpleRecipeProductOption_set_input
   ) {
      updateSimpleRecipeProductOption(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_PRODUCT_OPTIONS = gql`
   mutation DeleteSimpleRecipeProductOptions($ids: [Int!]!) {
      deleteSimpleRecipeProductOption(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_CUSTOMIZABLE_PRODUCT = gql`
   mutation CreateCustomizableProduct(
      $objects: [onlineStore_customizableProduct_insert_input!]!
   ) {
      createCustomizableProduct(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_CUSTOMIZABLE_PRODUCTS = gql`
   mutation DeleteCustomizableProducts($ids: [Int!]!) {
      deleteCustomizableProduct(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_CUSTOMIZABLE_PRODUCT = gql`
   mutation UpdateCustomizableProduct(
      $id: Int
      $set: onlineStore_customizableProduct_set_input
   ) {
      updateCustomizableProduct(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_CUSTOMIZABLE_PRODUCT_OPTIONS = gql`
   mutation CreateCustomizableProductOption(
      $objects: [onlineStore_customizableProductOption_insert_input!]!
   ) {
      createCustomizableProductOption(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_CUSTOMIZABLE_PRODUCT_OPTION = gql`
   mutation DeleteCustomizableProductOption($id: Int) {
      deleteCustomizableProductOption(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_COMBO_PRODUCT = gql`
   mutation CreateComboProduct(
      $objects: [onlineStore_comboProduct_insert_input!]!
   ) {
      createComboProduct(objects: $objects) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_COMBO_PRODUCTS = gql`
   mutation DeleteComboProducts($ids: [Int!]!) {
      deleteComboProduct(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_COMBO_PRODUCT = gql`
   mutation UpdateComboProduct(
      $id: Int!
      $set: onlineStore_comboProduct_set_input
   ) {
      updateComboProduct(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

// {comboProductId: 10, label: ""}
export const CREATE_COMBO_PRODUCT_COMPONENT = gql`
   mutation CreateComboProductComponent(
      $objects: [onlineStore_comboProductComponent_insert_input!]!
   ) {
      createComboProductComponent(objects: $objects) {
         returning {
            id
         }
      }
   }
`

// {id: {_eq: 10}}, _set: {customizableProductId: 10, inventoryProductId: 10, simpleRecipeProductId: 10}
export const UPDATE_COMBO_PRODUCT_COMPONENT = gql`
   mutation UpdateComboProductComponent(
      $id: Int!
      $set: onlineStore_comboProductComponent_set_input
   ) {
      updateComboProductComponent(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_COMBO_PRODUCT_COMPONENT = gql`
   mutation DeleteComboProductComponent($id: Int!) {
      deleteComboProductComponent(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_COLLECTION = gql`
   mutation CreateCollection($name: String!, $availability: jsonb) {
      createMenuCollection(
         objects: { name: $name, availability: $availability }
      ) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_COLLECTIONS = gql`
   mutation DeleteCollections($ids: [Int!]!) {
      deleteMenuCollection(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_COLLECTION = gql`
   mutation UpdateCollection(
      $id: Int!
      $set: onlineStore_menuCollection_set_input
   ) {
      updateMenuCollection(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_STORE_SETTING = gql`
   mutation UpdateStoreSetting(
      $type: String!
      $identifier: String!
      $value: jsonb!
   ) {
      updateStoreSetting(
         where: { type: { _eq: $type }, identifier: { _eq: $identifier } }
         _set: { value: $value }
      ) {
         returning {
            value
         }
      }
   }
`

export const CREATE_RECURRENCE = gql`
   mutation createRecurrence($object: fulfilment_recurrence_insert_input!) {
      createRecurrence(object: $object) {
         id
      }
   }
`

export const CREATE_TIME_SLOTS = gql`
   mutation createTimeSlot($objects: [fulfilment_timeSlot_insert_input!]!) {
      createTimeSlots(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const CREATE_MILE_RANGES = gql`
   mutation CreateMileRanges($objects: [fulfilment_mileRange_insert_input!]!) {
      createMileRanges(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const CREATE_CHARGES = gql`
   mutation Charges($objects: [fulfilment_charge_insert_input!]!) {
      createCharges(objects: $objects) {
         returning {
            id
         }
      }
   }
`
