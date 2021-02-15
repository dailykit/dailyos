import React from 'react'
import { ScrollSection } from '../../../../../../../shared/components'
import { Text, Spacer, Flex } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { isEmpty, groupBy } from 'lodash'
import { useParams } from 'react-router-dom'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { NOTIFICATIONS, APPS } from '../../../../../graphql/index'
import { logger } from '../../../../../../../shared/utils'
import NotificationTable from '../Table/index'
export const NotificationSidebar = () => {
   const params = useParams()
   const [sidebaritems, setSidebarItems] = React.useState({})
   const {
      loading,
      error,
      data: { notificationTypes = [] } = {},
   } = useSubscription(NOTIFICATIONS.LIST_SIDEBAR)

   if (error) {
      toast.error('Something went wrong!')
      logger(error)
   }

   React.useEffect(() => {
      if (!loading && !isEmpty(notificationTypes)) {
         const grouped = groupBy(notificationTypes, 'app')

         Object.keys(grouped).forEach(key => {
            grouped[key] = grouped[key].map(node => node.name)
         })
         setSidebarItems(grouped)
      }
   }, [loading, notificationTypes])

   return (
      <Flex
         margin="0 auto"
         maxWidth="1280px"
         padding="16px"
         width="calc(100vw - 164px)"
      >
         <Spacer size="16px" />
         <Text as="h1">Notifications</Text>
         <Spacer size="16px" />

         <NotificationTable />
      </Flex>
   )
}

export default NotificationSidebar
