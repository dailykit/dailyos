import gql from 'graphql-tag'

export const CREATE_INGREDIENT = gql`
   mutation CreateIngredient($name: String) {
      createIngredient(objects: { name: $name }) {
         returning {
            id
            name
         }
      }
   }
`

export const DELETE_INGREDIENTS = gql`
   mutation DeleteIngredients($ids: [Int!]!) {
      deleteIngredient(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_INGREDIENT = gql`
   mutation UpdateIngredient($id: Int!, $set: ingredient_ingredient_set_input) {
      updateIngredient(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const CREATE_PROCESSINGS = gql`
   mutation CreateProcessings(
      $procs: [ingredient_ingredientProcessing_insert_input!]!
   ) {
      createIngredientProcessing(objects: $procs) {
         returning {
            id
            processingName
         }
      }
   }
`

export const UPDATE_PROCESSING = gql`
   mutation UpdateIngredientProcessing(
      $id: Int!
      $set: ingredient_ingredientProcessing_set_input
   ) {
      updateIngredientProcessing(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const DELETE_PROCESSING = gql`
   mutation DeleteProcessing($id: Int!) {
      deleteIngredientProcessing(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SACHET = gql`
   mutation CreateSachet(
      $objects: [ingredient_ingredientSachet_insert_input!]!
   ) {
      createIngredientSachet(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_SACHET = gql`
   mutation UpdateSachet(
      $id: Int!
      $set: ingredient_ingredientSachet_set_input
   ) {
      updateIngredientSachet(where: { id: { _eq: $id } }, _set: $set) {
         returning {
            id
         }
      }
   }
`

export const UPDATE_MODE = gql`
   mutation UpdateMode(
      $id: Int!
      $set: ingredient_modeOfFulfillment_set_input
   ) {
      updateModeOfFulfillment(pk_columns: { id: $id }, _set: $set) {
         id
      }
   }
`

export const DELETE_SACHET = gql`
   mutation DeleteSachet($id: Int!) {
      deleteIngredientSachet(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE = gql`
   mutation CreateRecipe($name: jsonb) {
      createSimpleRecipe(objects: { name: $name }) {
         returning {
            id
            name
         }
      }
   }
`
export const DELETE_SIMPLE_RECIPES = gql`
   mutation DeleteRecipes($ids: [Int!]!) {
      deleteSimpleRecipe(where: { id: { _in: $ids } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_YIELDS = gql`
   mutation CreateSimpleRecipeYields(
      $objects: [simpleRecipe_simpleRecipeYield_insert_input!]!
   ) {
      createSimpleRecipeYield(objects: $objects) {
         returning {
            id
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_YIELD = gql`
   mutation DeleteSimpleRecipeYield($id: Int!) {
      deleteSimpleRecipeYield(where: { id: { _eq: $id } }) {
         returning {
            id
         }
      }
   }
`

export const CREATE_SIMPLE_RECIPE_YIELD_SACHET = gql`
   mutation CreateSimpleRecipeSachet(
      $objects: [simpleRecipe_simpleRecipeYield_ingredientSachet_insert_input!]!
   ) {
      createSimpleRecipeSachet(objects: $objects) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const UPDATE_SIMPLE_RECIPE_YIELD_SACHET = gql`
   mutation UpdateSimpleRecipeSachet(
      $sachetId: Int!
      $yieldId: Int!
      $set: simpleRecipe_simpleRecipeYield_ingredientSachet_set_input
   ) {
      updateSimpleRecipeSachet(
         where: {
            ingredientSachetId: { _eq: $sachetId }
            recipeYieldId: { _eq: $yieldId }
         }
         _set: $set
      ) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const DELETE_SIMPLE_RECIPE_YIELD_SACHETS = gql`
   mutation DeleteSimpleRecipeSachet(
      $sachetIds: [Int!]!
      $servingIds: [Int!]!
   ) {
      deleteSimpleRecipeSachet(
         where: {
            ingredientSachetId: { _in: $sachetIds }
            simpleRecipeYield: { id: { _in: $servingIds } }
         }
      ) {
         returning {
            ingredientSachetId
         }
      }
   }
`

export const UPDATE_RECIPE = gql`
   mutation UpdateSimpleRecipe(
      $id: Int!
      $set: simpleRecipe_simpleRecipe_set_input
   ) {
      updateSimpleRecipe(where: { id: { _eq: $id } }, _set: $set) {
         returning {
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

export const CREATE_MODIFIER = gql`
   mutation CreateModifier($object: onlineStore_modifier_insert_input!) {
      createModifier(object: $object) {
         id
      }
   }
`

export const UPDATE_MODIFIER = gql`
   mutation UpdateModifier($id: Int!, $set: onlineStore_modifier_set_input) {
      updateModifier(pk_columns: { id: $id }, _set: $set) {
         id
      }
   }
`
