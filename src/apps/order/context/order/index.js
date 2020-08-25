import React from 'react'
import moment from 'moment'
import { useMutation } from '@apollo/react-hooks'

import { UPDATE_ORDER } from '../../graphql'

const Context = React.createContext()

const initialState = {
   filter: {
      tunnel: false,
   },
   delivery_config: {
      orderId: null,
   },
   current_view: 'SUMMARY',
   mealkit: {
      name: null,
      sachet_id: null,
   },
   inventory: {
      id: null,
   },
   readytoeat: {
      id: null,
   },
   orders: {
      limit: 10,
      offset: 0,
      where: {
         orderStatus: { _eq: 'PENDING' },
         fulfillmentTimestamp: { _gte: moment().format('YYYY-MM-DD HH:MM') },
      },
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_MEALKIT':
         return {
            ...state,
            current_view: 'MEALKIT',
            mealkit: {
               name: payload.name,
               sachet_id: payload.id,
            },
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
            inventory: {
               id: null,
            },
            readytoeat: {
               id: null,
            },
            mealkit: {
               name: null,
               sachet_id: null,
            },
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
               ...state.orders,
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
      case 'CLEAR_READY_BY_FILTER':
         return {
            ...state,
            orders: {
               ...state.orders,
               where: {
                  ...state.orders.where,
                  readyByTimestamp: {},
               },
            },
         }
      case 'CLEAR_FULFILLMENT_FILTER':
         return {
            ...state,
            orders: {
               ...state.orders,
               where: {
                  ...state.orders.where,
                  fulfillmentTimestamp: {},
               },
            },
         }
      case 'CLEAR_FULFILLMENT_TYPE_FILTER':
         return {
            ...state,
            orders: {
               ...state.orders,
               where: {
                  ...state.orders.where,
                  fulfillmentType: {},
               },
            },
         }
      case 'CLEAR_SOURCE_FILTER':
         return {
            ...state,
            orders: {
               ...state.orders,
               where: {
                  ...state.orders.where,
                  source: {},
               },
            },
         }
      case 'CLEAR_AMOUNT_FILTER':
         return {
            ...state,
            orders: {
               ...state.orders,
               where: {
                  ...state.orders.where,
                  amountPaid: {},
               },
            },
         }
      case 'TOGGLE_FILTER_TUNNEL': {
         return {
            ...state,
            filter: payload,
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
   const [update] = useMutation(UPDATE_ORDER)

   const selectMealKit = (id, name) => {
      dispatch({
         type: 'SELECT_MEALKIT',
         payload: { id, name },
      })
   }

   const selectInventory = id => {
      dispatch({
         type: 'SELECT_INVENTORY',
         payload: id,
      })
   }

   const selectReadyToEat = id => {
      dispatch({
         type: 'SELECT_READYTOEAT',
         payload: id,
      })
   }

   const switchView = view => {
      dispatch({
         type: 'SWITCH_VIEW',
         payload: {
            view,
         },
      })
   }

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
      selectMealKit,
      selectInventory,
      selectReadyToEat,
   }
}
