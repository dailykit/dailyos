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
         ingredientProcessings {
            id
            processingName
            nutritionalInfo
            cost
            ingredientSachets {
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
                  cost
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
