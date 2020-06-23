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
      ingredients {
         id
         name
         image
         isValid
         isPublished
         createdAt
         ingredientProcessings {
            id
            processingName
            ingredientSachets {
               id
               isValid
               quantity
               unit
               ingredient {
                  name
               }
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
         category
         image
         isValid
         isPublished
         ingredientProcessings {
            id
            processingName
            ingredientSachets {
               id
               tracking
               unit
               quantity
               defaultNutritionalValues
               liveModeOfFulfillment {
                  id
                  type
               }
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
   subscription {
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
   subscription($id: Int!) {
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

export const FETCH_PROCESSING_NAMES = gql`
   subscription {
      masterProcessings {
         id
         title: name
      }
   }
`

export const FETCH_UNITS = gql`
   subscription {
      units {
         id
         title: name
      }
   }
`

export const FETCH_STATIONS = gql`
   subscription {
      stations {
         id
         title: name
      }
   }
`
