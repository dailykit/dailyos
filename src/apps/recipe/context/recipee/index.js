import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   newIngredient: undefined,
}

export const reducers = (state, { type, payload }) => {
   console.log('reducer -> type', type)
   console.log('reducer -> payload', payload)
   switch (type) {
      case 'ADD_INGREDIENT': {
         return {
            ...state,
            newIngredient: payload,
         }
      }
      default:
         return state
   }
}
