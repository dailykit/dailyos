import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   newIngredient: undefined,
   edit: undefined,
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
      case 'EDIT_INGREDIENT': {
         return {
            ...state,
            edit: payload,
         }
      }
      default:
         return state
   }
}
