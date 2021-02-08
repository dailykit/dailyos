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
   Form,
} from '@dailykit/ui'
import { InlineLoader } from '../../../../../../../shared/components/InlineLoader'

import { toast } from 'react-toastify'
import { logger } from '../../../../../../../shared/utils'

import { useTabs } from '../../../../../../../shared/providers'

import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import { ReactTabulator, reactFormatter } from '@dailykit/react-tabulator'
import DateEditor from 'react-tabulator/lib/editors/DateEditor'
import MultiValueFormatter from 'react-tabulator/lib/formatters/MultiValueFormatter'
import options from './tableOptions'
import { NOTIFICATIONS } from '../../../../../graphql'
import NotificationForm from '../../../../Forms/Notification/index'
import AddEmailAdresses from '../../../../Forms/Notification/'
import PlayButton from '../../../../../../../../src/shared/assets/icons/PlayButton'

const PlayAudio = ({ cell }) => {
   const rowData = cell._cell.row.data
   const audio = new Audio(rowData.audioUrl)
   const start = () => {
      audio.play()
   }
   return (
      <>
         <PlayButton onClick={start} />
      </>
   )
}

const ToggleButton = ({ cell, toggleType, toggleHandler }) => {
   const rowData = cell._cell.row.data
   const toggleFieldname = toggleType
   let toggleValue

   if (toggleType === 'isLocal') {
      toggleValue = rowData.isLocal
   }
   if (toggleType === 'isGlobal') {
      toggleValue = rowData.isGlobal
   } else if (toggleType === 'isActive') {
      toggleValue = rowData.isActive
   } else if (toggleType === 'playAudio') {
      toggleValue = rowData.PlayAudio
   }

   const audio = new Audio(rowData.audioUrl)
   const start = () => {
      audio.play()
   }
   return (
      <Form.Group>
         <Form.Toggle
            name={`notificationType_active${rowData.id}${toggleFieldname}`}
            onChange={() =>
               toggleHandler(toggleValue, rowData.id, toggleFieldname)
            }
            value={toggleValue}
         />
      </Form.Group>
   )
}

const NotificationTable = () => {
   const tableRef = React.useRef()
   const { tab, addTab } = useTabs()
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [state, setState] = React.useState({})

   React.useEffect(() => {
      if (!tab) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [tab, addTab])

   const {
      loading,
      error,
      data: { notificationTypes = [] } = {},
   } = useSubscription(NOTIFICATIONS.LIST, {
      onSubscriptionData: data => {
         const result = data.subscriptionData.data.notificationTypes.map(
            notificationType => {
               return {
                  id: notificationType.id,
                  active: notificationType.isActive,
                  isGlobal: notificationType.isGlobal,
                  isLocal: notificationType.isLocal,
               }
            }
         )
         setState(result)
      },
   })

   if (error) {
      logger(error)
   }

   const [updateNotificationType] = useMutation(
      NOTIFICATIONS.UPDATE_NOTIFICATION_TYPE,
      {
         onCompleted: () => {
            toast.info('Notification Setting Updated!')
         },
         onError: error => {
            toast.error('Something went wrong')
            logger(error)
         },
      }
   )

   const toggleHandler = (toggle, id, toggleFieldName) => {
      const val = !toggle
      let variables = {
         id: id,
         _set: {
            [toggleFieldName]: val,
         },
      }
      updateNotificationType({ variables })
   }

   const nestedOptions = [
      {
         title: 'App',
         field: 'isLocal',
         formatter: reactFormatter(
            <ToggleButton toggleType="isLocal" toggleHandler={toggleHandler} />
         ),
         editor: true,

         width: 70,
      },
      {
         title: 'Daily OS ',
         field: 'isGlobal',
         formatter: reactFormatter(
            <ToggleButton toggleType="isGlobal" toggleHandler={toggleHandler} />
         ),
         editor: true,
         width: 100,
      },
   ]

   const ConfigureEmailTunnel = ({ cell }) => {
      const rowData = cell._cell.row.data
      const emailConfigs = rowData.emailConfigs
      return (
         <>
            {emailConfigs.length > 0 ? (
               emailConfigs
                  .slice(0, 1)
                  .map(emailConfig => (
                     <Tag onClick={() => openTunnel(1)}>
                        {emailConfig.email}
                     </Tag>
                  ))
            ) : (
               <TextButton type="ghost" onClick={() => openTunnel(1)}>
                  Configure Emails
               </TextButton>
            )}
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
         columns: [
            {
               field: 'playAudio',
               editor: true,
               formatter: reactFormatter(
                  <ToggleButton
                     toggleHandler={toggleHandler}
                     toggleType="playAudio"
                  />
               ),
               width:100
            },
            {
               field: 'AudioPlayer',
               formatter: reactFormatter(<PlayAudio />),
               width:100
            },
         ],
      },

      {
         title: 'Send Emails',
         field: 'email',
         formatter: reactFormatter(
            <ConfigureEmailTunnel openTunnel={openTunnel} />
         ),
         editor: true,
      },

      {
         title: 'Active',
         field: 'isActive',
         formatter: reactFormatter(
            <ToggleButton toggleHandler={toggleHandler} toggleType="isActive" />
         ),
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

         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <TunnelHeader
                  title="Configure Emails"
                  close={() => closeTunnel(1)}
               />
               <NotificationForm />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default NotificationTable
