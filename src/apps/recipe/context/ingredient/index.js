import React from 'react'

export const IngredientContext = React.createContext()

export const state = {
   processingIndex: 0,
   sachetIndex: 0,
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'PROCESSING_INDEX': {
         return {
            ...state,
            processingIndex: payload,
            sachetIndex: 0,
         }
      }
      case 'SACHET_INDEX': {
         return {
            ...state,
            sachetIndex: payload,
         }
      }
      default:
         return state
   }
}
