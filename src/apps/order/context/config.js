import React from 'react'
import _ from 'lodash'
import { useSubscription } from '@apollo/react-hooks'

import { useAuth } from './auth'
import { Loader } from '../components'
import { Flex } from '../../../shared/components'
import { SETTINGS, STATIONS_BY_USER } from '../graphql'

const ConfigContext = React.createContext()

const initialState = {
   tunnel: { visible: false },
   stations: [],
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

      case 'SET_STATIONS':
         return { ...state, stations: payload }
      case 'TOGGLE_TUNNEL':
         return { ...state, tunnel: payload }
      default:
         return state
   }
}

export const ConfigProvider = ({ children }) => {
   const { user } = useAuth()
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const { loading, data: { stations = [] } = {} } = useSubscription(
      STATIONS_BY_USER,
      {
         variables: {
            ...(user.email && { email: { _eq: user.email } }),
         },
      }
   )
   const {
      loading: loadingSettings,
      data: { settings = [] } = {},
   } = useSubscription(SETTINGS)

   React.useEffect(() => {
      if (!loadingSettings && !_.isEmpty(settings)) {
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
      }
   }, [loadingSettings, settings])

   React.useEffect(() => {
      if (!loading && !_.isEmpty(stations)) {
         dispatch({ type: 'SET_STATIONS', payload: stations })
      }
   }, [loading, stations])

   if (loading) return <Loader />
   if (_.isEmpty(stations))
      return (
         <Flex
            container
            height="100vh"
            alignItems="center"
            justifyContent="center"
         >
            You're not authorized to access Order App.
         </Flex>
      )
   return (
      <ConfigContext.Provider value={{ state, dispatch, methods: {} }}>
         {children}
      </ConfigContext.Provider>
   )
}

export const useConfig = () => React.useContext(ConfigContext)
