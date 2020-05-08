import React from 'react'

export const IngredientContext = React.createContext()

export const state = {
   processingIndex: 0,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'PROCESSING_INDEX': {
         return {
            ...state,
            processingIndex: payload,
         }
      }
      default:
         return state
   }
}
