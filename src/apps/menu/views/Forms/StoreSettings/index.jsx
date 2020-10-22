import React from 'react'

import SideNav from './SideNav'
import Main from './Main'
import { useTabs } from '../../../context'

const StoreSettingsForm = () => {
   const { addTab, tab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Store Settings', '/menu/settings')
      }
   }, [tab, addTab])
   return (
      <>
         <SideNav />
         <Main />
      </>
   )
}

export default StoreSettingsForm
