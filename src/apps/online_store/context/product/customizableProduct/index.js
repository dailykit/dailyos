import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   meta: {
      itemType: 'inventory',
   },
   productIndex: 0,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'PRODUCT_INDEX': {
         return {
            ...state,
            productIndex: payload,
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
