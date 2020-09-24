import React from 'react'
import { groupBy, isEmpty, uniqBy } from 'lodash'
import { useSubscription } from '@apollo/react-hooks'

import { useAuth } from './auth'
import { APP_PERMISSIONS } from '../graphql'
import { InlineLoader } from '../../../shared/components'

const AccessContext = React.createContext()

const initialState = {
   routes: {},
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_ROUTES':
         return { ...state, routes: payload }
      default:
         return state
   }
}

export const AccessProvider = ({ children }) => {
   const { user } = useAuth()
   const [state, dispatch] = React.useReducer(reducers, initialState)
   const { loading, data: { roles = [] } = {} } = useSubscription(
      APP_PERMISSIONS,
      {
         variables: {
            email: {
               _eq: user.email,
            },
            title: {
               _eq: 'Order App',
            },
         },
      }
   )

   React.useEffect(() => {
      if (!loading && !isEmpty(roles)) {
         const flatten = (a, b) => [
            ...a,
            ...b.apps.reduce((c, d) => [...c, ...d.permissions], []),
         ]

         const transform = ({ permission, ...rest }) => ({
            ...rest,
            ...permission,
         })

         const _routes = groupBy(
            uniqBy(roles.reduce(flatten, []).map(transform), v =>
               [v.value, v.route, v.title].join()
            ),
            'route'
         )
         dispatch({ type: 'SET_ROUTES', payload: _routes })
      }
   }, [loading, roles])

   if (loading) return <InlineLoader />
   return (
      <AccessContext.Provider value={{ state, dispatch }}>
         {children}
      </AccessContext.Provider>
   )
}

export const useAccess = (route = '') => {
   const { state, dispatch } = React.useContext(AccessContext)

   const canAccessRoute = React.useCallback(
      path => {
         const route = state.routes[path] || []
         const index = route.findIndex(node => node.title === 'ROUTE_READ')
         return index === -1 ? false : route[index].value
      },
      [state.routes]
   )

   const accessPermission = React.useCallback(
      (title, path) => {
         const routes = state.routes[path] || []
         const index = routes.findIndex(node => node.title === title)
         return index === -1 ? {} : routes[index]
      },
      [state.routes]
   )

   const hasAccess = React.useCallback(
      title => {
         const routes = state.routes[route] || []
         const index = routes.findIndex(node => node.title === title)
         return index === -1 ? false : routes[index].value
      },
      [state.routes]
   )

   return {
      state,
      dispatch,
      hasAccess,
      canAccessRoute,
      accessPermission,
   }
}
