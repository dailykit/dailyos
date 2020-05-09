import gql from 'graphql-tag'

export const S_INGREDIENTS = gql`
   subscription Ingredients {
      ingredients {
         id
         name
         createdAt
         ingredientProcessings {
            id
            processingName
            ingredientSachets {
               id
               quantity
               unit
            }
         }
      }
   }
`

export const S_INGREDIENT = gql`
   subscription($id: Int!) {
      ingredient(id: $id) {
         id
         name
         ingredientProcessings {
            id
            processingName
            ingredientSachets {
               id
               tracking
               unit
               quantity
               defaultNutritionalValues
               modeOfFulfillments {
                  id
                  accuracy
                  station {
                     id
                     name
                  }
                  isLive
                  priority
                  labelTemplate {
                     id
                     name
                  }
                  packaging {
                     id
                     name
                  }
                  type
                  bulkItem {
                     id
                     processingName
                     supplierItem {
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

export const S_RECIPES = gql`
   {
      simpleRecipes {
         id
         name
         author
         cookingTime
         simpleRecipeYields {
            id
         }
      }
   }
`

export const S_RECIPE = gql`
   subscription($id: Int!) {
      simpleRecipe(id: $id) {
         id
         name
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
            ingredientSachets {
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

export const S_BULK_ITEMS = gql`
   subscription BulkItems {
      bulkItems {
         id
         processingName
         supplierItem {
            name
         }
      }
   }
`
