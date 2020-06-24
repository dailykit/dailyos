import gql from 'graphql-tag'

export const RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         isValid
         isPublished
         simpleRecipeYields {
            id
            yield
         }
      }
   }
`

export const PRODUCTS = gql`
   {
      simpleRecipeProducts {
         id
         name
      }
   }
`

export const CUSTOMIZABLE_PRODUCTS = gql`
   {
      customizableProducts {
         id
         name
         default
      }
   }
`

export const COMBO_PRODUCTS = gql`
   {
      comboProducts {
         id
         name
      }
   }
`

export const COMBO_PRODUCT = gql`
   query ComboProduct($id: Int!) {
      comboProduct(id: $id) {
         id
         name
         description
         tags
         comboProductComponents {
            id
            label
            customizableProduct {
               id
               name
            }
            inventoryProduct {
               id
               name
               inventoryProductOptions {
                  id
                  label
                  price
                  quantity
               }
            }
            simpleRecipeProduct {
               id
               name
               simpleRecipeProductOptions {
                  id
                  isActive
                  price
                  type
                  simpleRecipeYield {
                     yield
                  }
               }
            }
         }
      }
   }
`

export const ACCOMPANIMENT_TYPES = gql`
   {
      accompanimentTypes {
         title
         id
      }
   }
`

export const COLLECTIONS = gql`
   {
      menuCollections {
         id
         name
         categories
         availability
      }
   }
`

export const SACHET_ITEMS = gql`
   query SachetItems {
      sachetItems {
         id
         unitSize
         unit
         bulkItem {
            processingName
            supplierItem {
               name
            }
         }
      }
   }
`

export const SUPPLIER_ITEMS = gql`
   query SupplierItems {
      supplierItems {
         id
         name
         unitSize
         unit
      }
   }
`

export const INVENTORY_PRODUCTS = gql`
   query InventoryProducts($where: onlineStore_inventoryProduct_bool_exp) {
      inventoryProducts(where: $where) {
         id
         name
         title: name
         isValid
         isPublished
      }
   }
`

export const SIMPLE_RECIPE_PRODUCTS = gql`
   query SimpleRecipeProducts(
      $where: onlineStore_simpleRecipeProduct_bool_exp
   ) {
      simpleRecipeProducts(where: $where) {
         id
         name
         title: name
         isValid
         isPublished
         simpleRecipe {
            id
            name
         }
      }
   }
`
