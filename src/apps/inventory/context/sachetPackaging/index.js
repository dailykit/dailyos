import React from 'react'

const SachetPackagingContext = React.createContext()

const state = {
   id: '',
   supplier: {},
   info: {},
   leakResistance: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_SUPPLIER':
         return { ...state, supplier: payload }

      case 'ADD_ITEM_INFO':
         return { ...state, info: { ...state.info, ...payload } }

      case 'ADD_ID':
         return { ...state, id: payload }

      case 'ADD_LEAK_RESISTANCE_INFO':
         return { ...state, leakResistance: payload }

      case 'ADD_OPACITY_INFO':
         return { ...state, packOpacity: payload }
      default:
         return state
   }
}

export { SachetPackagingContext, state, reducers }
