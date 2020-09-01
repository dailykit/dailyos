import React from 'react'
import Keycloak from 'keycloak-js'
import { useSubscription } from '@apollo/react-hooks'

import { STATION_USER } from '../../graphql'

const keycloak = new Keycloak({
   realm: process.env.REACT_APP_KEYCLOAK_REALM,
   url: process.env.REACT_APP_KEYCLOAK_URL,
   clientId: 'order',
   'ssl-required': 'none',
   'public-client': true,
   'bearer-only': false,
   'verify-token-audience': true,
   'use-resource-role-mappings': true,
   'confidential-port': 0,
})

const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = React.useState(false)
   const [user, setUser] = React.useState({})
   const [station, setStation] = React.useState([])
   const [isInitialized, setIsInitialized] = React.useState(false)
   useSubscription(STATION_USER, {
      variables: {
         email: { _eq: user.email },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { station_user = [] } = {} } = {},
      }) => {
         if (station_user.length > 0) {
            setStation(station_user[0].station)
         }
      },
   })

   const initialize = async () => {
      const authenticated = await keycloak.init({
         onLoad: 'login-required',
         promiseType: 'native',
      })
      if (authenticated) {
         setIsInitialized(true)
         setIsAuthenticated(authenticated)
         const profile = await keycloak.loadUserProfile()
         setUser(profile)
      }
   }

   React.useEffect(() => {
      initialize()
   }, [])

   const login = () => keycloak.login()
   const logout = () => keycloak.logout()
   const isTokenExpired = () => keycloak.isTokenExpired()
   const updateToken = () => keycloak.updateToken()
   const clearToken = () => keycloak.clearToken()

   return (
      <AuthContext.Provider
         value={{
            user,
            login,
            logout,
            station,
            clearToken,
            updateToken,
            isInitialized,
            isTokenExpired,
            isAuthenticated,
         }}
      >
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => React.useContext(AuthContext)
