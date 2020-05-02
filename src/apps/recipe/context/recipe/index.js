import React from 'react'
import uniqBy from 'lodash.uniqby'

export const Context = React.createContext()

export const state = {
   name: '',
   recipeType: { id: 2, title: 'Non-Vegetarian' },
   servings: [{ id: 1, value: 4 }],
   ingredients: [],
   sachets: [],
   procedures: [],
   view: {},
   activeServing: {},
   processingsToShow: [],
   sachetsToShow: [],
   pushableState: {
      id: '',
      name: '',
      cookingTime: 0,
      utensils: '',
      description: '',
      type: 'Non-Vegetarian',
      servings: [{ size: 4, ingredients: [] }],
   },
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'RECIPE_NAME_CHANGE': {
         return {
            ...state,
            name: payload.name,
            pushableState: { ...state.pushableState, name: payload.name },
         }
      }
      case 'CHANGE_RECIPE_TYPE': {
         return {
            ...state,
            recipeType: payload,
            pushableState: { ...state.pushableState, type: payload.title },
         }
      }
      case 'ADD_SERVING': {
         const id = state.servings[state.servings.length - 1].id + 1
         return {
            ...state,
            servings: [...state.servings, { id, value: 1 }],
         }
      }
      case 'REMOVE_SERVING': {
         const servingIndexToRemove = state.servings.findIndex(
            serving =>
               serving.id === payload.id && serving.value === payload.value
         )

         const newServings = [...state.servings]
         newServings.splice(servingIndexToRemove, 1)

         if (newServings.length === 0) newServings.push({ id: 1, value: 1 })

         const forPushableState = newServings.map(serving => {
            return {
               size: parseInt(serving.value),
               ingredients: state.ingredients,
            }
         })

         return {
            ...state,
            servings: newServings,
            pushableState: {
               ...state.pushableState,
               servings: forPushableState,
            },
         }
      }
      case 'CHANGE_SERVINGS': {
         const servingId = payload.id

         const match = state.servings.find(serving => serving.id === servingId)
         const index = state.servings.findIndex(
            serving => serving.id === servingId
         )
         match.value = payload.value
         const updatedServings = [...state.servings]
         updatedServings[index] = match
         return { ...state }
      }
      case 'ADD_INGREDIENTS': {
         const ingsToAdd = payload.map(ing => {
            return {
               ...ing,
               isVisible: true,
            }
         })
         const newIngredients = [...state.ingredients, ...ingsToAdd]
         const duplicateFreeArray = uniqBy(newIngredients, 'id')
         return { ...state, ingredients: duplicateFreeArray }
      }
      case 'VISIBILITY': {
         const index = state.ingredients.findIndex(ing => ing.id === payload.id)
         const updatedIngs = state.ingredients
         updatedIngs[index].isVisible = !updatedIngs[index].isVisible
         return {
            ...state,
            ingredients: updatedIngs,
         }
      }
      case 'REFINE_SERVINGS': {
         if (state.servings.length === 1) return state
         if (state.servings[state.servings.length - 1].value === 0) {
            const newServings = [...state.servings]
            newServings.pop()
            return { ...state, servings: newServings }
         }
         return state
      }
      case 'SET_VIEW': {
         return { ...state, view: payload }
      }
      case 'ADD_PROCESSING': {
         const currentIngredient = state.ingredients.find(
            ing => ing.id === payload.ingredient.id
         )
         currentIngredient.processing = payload.processing
         state.ingredients.splice(
            state.ingredients.indexOf(state.view),
            1,
            currentIngredient
         )
         return state
      }
      case 'SET_ACTIVE_SERVING': {
         return {
            ...state,
            activeServing: { id: payload.id, value: parseInt(payload.value) },
         }
      }
      case 'ADD_SACHET': {
         const existingSachet = state.sachets.find(
            sachet =>
               sachet.ingredient.id === state.view.id &&
               sachet.serving.id === state.activeServing.id
         )

         if (existingSachet) {
            const newState = { ...state }
            newState.sachets.splice(state.sachets.indexOf(existingSachet), 1, {
               ...payload.sachet,
               ingredient: state.view,
               serving: state.activeServing,
            })

            return newState
         }
         return {
            ...state,
            sachets: [
               ...state.sachets,
               {
                  ...payload.sachet,
                  ingredient: state.view,
                  serving: state.activeServing,
               },
            ],
         }
      }
      case 'DELETE_INGREDIENT': {
         const newState = { ...state }
         const sachetsBelongingToIngredient = newState.sachets.filter(
            sachet => sachet.ingredient.id === payload.id
         )

         sachetsBelongingToIngredient.forEach(sachet => {
            newState.sachets.splice(newState.sachets.indexOf(sachet), 1)
         })

         const newPushableServings = newState.pushableState.servings.map(
            serving => {
               const newSachets = serving.sachets.filter(
                  sachet => !sachet === sachet.id
               )
               return { ...serving, sachets: newSachets }
            }
         )

         newState.ingredients.splice(newState.ingredients.indexOf(payload), 1)

         return {
            ...newState,
            activeServing: {},
            view: {},
            pushableState: {
               ...state.pushableState,
               ingredients: newState.ingredients.map(ing => ({
                  ingredient: ing.id,
                  processing: ing.processing.id,
               })),
               servings: newPushableServings,
            },
         }
      }
      case 'ADD_PROCEDURE': {
         return {
            ...state,
            procedures: [...state.procedures, { title: '', steps: [] }],
         }
      }
      case 'ADD_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.push({
            title: '',
            isVisible: true,
            description: '',
         })
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'PROCEDURE_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].title = payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_PROCEDURE': {
         const updatedProcedures = state.procedures
         updatedProcedures.splice(payload.index, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_TITLE': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].title =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_VISIBILITY': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible = !updatedProcedures[payload.index].steps[
            payload.stepIndex
         ].isVisible
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'STEP_DESCRIPTION': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps[payload.stepIndex].description =
            payload.value
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      case 'DELETE_STEP': {
         const updatedProcedures = state.procedures
         updatedProcedures[payload.index].steps.splice(payload.stepIndex, 1)
         return {
            ...state,
            procedures: updatedProcedures,
         }
      }
      // Pushable
      case 'ADD_SERVINGS_FOR_PUSHABLE': {
         const pushableServings = state.servings.map(serving => {
            return {
               size: parseInt(serving.value),
            }
         })

         pushableServings.forEach((serving, index) => {
            if (state.pushableState.servings[index]?.sachets.length > 0) {
               serving.sachets = state.pushableState.servings[index]?.sachets
            } else {
               serving.sachets = []
            }
         })

         console.log(pushableServings)
         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               servings: pushableServings,
            },
         }
      }
      case 'ADD_INGREDIENTS_FOR_PUSHABLE': {
         const ingredients = payload.map(ingredient => {
            return { ingredient: ingredient.id }
         })
         ingredients.forEach((ingredient, index) => {
            if (state.pushableState.ingredients[index]?.processing) {
               ingredient.processing =
                  state.pushableState.ingredients[index].processing
            }
         })
         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               ingredients,
            },
         }
      }
      case 'ADD_PROCESSING_FOR_PUSHABLE': {
         // form an array of ingredients with the ingredient in the view with processing id
         const newIngs = [...state.ingredients].map(ing => ({
            ingredient: ing.id,
         }))

         const indexOfActiveIng = newIngs.findIndex(
            ing => ing.ingredient === state.view.id
         )

         newIngs[indexOfActiveIng].processing = payload.id

         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               ingredients: newIngs,
            },
         }
      }
      case 'ADD_SACHET_FOR_PUSHABLE':
         const newServingsWithSachets = [...state.pushableState.servings]
         const servingIdForPushable = newServingsWithSachets.findIndex(
            serving => serving.size === state.activeServing.value
         )

         const serving = newServingsWithSachets[servingIdForPushable]

         const sachet = serving?.sachets?.find(sachet => sachet === payload.id)

         const newArrayOfSachets = Array.isArray(serving?.sachets)
            ? [...serving.sachets, payload.id]
            : [payload.id]

         if (!sachet) {
            newServingsWithSachets.splice(servingIdForPushable, 1, {
               size: parseInt(state.activeServing.value),
               sachets: newArrayOfSachets,
            })
         }

         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               servings: newServingsWithSachets,
            },
         }

      case 'POPULATE_PUSHABLE':
         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               id: payload.id,
               name: payload.name,
            },
         }
      case 'ADD_RECIPE_META':
         const { cookingTime, description, utensils } = payload
         return {
            ...state,
            pushableState: {
               ...state.pushableState,
               cookingTime: parseInt(cookingTime),
               description,
               utensils,
            },
         }

      case 'POPULATE_STATE':
         console.log('calling POPULATE_STATE', payload.recipe)
         const {
            name,
            type,
            id: recipeId,
            description: recipeDescription,
            utensils: recipeUtensils,
            cookingTime: recipeCookingTime,
            servings: recipeServings,
            ingredients: recipeIngredients,
            procedures: recipeProcedures,
         } = payload.recipe

         const mappedRecipeType = payload.recipeTypeOptions.find(
            recipeType => recipeType.title === type
         )

         const mappedServings = recipeServings.map((serving, i) => ({
            id: i + 1,
            value: serving.size,
         }))

         if (mappedServings.length === 0) {
            mappedServings.push({ id: 1, value: 4 })
         }

         // const stateSachets = recipeServings.map((serving, i) => {
         //    let ing = {}
         //    let sachetId = ''
         //    let sachetTitle = ``
         //    serving.ingredients.forEach(ingredient => {
         //       ing = { ...ingredient.ingredient }
         //       sachetId = ingredient.sachet.id
         //       sachetTitle = `${ingredient.sachet.quantity.value} ${ingredient.sachet.quantity.unit.title}`
         //    })

         //    const dependentServing = { id: i + 1, value: serving.size }

         //    return {
         //       ingredient: ing,
         //       id: sachetId,
         //       title: sachetTitle,
         //       serving: dependentServing
         //    }
         // })

         const stateSachets = recipeServings
            .map((serving, i) => {
               const sachets = serving.sachets.map(sachet => {
                  return {
                     id: sachet.id,
                     title: `${sachet.quantity.value} ${sachet.quantity.unit.title}`,
                     ingredient: sachet.ingredient,
                     serving: { id: i + 1, value: serving.size },
                  }
               })

               return sachets
            })
            .flat()

         return {
            ...state,
            name,
            recipeType: mappedRecipeType,
            servings: mappedServings,
            sachets: stateSachets,
            ingredients: recipeIngredients.map(
               ({
                  ingredient: { id, name },
                  processing: { id: processingId, name: processingName },
               }) => ({
                  id,
                  title: name,
                  processing: { id: processingId, title: processingName.title },
               })
            ),
            // sachets: stateSachets,
            procedures:
               recipeProcedures.length > 0
                  ? recipeProcedures.map(({ name, steps }) => ({
                       name,
                       steps: steps.map(({ title, description }) => ({
                          title,
                          description,
                       })),
                    }))
                  : [
                       {
                          name: 'Step 1',
                          steps: [
                             {
                                title: '',
                                description: '',
                                // images: [{ caption: String, url: String }],
                                // video: { caption: String, url: String }
                             },
                          ],
                       },
                    ],
            pushableState: {
               ...state.pushableState,
               name,
               id: recipeId,
               description: recipeDescription,
               utensils: recipeUtensils,
               cookingTime: recipeCookingTime,
               servings: recipeServings.map(({ size, sachets }) => ({
                  size,
                  sachets: sachets.map(({ id }) => id),
               })),
               ingredients: recipeIngredients.map(
                  ({ ingredient, processing }) => ({
                     ingredient: ingredient.id,
                     processing: processing?.id,
                  })
               ),
            },
         }

      case 'ADD_SECTION_TITLE':
         const procedures = [...state.procedures]
         procedures[payload.index].name = payload.name
         return {
            ...state,
            procedures,
         }
      case 'CREATE_STEP':
         const newSteps = [...state.procedures]
         newSteps[0].steps.push({
            title: '',
            description: '',
            // images: [{ caption: String, url: String }],
            // video: { caption: String, url: String }
         })
         return {
            ...state,
            procedures: newSteps,
         }

      case 'REMOVE_PROCEDURE':
         const newProcedures = [...state.procedures]
         newProcedures.splice(payload.index, 1)
         return { ...state, procedures: newProcedures }

      default:
         return state
   }
}
