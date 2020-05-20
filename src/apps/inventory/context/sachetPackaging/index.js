import React from 'react'

const SachetPackagingContext = React.createContext()

const state = {
   supplier: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_SUPPLIER':
         return { ...state, supplier: payload }
      default:
         return state
   }
}

export { SachetPackagingContext, state, reducers }
