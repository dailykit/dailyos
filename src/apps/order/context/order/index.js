import React from 'react'

const Context = React.createContext()

const initialState = {
   current_view: 'SUMMARY',
   product: {
      name: null,
      sachet_id: null,
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      // Add Tab
      case 'SELECT_ORDER':
         return {
            ...state,
            current_view: 'MEALKIT',
            product: {
               name: payload.name,
               sachet_id: payload.id,
            },
         }
      case 'SWITCH_VIEW': {
         return {
            ...state,
            current_view: payload.view,
            product: {
               name: null,
               sachet_id: null,
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

   const selectOrder = (id, name) => {
      dispatch({
         type: 'SELECT_ORDER',
         payload: { id, name },
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
