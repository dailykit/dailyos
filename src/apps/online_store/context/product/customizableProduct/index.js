import React from 'react'

export const CustomizableProductContext = React.createContext()

export const state = {
   meta: {
      itemType: 'inventory',
   },
   title: '',
   tags: [],
   description: '',
   items: [],
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
      case 'ITEMS': {
         return {
            ...state,
            items: [...state.items, ...payload.value],
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
