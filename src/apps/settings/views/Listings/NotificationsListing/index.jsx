import React from 'react'
import tableOptions from '../tableOption'
import { useTabs } from '../../../../../shared/providers'
import { logger } from '../../../../../shared/utils'
import { useTooltip } from '../../../../../shared/providers'
import { InlineLoader, Tooltip } from '../../../../../shared/components'
import { useSubscription } from '@apollo/react-hooks'
import { NOTIFICATIONS } from '../../../graphql'
import { toast } from 'react-toastify'
import { Text, Flex } from '@dailykit/ui'
import { ReactTabulator } from '@dailykit/react-tabulator'
import NotificationSidebar from './sections/NotificationSidebar/index'
import NotificationTable from './sections/Table/index'
import {StyledWrapper} from './styled'
const NotificationsListing = () => {
   const tableRef = React.useRef()
   const { tooltip } = useTooltip() 
   const { tab, addTab } = useTabs()
   const {
      loading,
      error,
      data: { notifications = [] } = {},
   } = useSubscription(NOTIFICATIONS.LIST)

   React.useEffect(() => {
      if (!tab) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [tab, addTab])

   if (!loading && error) {
      toast.error('Failed to load the notifcations.')
      logger(error)
   }

   return (
      <>

<NotificationSidebar />


      </>
   )
}

export default NotificationsListing
