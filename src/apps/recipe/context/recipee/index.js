import React from 'react'

export const RecipeContext = React.createContext()

export const state = {
   id: '',
   name: '',
   type: '',
   cuisine: '',
   cookingTime: '',
   author: '',
   utensils: [],
   description: '',
}

export const reducers = (state, { type, payload }) => {
   console.log('reducer -> type', type)
   console.log('reducer -> payload', payload)
   switch (type) {
      case 'SEED': {
         return {
            ...state,
            ...payload,
         }
      }
      case 'NAME': {
         return {
            ...state,
            name: payload.value,
         }
      }
      case 'BASIC': {
         console.log('Payload', payload)
         return {
            ...state,
            type: payload.type,
            cuisine: payload.cuisine,
            cookingTime: payload.cookingTime,
            author: payload.author,
            utensils: payload.utensils,
            description: payload.description,
         }
      }
      default:
         return state
   }
}
