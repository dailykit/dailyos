import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   meta: {
      accompanimentTabIndex: 0,
      accompanimentType: '',
      productTypes: 'inventory',
   },
   edit: undefined,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'EDIT': {
         return {
            ...state,
            edit: payload,
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
