import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './auth'
const BannerContext = React.createContext()

export const BannerProvider = ({ children }) => {
   const [banners, setBanners] = React.useState([])
   return (
      <BannerContext.Provider value={{ banners, setBanners }}>
         {children}
      </BannerContext.Provider>
   )
}

export const useBanner = id => {
   const { banners, setBanners } = React.useContext(BannerContext)
   const { user } = useAuth()
   const location = useLocation()

   const getAppName = url => {
      if (url === '/') {
         return 'home'
      }
      const regex = /\/[a-z]*/g
      const matches = url.match(regex)
      const appName = matches[0].slice(1)
      return appName
   }

   const getRequestedEntity = url => {
      const regex = /[0-9]+/g
      const matches = url.match(regex)
      if (!matches) {
         return null
      }

      const entityId = matches[0]
      return entityId
   }

   return {
      banners,
      setBanners,
      userEmail: user?.email,
      requestedUrl: location.pathname,
      requestedApp: getAppName(location.pathname),
      requestedEntityId: getRequestedEntity(location.pathname),
   }
}
