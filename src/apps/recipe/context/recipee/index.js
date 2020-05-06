import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   id: '',
   name: '',
}

export const reducer = ({ type, payload }) => {
   switch (type) {
      case 'NAME': {
         return {
            ...state,
            name: payload.value,
         }
      }
      default:
         return state
   }
}
