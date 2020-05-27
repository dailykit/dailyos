import React from 'react'

const SachetPackagingContext = React.createContext()

const state = {
   id: '',
   supplier: {},
   info: {
      packagingType: '',
      sealingType: '',
   },
   leakResistance: {},
   compressableFrom: {},
   packOpacity: {},
   type: '',
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

      case 'ADD_COMPRESSABILITY_INFO':
         return { ...state, compressableFrom: payload }
      case 'ADD_TYPE':
         return { ...state, type: payload }
      case 'ADD_PACKAGING_TYPE':
         return { ...state, info: { ...state.info, packagingType: payload } }
      case 'ADD_SEALING_TYPE':
         return { ...state, info: { ...state.info, sealingType: payload } }
      default:
         return state
   }
}

export { SachetPackagingContext, state, reducers }
