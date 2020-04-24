import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   title: '',
   tags: [],
   description: '',
   recipe: '',
   options: [],
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
      default:
         return state
   }
}
