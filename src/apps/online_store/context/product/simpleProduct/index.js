import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   title: '',
   tags: [],
   description: '',
   recipe: '',
   options: [],
   accompaniments: [],
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
      case 'DESCRIPTION': {
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
      case 'OPTIONS': {
         return {
            ...state,
            options: payload.value,
         }
      }
      case 'ACCOMPANIMENT_TYPES': {
         const accompaniments = payload.value.map(el => {
            return {
               type: el.title,
            }
         })
         return {
            ...state,
            accompaniments,
         }
      }
      default:
         return state
   }
}
