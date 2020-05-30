import React from 'react'

const Context = React.createContext()

const initialState = {
   current_view: 'SUMMARY',
   order: {
      id: null,
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_ORDER':
         return {
            ...state,
            current_view: 'WEIGHING',
            order: {
               id: payload,
            },
         }
      case 'SWITCH_VIEW': {
         return {
            ...state,
            current_view: payload.view,
            order: {
               id: null,
            },
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

   const selectOrder = id => {
      dispatch({
         type: 'SELECT_ORDER',
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

   return { state, dispatch, selectOrder, switchView }
}
