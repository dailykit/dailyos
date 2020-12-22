import React from 'react'

export const ComboProductContext = React.createContext()

export const state = {
   meta: {
      productType: '',
      componentId: '',
   },
   product: {},
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
      case 'PRODUCT': {
         return {
            ...state,
            product: payload.value,
         }
      }
      default: {
         return state
      }
   }
}
