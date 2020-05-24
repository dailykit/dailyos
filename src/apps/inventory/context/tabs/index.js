import React from 'react'

const Context = React.createContext()

const state = {
   listings: [],
   forms: [],
   current: {},
   supplierId: '',
   sachetWorkOrder: {},
   bulkWorkOrder: {},
   purchaseOrder: {},
   itemId: '',
   packagingId: '',
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TITLE': {
         const newState = { ...state }
         newState.current.title = payload.title
         const index = newState.forms.findIndex(
            tab => tab.title === payload.oldTitle
         )
         newState.forms[index].title = payload.title
         return newState
      }

      case 'SET_FORM_DATA': {
         const index = state[payload.type].findIndex(
            tab => tab.type === payload.type && tab.view === payload.view
         )
         state[payload.type][index] = payload
         return state
      }
      // Add Tab
      case 'ADD_TAB': {
         const alreadyExists = state[payload.type].find(
            tab => tab.title === payload.title
         )

         if (alreadyExists) {
            return { ...state, current: { ...payload } }
         }
         return {
            ...state,
            current: { ...payload },
            [payload.type]: [...state[payload.type], { ...payload }],
         }
      }
      // Delete Tab
      case 'DELETE_TAB': {
         const { type } = payload
         const tabs = state[type].filter(
            (tab, index) =>
               tab.title !== payload.title && index !== payload.index
         )

         const listingsLength = state.listings.length
         const formsLength = state.forms.length

         // Listings

         // Switch to right tab
         if (type === 'listings' && listingsLength > 1 && payload.index === 0) {
            state.current = state.listings[payload.index + 1]
         }
         // Switch to left tab
         if (type === 'listings' && listingsLength > 1 && payload.index > 0) {
            state.current = state.listings[payload.index - 1]
         }
         // Switch to first tab in forms
         if (
            type === 'listings' &&
            listingsLength === 1 &&
            formsLength >= 1 &&
            payload.index === 0
         ) {
            state.current = state.forms[0]
         }

         // Forms

         // Switch to right tab
         if (type === 'forms' && formsLength > 1 && payload.index === 0) {
            state.current = state.forms[payload.index + 1]
         }
         // Switch to left tab
         if (type === 'forms' && formsLength > 1 && payload.index > 0) {
            state.current = state.forms[payload.index - 1]
         }
         // Switch to last tab in listings
         if (
            type === 'forms' &&
            formsLength === 1 &&
            listingsLength >= 1 &&
            payload.index === 0
         ) {
            state.current = state.listings[listingsLength - 1]
         }

         return { ...state, [type]: tabs }
      }
      // Switch Tab
      case 'SWITCH_TAB': {
         return { ...state, current: { ...payload } }
      }

      case 'ADD_SUPPLIER_ID':
         return { ...state, supplierId: payload }

      case 'SET_SACHET_WORK_ORDER':
         return { ...state, sachetWorkOrder: { ...payload } }

      case 'SET_BULK_WORK_ORDER':
         return { ...state, bulkWorkOrder: { ...payload } }

      case 'SET_PURCHASE_WORK_ORDER':
         return { ...state, purchaseOrder: { ...payload } }

      case 'SET_ITEM_ID':
         return { ...state, itemId: payload }

      case 'SET_PACKAGING_ID':
         return { ...state, packagingId: payload }
      default:
         return state
   }
}

export { Context, state, reducers }
