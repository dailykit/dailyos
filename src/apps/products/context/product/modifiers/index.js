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
      name: {
         value: '',
         meta: {
            isValid: true,
            isTouched: false,
            errors: [],
         },
      },
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
            modifier: {
               ...state.modifier,
               name: { ...state.modifier.name, value: payload.value },
            },
         }
      }
      case 'NAME_ERROR': {
         return {
            ...state,
            modifier: {
               ...state.modifier,
               name: { ...state.modifier.name, meta: payload.meta },
            },
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
                     name: {
                        value: '',
                        meta: {
                           isValid: true,
                           isTouched: false,
                           errors: [],
                        },
                     },
                     type: { value: 'single' },
                     isActive: { value: true },
                     isRequired: { value: true },
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
      case 'CATEGORY_VALUE': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index] = {
            ...updatedCategories[payload.index],
            [payload.field]: {
               ...updatedCategories[payload.index][payload.field],
               value: payload.value,
            },
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_ERROR': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index] = {
            ...updatedCategories[payload.index],
            [payload.field]: {
               ...updatedCategories[payload.index][payload.field],
               meta: payload.meta,
            },
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_LIMIT_VALUE': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].limits[payload.field] = {
            ...updatedCategories[payload.index].limits[payload.field],
            value: payload.value,
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'CATEGORY_LIMIT_ERROR': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].limits[payload.field] = {
            ...updatedCategories[payload.index].limits[payload.field],
            meta: payload.meta,
         }
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
         updatedCategories[payload.index][payload.field].value = payload.value
         if (
            payload.field === 'isRequired' &&
            payload.value &&
            updatedCategories[payload.index].type.value === 'multiple' &&
            updatedCategories[payload.index].limits.min.value == 0
         ) {
            updatedCategories[payload.index].limits.min = {
               value: 1,
               meta: { isTouched: true, isValid: true, errors: [] },
            }
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
         updatedCategories[payload.index].type.value = payload.value
         if (payload.value === 'multiple') {
            updatedCategories[payload.index].limits = {
               min: {
                  value: 1,
                  meta: { isValid: true, isTouched: false, errors: [] },
               },
               max: {
                  value: 1,
                  meta: { isValid: true, isTouched: false, errors: [] },
               },
               free: {
                  value: 2,
                  meta: { isValid: true, isTouched: false, errors: [] },
               },
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
      case 'OPTION_VALUE': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].options[payload.optionIndex] = {
            ...updatedCategories[payload.index].options[payload.optionIndex],
            [payload.field]: {
               ...updatedCategories[payload.index].options[payload.optionIndex][
                  payload.field
               ],
               value: payload.value,
            },
         }
         return {
            ...state,
            modifier: {
               ...state.modifier,
               categories: updatedCategories,
            },
         }
      }
      case 'OPTION_ERROR': {
         const updatedCategories = state.modifier.categories
         updatedCategories[payload.index].options[payload.optionIndex] = {
            ...updatedCategories[payload.index].options[payload.optionIndex],
            [payload.field]: {
               ...updatedCategories[payload.index].options[payload.optionIndex][
                  payload.field
               ],
               meta: payload.meta,
            },
         }
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
               name: {
                  value: '',
                  meta: {
                     isValid: true,
                     isTouched: false,
                     errors: [],
                  },
               },
               categories: [],
            },
         }
      }
      default:
         return state
   }
}
