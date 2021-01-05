import React from 'react'

export const ComboProductContext = React.createContext()

export const state = {
   meta: {
      productType: '',
      componentId: '',
   },
   optionsMode: 'add',
   selectedOptions: [],
   // this componentId is for editing
   componentId: '',
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
            componentId: payload.componentId,
         }
      }
      default: {
         return state
      }
   }
}
