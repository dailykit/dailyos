import React from 'react'

export const InventoryProductContext = React.createContext()

export const state = {
   meta: {
      productTypes: 'inventory',
      itemType: 'inventory',
      accompanimentTabIndex: 0,
   },
   title: '',
   description: '',
   tags: [],
   item: '',
   options: [],
   default: {},
   accompaniments: [],
   // New
   updating: false,
   option: undefined,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'UPDATING': {
         return {
            ...state,
            updating: payload,
         }
      }
      case 'OPTION': {
         return {
            ...state,
            option: payload,
         }
      }

      case 'TITLE': {
         return {
            ...state,
            title: payload.value,
         }
      }
      case 'DESCRIPTION': {
         return {
            ...state,
            description: payload.value,
         }
      }
      case 'TAGS': {
         return {
            ...state,
            tags: payload.value,
         }
      }
      case 'ITEM': {
         return {
            ...state,
            item: payload.value,
         }
      }
      case 'OPTIONS': {
         return {
            ...state,
            options: payload.value,
         }
      }
      case 'ADD_OPTION': {
         const updatedOptions = [
            ...state.options,
            {
               id: Math.floor(Math.random() * 100),
               title: '',
               quantity: 1,
               price: [
                  {
                     value: 0,
                     discount: 0,
                     rule: '',
                  },
               ],
            },
         ]
         return {
            ...state,
            options: updatedOptions,
            default: Object.keys(state.default).length
               ? state.default
               : { id: updatedOptions[0].id },
         }
      }
      case 'UPDATE_OPTION': {
         const updatedOptions = state.options
         const index = updatedOptions.findIndex(op => op.id === payload.id)
         const option = updatedOptions[index]
         const updatedOption = {
            ...option,
            [payload.name]: payload.value,
         }
         updatedOptions[index] = updatedOption
         return {
            ...state,
            options: updatedOptions,
         }
      }
      case 'DEFAULT': {
         return {
            ...state,
            default: {
               id: payload.id,
            },
         }
      }
      case 'ACCOMPANIMENT_TYPES': {
         const accompaniments = payload.value.map(el => {
            return {
               type: el.title,
               products: [],
            }
         })
         return {
            ...state,
            accompaniments,
            meta: {
               ...state.meta,
               accompanimentType: accompaniments[0].type,
            },
         }
      }
      case 'ADD_ACCOMPANIMENTS': {
         const index = state.accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         const updatedAccompaniments = state.accompaniments
         updatedAccompaniments[index].products = [
            ...updatedAccompaniments[index].products,
            ...payload.value,
         ]
         return {
            ...state,
            accompaniments: updatedAccompaniments,
         }
      }
      case 'ACCOMPANIMENT_DISCOUNT': {
         const index = state.accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         const updatedAccompaniments = state.accompaniments
         const updatedAccompaniment = updatedAccompaniments[index]
         const productIndex = updatedAccompaniment.products.findIndex(
            el => el.id === payload.id
         )
         updatedAccompaniment.products[productIndex].discount.value =
            payload.value
         updatedAccompaniments[index] = updatedAccompaniment
         return {
            ...state,
            accompaniments: updatedAccompaniments,
         }
      }
      case 'META': {
         return {
            ...state,
            meta: {
               ...state.meta,
               [payload.name]: payload.value,
            },
         }
      }
      default:
         return state
   }
}
