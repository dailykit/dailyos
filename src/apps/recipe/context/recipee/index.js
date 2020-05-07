import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   newIngredient: undefined,
   edit: undefined,
   serving: undefined,
   sachet: undefined,
   updating: false,
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
      case 'SERVING': {
         return {
            ...state,
            serving: payload,
         }
      }
      case 'SACHET': {
         return {
            ...state,
            sachet: payload,
         }
      }
      case 'UPDATING': {
         return {
            ...state,
            updating: payload,
         }
      }
      default:
         return state
   }
}
