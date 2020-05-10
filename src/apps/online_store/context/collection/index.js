import React from 'react'

export const CollectionContext = React.createContext()

export const state = {
   meta: {
      productType: '',
   },
   current: {
      category: '',
   },
   id: '',
   title: '',
   categories: [],
   rule: '',
   stage: 1,
}

export const reducer = (state, { type, payload }) => {
   switch (type) {
      case 'SEED': {
         return {
            ...state,
            id: payload.id,
            title: payload.name,
            categories: payload.store || [],
            rule: payload.availability?.rule || '',
         }
      }
      case 'ID': {
         return {
            ...state,
            id: payload.id,
         }
      }
      case 'TITLE': {
         return {
            ...state,
            title: payload.value,
         }
      }
      case 'CATEGORY_TITLE': {
         const updated_categories = state.categories
         updated_categories[payload.index].title = payload.title
         return {
            ...state,
            categories: updated_categories,
         }
      }
      case 'CREATE_CATEGORY': {
         const new_category = {
            title: payload.title,
            products: [],
         }
         return {
            ...state,
            categories: [...state.categories, new_category],
         }
      }
      case 'DELETE_CATEGORY': {
         const updated_categories = state.categories.filter(
            category => category.title !== payload.title
         )
         return {
            ...state,
            categories: updated_categories,
         }
      }
      case 'CURRENT_CATEGORY': {
         return {
            ...state,
            current: {
               ...state.current,
               category: payload.index,
            },
         }
      }
      case 'ADD_PRODUCTS': {
         const updated_categories = state.categories
         updated_categories[state.current.category].products.push(
            ...payload.products
         )
         return {
            ...state,
            categories: updated_categories,
         }
      }
      case 'DELETE_PRODUCT': {
         const index = state.categories.findIndex(
            category => category.title === payload.category.title
         )
         const updated_categories = state.categories
         const updated_products = updated_categories[index].products.filter(
            product => product.title !== payload.product.title
         )
         updated_categories[index].products = updated_products
         return {
            ...state,
            categories: updated_categories,
         }
      }
      case 'RULE': {
         return {
            ...state,
            rule: payload,
         }
      }
      case 'NEXT_STAGE': {
         return {
            ...state,
            stage: state.stage + 1,
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
