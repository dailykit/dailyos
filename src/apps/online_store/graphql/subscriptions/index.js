import gql from 'graphql-tag'

export const S_ACCOMPANIMENT_TYPES = gql`
   {
      master_accompanimentType {
         id
         name
      }
   }
`

export const SRP_COUNT = gql`
   {
      simpleRecipeProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_SIMPLE_RECIPE_PRODUCTS = gql`
   {
      simpleRecipeProducts {
         id
         name
         isValid
         isPublished
         simpleRecipe {
            id
            name
         }
      }
   }
`

export const S_SIMPLE_RECIPE_PRODUCT = gql`
   subscription SimpleRecipeProduct($id: Int!) {
      simpleRecipeProduct(id: $id) {
         id
         name
         isValid
         isPublished
         accompaniments
         tags
         description
         default
         simpleRecipe {
            id
            name
         }
         simpleRecipeProductOptions {
            id
            isActive
            price
            type
            simpleRecipeYield {
               id
               yield
            }
         }
      }
   }
`

export const IP_COUNT = gql`
   {
      inventoryProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_INVENTORY_PRODUCTS = gql`
   {
      inventoryProducts {
         id
         name
         isValid
         isPublished
      }
   }
`

export const S_INVENTORY_PRODUCT = gql`
   subscription($id: Int!) {
      inventoryProduct(id: $id) {
         id
         name
         accompaniments
         isValid
         isPublished
         tags
         description
         supplierItem {
            id
            name
            unitSize
            unit
         }
         sachetItem {
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
         inventoryProductOptions {
            id
            label
            price
            quantity
         }
      }
   }
`

export const S_SACHET_ITEMS = gql`
   subscription SachetItems {
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

export const S_SUPPLIER_ITEMS = gql`
   subscription SupplierItems {
      supplierItems {
         id
         name
         unitSize
         unit
      }
   }
`

export const CUP_COUNT = gql`
   {
      customizableProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_CUSTOMIZABLE_PRODUCTS = gql`
   {
      customizableProducts {
         id
         name
         isValid
         isPublished
      }
   }
`

export const S_CUSTOMIZABLE_PRODUCT = gql`
   subscription CustomizableProduct($id: Int!) {
      customizableProduct(id: $id) {
         id
         name
         default
         isValid
         isPublished
         description
         tags
         customizableProductOptions {
            id
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
                  simpleRecipeYield {
                     yield
                  }
                  type
               }
            }
         }
      }
   }
`

export const COP_COUNT = gql`
   {
      comboProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_COMBO_PRODUCTS = gql`
   {
      comboProducts {
         id
         name
         isValid
         isPublished
         comboProductComponents {
            id
            label
         }
      }
   }
`

export const S_COMBO_PRODUCT = gql`
   subscription ComboProduct($id: Int!) {
      comboProduct(id: $id) {
         id
         name
         description
         tags
         isValid
         isPublished
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

export const COLLECTIONS_COUNT = gql`
   subscription CollectionsCount {
      menuCollectionsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_COLLECTION = gql`
   subscription Collection($id: Int!) {
      menuCollection(id: $id) {
         id
         name
         isValid
         isPublished
         active
         availability
         categories
         store
      }
   }
`
