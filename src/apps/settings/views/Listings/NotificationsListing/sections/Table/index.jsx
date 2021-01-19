import React from 'react'
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   AvatarGroup,
   Avatar,
   TagGroup,
   Tag,
   Flex,
   Text,
   Toggle,
   checked,
   setChecked,
   Tunnels,
   Tunnel,
   InfoIcon,
   useTunnel,
   TextButton,
   TunnelHeader,
} from '@dailykit/ui'
import { InlineLoader } from '../../../../../../../shared/components/InlineLoader'

import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'

import { useTabs } from '../../../../../context'
import { useSubscription, useQuery } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import MultiValueFormatter from 'react-tabulator/lib/formatters/MultiValueFormatter'
import options from './tableOptions'
import { NOTIFICATIONS } from '../../../../../graphql'
import NotificationForm from '../../../../Forms/Notification/index'
import AddEmailAdresses from '../../../../Forms/Notification/'
const NotificationTable = () => {
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()

   React.useEffect(() => {
      if (!tab) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [tab, addTab])

   const {
      loading,
      error,
      data: { notificationTypes = [] } = {},
   } = useSubscription(NOTIFICATIONS.LIST)

   if (error) {
      logger(error)
   }

   const openForm = (_, cell) => {
      const { notificationItem } = cell.getData()
      addTab(notificationItem.app, `/notifications/${notificationItem.id}`)
   }

   const nestedOptions = [
      {
         title: 'Show on App',
         field: 'isLocal',
         formatter: reactFormatter(<Toggle />),
         editor: true,
      },
      {
         title: 'Show on Daily OS ',
         field: 'isGlobal',
         formatter: reactFormatter(<Toggle />),
         editor: true,
      },
   ]
   const ConfigureEmailTunnel = () => {
      const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
      return (
         <>
            <TextButton type="ghost" onClick={() => openTunnel(1)}>
               Configure Emails
            </TextButton>
            <Tunnels tunnels={tunnels}>
               <Tunnel layer={1} size="md">
                  <TunnelHeader
                     title="Configure Email"
                     right={{ action: () => openTunnel(2), title: 'Next' }}
                     close={() => closeTunnel(1)}
                  />
                  <NotificationForm />
               </Tunnel>

               <Tunnel layer={2} size="md">
                  <TunnelHeader
                     title="Tunnel 3"
                     right={{
                        title: 'Next',
                        action: () => openTunnel(3),
                     }}
                     close={() => closeTunnel(2)}
                  />
               </Tunnel>

               <Tunnel layer={4} size="sm">
                  <TunnelHeader
                     title="Tunnel 4"
                     right={{
                        title: 'Close',
                        action: () => closeTunnel(4),
                     }}
                     close={() => closeTunnel(4)}
                     nextAction="Done"
                  />
               </Tunnel>
            </Tunnels>
         </>
      )
   }

   const editableColumns = [
      {
         title: 'Name',
         field: 'name',
         width: 150,
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'left'
            return '' + cell.getValue()
         },
      },
      {
         title: 'App',
         field: 'app',
         width: 150,
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'left'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Description',
         field: 'description',
         width: 250,
         titleFormatter: function (cell) {
            cell.getElement().style.textAlign = 'left'
            return '' + cell.getValue()
         },
      },
      {
         title: 'Display Settings ',

         columns: nestedOptions,
      },

      {
         title: 'Audio',
         field: 'playAudio',
         formatter: 'tickCross',
         editor: true,
         formatter: reactFormatter(<Toggle />),
      },
      {
         title: 'Send Emails',
         field: 'email',
         formatter: reactFormatter(<ConfigureEmailTunnel />),
         editor: true,
      },

      {
         title: 'Active',
         field: 'isActive',
         formatter: reactFormatter(<Toggle />),
         editor: true,
      },
   ]

   if (loading) return <InlineLoader />
   return (
      <>
         <ReactTabulator
            columns={editableColumns}
            data={notificationTypes}
            options={{
               ...options,
               groupBy: 'app',
            }}
         />
      </>
   )
}

export default NotificationTable
