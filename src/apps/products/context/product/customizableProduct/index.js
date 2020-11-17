import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   meta: {
      itemType: 'inventory',
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
      default: {
         return state
      }
   }
}
