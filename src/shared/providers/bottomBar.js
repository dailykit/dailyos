import React from 'react'
import { isEmpty, has } from 'lodash'
import { Loader } from '@dailykit/ui'
import { useSubscription } from '@apollo/react-hooks'

import { GET_BOTTOM_BAR_OPTIONS } from '../graphql'
import { logger } from '../utils'
import { toast } from 'react-toastify'

const BottomBarContext = React.createContext()

const initialState = {
   bottomBarOptions: [],
   clickedOption: null,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_BOTTOM_BAR_OPTIONS':
         return { ...state, bottomBarOptions: payload }
      case 'ADD_INFO':
         const optionIndex = state.bottomBarOptions.findIndex(
            option => option.id === payload.id
         )
         if (optionIndex !== -1) {
            return {
               ...state,
               clickedOption: payload,
            }
         }
         return state
   }
}

export const BottomBarProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const { loading, error } = useSubscription(GET_BOTTOM_BAR_OPTIONS, {
      variables: { app: ['global'] },
      onSubscriptionData: ({
         subscriptionData: { data: { ux_bottomBarOption = [] } = {} } = {},
      }) => {
         dispatch({
            type: 'SET_BOTTOM_BAR_OPTIONS',
            payload: ux_bottomBarOption,
         })
      },
   })

   if (loading) {
      return <Loader />
   }
   if (error) {
      logger(error)
      toast.error('Something went wrong with bottomBar!')
   }
   return (
      <BottomBarContext.Provider value={{ state, dispatch }}>
         {children}
      </BottomBarContext.Provider>
   )
}

export const useBottomBar = () => {
   const { state, dispatch } = React.useContext(BottomBarContext)
   const addInfo = React.useCallback(
      data => {
         console.log('from provider', data)
         dispatch({
            type: 'ADD_INFO',
            payload: data,
         })
      },
      [dispatch]
   )

   return { state, addInfo }
}
