import React from 'react'
import { useMutation } from '@apollo/react-hooks'

import { MUTATIONS } from '../../graphql'

const Context = React.createContext()

const initialState = {
   filter: { tunnel: false },
   delivery_config: { orderId: null },
   current_view: 'SUMMARY',
   sachet: { id: null, product: { name: null } },
   inventory: { id: null },
   readytoeat: { id: null },
   orders: {
      limit: 10,
      offset: 0,
      loading: true,
      where: { orderStatus: { _eq: 'PENDING' } },
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_SACHET':
         return {
            ...state,
            current_view: 'SACHET_ITEM',
            sachet: { id: payload.id, product: payload.product },
         }
      case 'SELECT_INVENTORY':
         return {
            ...state,
            current_view: 'INVENTORY',
            inventory: {
               id: payload,
            },
         }
      case 'SELECT_READYTOEAT':
         return {
            ...state,
            current_view: 'READYTOEAT',
            readytoeat: {
               id: payload,
            },
         }
      case 'SWITCH_VIEW': {
         return {
            ...state,
            sachet: {
               name: null,
               id: null,
            },

            inventory: { id: null },
            readytoeat: { id: null },
            current_view: payload.view,
         }
      }
      case 'DELIVERY_PANEL': {
         return {
            ...state,
            delivery_config: {
               ...state.delivery_config,
               ...payload,
            },
         }
      }
      case 'SET_FILTER': {
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: { ...state.orders.where, ...payload },
            },
         }
      }
      case 'SET_PAGINATION': {
         return {
            ...state,
            orders: {
               ...state.orders,
               limit: payload.limit,
               offset: payload.offset,
            },
         }
      }
      case 'CLEAR_READY_BY_FILTER': {
         const { readyByTimestamp, ...rest } = state.orders.where
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'CLEAR_FULFILLMENT_FILTER': {
         const { fulfillmentTimestamp, ...rest } = state.orders.where
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'CLEAR_FULFILLMENT_TYPE_FILTER': {
         const { fulfillmentType, ...rest } = state.orders.where
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'CLEAR_SOURCE_FILTER': {
         const { source, ...rest } = state.orders.where
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'CLEAR_AMOUNT_FILTER': {
         const { amountPaid, ...rest } = state.orders.where
         return {
            ...state,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'CLEAR_STATION_FILTER': {
         const { _or, ...rest } = state.orders.where
         return {
            ...state,
            loading: true,
            orders: {
               loading: true,
               limit: 10,
               offset: 0,
               where: rest,
            },
         }
      }
      case 'TOGGLE_FILTER_TUNNEL': {
         return {
            ...state,
            filter: payload,
         }
      }
      case 'SET_ORDERS_STATUS': {
         return {
            ...state,
            orders: { ...state.orders, loading: payload },
         }
      }
      default:
         return state
   }
}

export const OrderProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)

   return (
      <Context.Provider value={{ state, dispatch }}>
         {children}
      </Context.Provider>
   )
}

export const useOrder = () => {
   const { state, dispatch } = React.useContext(Context)
   const [update] = useMutation(MUTATIONS.ORDER.UPDATE)

   const selectSachet = React.useCallback(
      (id, product) => {
         dispatch({
            type: 'SELECT_SACHET',
            payload: { id, product },
         })
      },
      [dispatch]
   )

   const selectInventory = React.useCallback(
      id => {
         dispatch({
            type: 'SELECT_INVENTORY',
            payload: id,
         })
      },
      [dispatch]
   )

   const selectReadyToEat = React.useCallback(
      id => {
         dispatch({
            type: 'SELECT_READYTOEAT',
            payload: id,
         })
      },
      [dispatch]
   )

   const switchView = React.useCallback(
      view => {
         dispatch({
            type: 'SWITCH_VIEW',
            payload: {
               view,
            },
         })
      },
      [dispatch]
   )

   const updateOrder = ({ id, set, append }) => {
      update({
         variables: {
            id,
            ...(set && { _set: set }),
            ...(append && { _append: append }),
         },
      })
   }

   return {
      state,
      dispatch,
      switchView,
      updateOrder,
      selectSachet,
      selectInventory,
      selectReadyToEat,
   }
}
