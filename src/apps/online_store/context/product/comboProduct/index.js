import React from 'react'

export const ComboProductContext = React.createContext()

export const state = {
   meta: {
      productType: '',
   },
   id: '',
   name: '',
   tags: [],
   description: '',
   components: [],
}

export const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SEED': {
         return {
            ...state,
            id: payload.id,
            name: payload.name,
            tags: payload.tags,
            description: payload.description,
            components: payload.components,
         }
      }
      case 'NAME': {
         return {
            ...state,
            name: payload.value,
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
      case 'COMPONENTS': {
         return {
            ...state,
            components: [...state.components, ...payload.components],
         }
      }
      case 'META': {
         return {
            ...state,
            meta: {
               ...state.meta,
               [payload.name]: payload.value,
            },
         }
      }
      default: {
         return state
      }
   }
}
