import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   meta: {
      itemType: 'inventory',
   },
   productIndex: 0,

   title: '',
   tags: [],
   description: '',
   items: [],
   default: {},
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'PRODUCT_INDEX': {
         return {
            ...state,
            productIndex: payload,
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
      case 'ITEMS': {
         return {
            ...state,
            items: [...state.items, ...payload.value],
         }
      }
      case 'DEFAULT': {
         return {
            ...state,
            default: payload.value,
         }
      }
      case 'ACCOMPANIMENT_TYPES': {
         const accompaniments = payload.value.map(el => {
            return {
               type: el.title,
               products: [],
            }
         })
         const index = state.items.findIndex(
            item => item.id === state.meta.currentItem.id
         )
         const updatedItems = state.items
         updatedItems[index].accompaniments = accompaniments
         return {
            ...state,
            items: updatedItems,
            meta: {
               ...state.meta,
               accompanimentType: accompaniments[0].type,
               currentItem: updatedItems[index],
            },
         }
      }
      case 'ADD_ACCOMPANIMENTS': {
         const index = state.items.findIndex(
            item => item.id === state.meta.currentItem.id
         )
         const updatedItems = state.items
         const index2 = updatedItems[index].accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         updatedItems[index].accompaniments[index2].products = [
            ...updatedItems[index].accompaniments[index2].products,
            ...payload.value,
         ]
         return {
            ...state,
            items: updatedItems,
            meta: {
               ...state.meta,
               currentItem: updatedItems[index],
            },
         }
      }
      case 'ACCOMPANIMENT_DISCOUNT': {
         const index = state.items.findIndex(
            item => item.id === state.meta.currentItem.id
         )
         const updatedItems = state.items
         const index2 = updatedItems[index].accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         const index3 = updatedItems[index].accompaniments[
            index2
         ].products.findIndex(el => el.id === payload.id)
         updatedItems[index].accompaniments[index2].products[
            index3
         ].discount.value = payload.value
         return {
            ...state,
            items: updatedItems,
            meta: {
               ...state.meta,
               currentItem: updatedItems[index],
            },
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
      default: {
         return state
      }
   }
}
