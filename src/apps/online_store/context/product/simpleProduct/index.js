import React from 'react'

export const SimpleProductContext = React.createContext()

export const state = {
   meta: {
      accompanimentType: 'Beverages',
      productTypes: 'inventory',
   },
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
               products: [],
            }
         })
         return {
            ...state,
            accompaniments,
            meta: {
               ...state.meta,
               accompanimentType: accompaniments[0].type,
            },
         }
      }
      case 'ADD_ACCOMPANIMENTS': {
         const index = state.accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         const updatedAccompaniments = state.accompaniments
         updatedAccompaniments[index].products = payload.value
         return {
            ...state,
            accompaniments: updatedAccompaniments,
         }
      }
      case 'ACCOMPANIMENT_DISCOUNT': {
         const index = state.accompaniments.findIndex(
            el => el.type === state.meta.accompanimentType
         )
         const updatedAccompaniments = state.accompaniments
         const updatedAccompaniment = updatedAccompaniments[index]
         const productIndex = updatedAccompaniment.products.findIndex(
            el => el.id === payload.id
         )
         updatedAccompaniment.products[productIndex].discount.value =
            payload.value
         updatedAccompaniments[index] = updatedAccompaniment
         return {
            ...state,
            accompaniments: updatedAccompaniments,
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
      default:
         return state
   }
}
