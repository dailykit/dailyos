import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   title: '',
   tags: [],
   description: '',
}

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
      default: {
         return state
      }
   }
}
