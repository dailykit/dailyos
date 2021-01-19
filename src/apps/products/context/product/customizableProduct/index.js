import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   meta: {
      productType: 'inventory',
   },
   optionsMode: 'add',
   selectedOptions: [],
   optionId: undefined,
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
      case 'OPTIONS_MODE': {
         return {
            ...state,
            optionsMode: payload.type,
            selectedOptions: payload.options,
            optionId: payload.optionId,
         }
      }
      default: {
         return state
      }
   }
}
