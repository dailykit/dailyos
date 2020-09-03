import React from 'react'
import { useSubscription } from '@apollo/react-hooks'

import { SETTINGS, STATION_USER } from '../graphql'
import { useAuth } from './auth'

const ConfigContext = React.createContext()

const initialState = {
   tunnel: { visible: false },
   station: {},
   scale: {
      weight_simulation: {
         app: 'order',
         type: 'scale',
         value: { isActive: false },
         identifier: 'weight simulation',
      },
   },
   print: {
      print_simulation: {
         app: 'order',
         type: 'print',
         value: { isActive: false },
         identifier: 'print simulation',
      },
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_SETTING':
         return { ...state, [payload.field]: payload.value }
      case 'TOGGLE_TUNNEL':
         return { ...state, tunnel: payload }
      default:
         return state
   }
}

export const ConfigProvider = ({ children }) => {
   const { user } = useAuth()
   const [state, dispatch] = React.useReducer(reducers, initialState)
   useSubscription(STATION_USER, {
      variables: {
         ...(user.email && { email: { _eq: user.email } }),
      },
      onSubscriptionData: ({
         subscriptionData: { data: { station_user = [] } = {} } = {},
      }) => {
         if (station_user.length > 0) {
            dispatch({
               type: 'SET_SETTING',
               payload: { field: 'station', value: station_user[0].station },
            })
         }
      },
   })
   useSubscription(SETTINGS, {
      onSubscriptionData: ({
         subscriptionData: { data: { settings = [] } = {} } = {},
      }) => {
         const weighIndex = settings.findIndex(
            setting => setting.identifier === 'weight simulation'
         )
         if (weighIndex !== -1) {
            const { __typename, ...rest } = settings[weighIndex]
            dispatch({
               type: 'SET_SETTING',
               payload: {
                  field: 'scale',
                  value: {
                     ...state.scale,
                     weight_simulation: rest,
                  },
               },
            })
         }
         const printIndex = settings.findIndex(
            setting => setting.identifier === 'print simulation'
         )
         if (printIndex !== -1) {
            const { __typename, ...rest } = settings[printIndex]
            dispatch({
               type: 'SET_SETTING',
               payload: {
                  field: 'print',
                  value: {
                     ...state.print,
                     print_simulation: rest,
                  },
               },
            })
         }
      },
   })

   return (
      <ConfigContext.Provider value={{ state, dispatch, methods: {} }}>
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
