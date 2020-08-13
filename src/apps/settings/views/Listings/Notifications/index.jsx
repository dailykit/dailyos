import React from 'react'
import { useHistory } from 'react-router-dom'

import { useTabs } from '../../../context'

const Notifications = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   React.useEffect(() => {
      const tabIndex =
         tabs.findIndex(item => item.path === `/settings/notifications`) || {}
      if (tabIndex === -1) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [history, tabs])

   return <>text</>
}

export default Notifications
