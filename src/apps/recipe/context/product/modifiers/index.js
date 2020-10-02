import React from 'react'

export const ModifiersContext = React.createContext()

export const state = {
   meta: {
      optionId: undefined,
      modifierProductType: 'inventoryProductOption',
      selectedCategoryIndex: 0,
      selectedOptionIndex: 0,
   },
   modifier: {
      id: undefined,
      name: '',
      categories: [],
   },
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'META': {
         return {
            ...state,
            meta: {
               ...state.meta,
               [payload.name]: payload.value,
            },
         }
      }
      case 'NAME': {
         return {
            ...state,
            modifier: { ...state.modifier, name: payload.value },
         }
      }
      case 'ADD_CATEGORY': {
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: [
                  ...state.modifier.categories,
                  {
                     name: '',
                     type: 'single',
                     isActive: true,
                     isRequired: true,
                     options: [],
                  },
               ],
            },
         }
      }
      case 'DELETE_CATEGORY': {
         const updatedCategories = state.modifier.categories
         updatedCategories.splice(payload.index, 1)
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_NAME': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].name = payload.value
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_LIMIT': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].limits[payload.label] = payload.value
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_FLAG': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index][payload.label] = payload.value
         console.log('reducers -> payload.label', payload.label)
         console.log('reducers -> payload.index', payload.value)
         if (
            payload.label === 'isRequired' &&
            payload.value &&
            updatedCategories[payload.index].type === 'multiple' &&
            updatedCategories[payload.index].limits.min === 0
         ) {
            updatedCategories[payload.index].limits.min = 1
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_TYPE': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].type = payload.value
         if (payload.value === 'multiple') {
            updatedCategories[payload.index].limits = {
               min: 1,
               max: 1,
               free: 2,
            }
         } else {
            delete updatedCategories[payload.index].limits
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'ADD_CATEGORY_OPTION': {
         const updatedCategories = state.modifier.categories
         updatedCategories[state.meta.selectedCategoryIndex].options = [
            ...updatedCategories[state.meta.selectedCategoryIndex].options,
            payload.option,
         ]
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'EDIT_CATEGORY_OPTION': {
         const updatedCategories = state.modifier.categories
         updatedCategories[
            payload.index || state.meta.selectedCategoryIndex
         ].options[payload.optionIndex][payload.label] = payload.value
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'DELETE_CATEGORY_OPTION': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].options.splice(payload.optionIndex, 1)
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'POPULATE': {
         return {
            ...state,
            modifier: {
               id: payload.modifier.id,
               name: payload.modifier.name,
               categories: payload.modifier.data.categories,
            },
         }
      }
      case 'RESET': {
         return {
            ...state,
            modifier: {
               id: undefined,
               name: '',
               categories: [],
            },
         }
      }
      default:
         return state
   }
}
