import gql from 'graphql-tag'

export const INGREDIENTS_COUNT = gql`
   subscription IngredientsCount {
      ingredientsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_INGREDIENTS = gql`
   subscription Ingredients {
      ingredients(order_by: { createdAt: desc }) {
         id
         name
         category
         image
         isValid
         isPublished
         createdAt
         ingredientProcessings {
            id
            nutritionalInfo
            processingName
            ingredientSachets {
               id
               isValid
               quantity
               unit
               nutritionalInfo
               ingredient {
                  id
                  name
               }
            }
         }
         ingredientSachets {
            id
         }
      }
   }
`

export const S_INGREDIENT = gql`
   subscription Ingredient($id: Int!) {
      ingredient(id: $id) {
         id
         name
         category
         image
         isValid
         isPublished
         ingredientProcessings(order_by: { created_at: desc }) {
            id
            processingName
            nutritionalInfo
            cost
            ingredientSachets(order_by: { createdAt: desc }) {
               id
               tracking
               unit
               quantity
               nutritionalInfo
               cost
               liveModeOfFulfillment {
                  id
                  type
               }
               modeOfFulfillments(order_by: { created_at: desc }) {
                  id
                  accuracy
                  isLive
                  priority
                  cost
                  type
                  operationConfig {
                     id
                     station {
                        id
                        name
                     }
                     labelTemplate {
                        id
                        name
                     }
                  }
                  packaging {
                     id
                     name
                  }
                  bulkItem {
                     id
                     processingName
                     supplierItem {
                        id
                        name
                     }
                  }
                  sachetItem {
                     id
                     unitSize
                     unit
                     bulkItem {
                        processingName
                        supplierItem {
                           id
                           name
                        }
                     }
                  }
               }
            }
         }
         ingredientSachets {
            id
         }
      }
   }
`

export const RECIPES_COUNT = gql`
   subscription RecipesCount {
      simpleRecipesAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_RECIPES = gql`
   subscription SimpleRecipes {
      simpleRecipes {
         id
         name
         author
         cookingTime
         isValid
         isPublished
         simpleRecipeYields {
            id
         }
      }
   }
`

export const S_RECIPE = gql`
   subscription SimpleRecipe($id: Int!) {
      simpleRecipe(id: $id) {
         id
         name
         image
         isValid
         isPublished
         author
         type
         description
         cookingTime
         cuisine
         utensils
         procedures
         ingredients
         simpleRecipeYields {
            id
            yield
            cost
            nutritionalInfo
            ingredientSachets {
               isVisible
               slipName
               ingredientSachet {
                  id
                  quantity
                  unit
                  ingredient {
                     id
                  }
                  ingredientProcessing {
                     id
                  }
               }
            }
         }
      }
   }
`

export const FETCH_PROCESSING_NAMES = gql`
   subscription MasterProcessings {
      masterProcessings {
         id
         title: name
      }
   }
`

export const FETCH_UNITS = gql`
   subscription Units {
      units {
         id
         title: name
      }
   }
`

export const FETCH_STATIONS = gql`
   subscription Stations {
      stations {
         id
         title: name
      }
   }
`

export const FETCH_PACKAGINGS = gql`
   subscription Packagings {
      packagings {
         id
         title: name
      }
   }
`

export const FETCH_LABEL_TEMPLATES = gql`
   subscription LabelTemplates {
      labelTemplates {
         id
         title: name
      }
   }
`

export const SRP_COUNT = gql`
   subscription {
      simpleRecipeProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const IP_COUNT = gql`
   subscription {
      inventoryProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const CUP_COUNT = gql`
   subscription {
      customizableProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const COP_COUNT = gql`
   subscription {
      comboProductsAggregate {
         aggregate {
            count
         }
      }
   }
`

export const S_ACCOMPANIMENT_TYPES = gql`
   subscription {
      accompaniments {
         id
         title: name
      }
   }
`

export const S_SIMPLE_RECIPE_PRODUCTS = gql`
   subscription {
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
         assets
         isValid
         isPublished
         recommendations
         tags
         description
         default
         isPopupAllowed
         simpleRecipe {
            id
            name
            image
         }
         simpleRecipeProductOptions {
            id
            isActive
            price
            type
            operationConfig {
               id
               station {
                  name
               }
               labelTemplate {
                  name
               }
            }
            simpleRecipeYield {
               id
               yield
               cost
            }
            modifier {
               id
               name
               data
            }
         }
      }
   }
`

export const S_INVENTORY_PRODUCTS = gql`
   subscription {
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
         assets
         recommendations
         isValid
         isPublished
         tags
         description
         default
         isPopupAllowed
         supplierItem {
            id
            name
            unitSize
            unit
            bulkItemAsShipped {
               image
            }
         }
         sachetItem {
            id
            unitSize
            unit
            bulkItem {
               image
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
            operationConfig {
               id
               station {
                  name
               }
               labelTemplate {
                  name
               }
            }
            modifier {
               id
               name
               data
            }
         }
      }
   }
`

export const S_CUSTOMIZABLE_PRODUCTS = gql`
   subscription {
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
         assets
         isPopupAllowed
         customizableProductOptions {
            id
            inventoryProduct {
               id
               name
               assets
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
               assets
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

export const S_COMBO_PRODUCTS = gql`
   subscription {
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
         assets
         isPopupAllowed
         comboProductComponents {
            id
            label
            customizableProduct {
               id
               name
               assets
            }
            inventoryProduct {
               id
               name
               assets
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
               assets
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

export const MODIFIERS = gql`
   subscription Modifiers {
      modifiers {
         id
         title: name
         data
      }
   }
`

// used for food cost percent
export const STORE_SETTINGS = gql`
   subscription StoreSettings($type: String!) {
      storeSettings(where: { type: { _eq: $type } }) {
         value
         identifier
      }
   }
`
