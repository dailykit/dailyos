import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   title: '',
   tags: '',
   description: '',
   recipe: '',
}

// *** Hasura schema ***
// id
// name
// simpleRecipeId
// accompaniments
// default

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'TITLE': {
         return {
            ...state,
            title: payload.value,
         }
      }
      case 'DESC': {
         return {
            ...state,
            description: payload.value,
         }
      }
      case 'TAGS': {
         return {
            ...state,
            tags: payload.value,
         }
      }
      case 'RECIPE': {
         return {
            ...state,
            recipe: payload.value,
         }
      }
      default:
         return state
   }
}
