import React from 'react'

export const InventoryProductContext = React.createContext()

export const initialState = {
   meta: {
      productsType: 'inventory',
      itemType: 'inventory',
      accompanimentTabIndex: 0,
   },
   updating: false,
   option: undefined,
}

export const reducers = (state = initialState, { type, payload }) => {
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
