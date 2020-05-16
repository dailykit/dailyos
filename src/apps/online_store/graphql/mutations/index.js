import gql from 'graphql-tag'

export const CREATE_PRODUCT = gql`
   mutation CreateProduct($title: String!) {
      createProduct(title: $title) {
         success
         product {
            id
         }
      }
   }
`

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
         }
      }
   }
`

// Not in use
export const UPDATE_PRODUCT = gql`
   mutation UpdateProduct($input: UpdateProductInput) {
      updateProduct(input: $input) {
         success
         product {
            id
            title
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
