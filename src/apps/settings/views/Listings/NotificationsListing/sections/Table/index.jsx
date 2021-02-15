import React from 'react'

import {
   AvatarGroup,
   Avatar,
   TagGroup,
   ButtonGroup,
   Tag,
   Flex,
   Tunnels,
   Tunnel,
   useTunnel,
   TextButton,
   TunnelHeader,
   IconButton,
   PlusIcon,
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
import { NOTIFICATIONS, USERS } from '../../../../../graphql'
import NotificationForm from '../../../../Forms/Notification/index'
import PlayButton from '../../../../../../../../src/shared/assets/icons/PlayButton'
import PauseButton from '../../../../../../../../src/shared/assets/icons/PauseButton'
import AddEmailAdresses from '../../../../Forms/Notification/AddEmail/index'

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
      toggleValue = rowData.playAudio
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
   const [isPlaying, setIsPlaying] = React.useState(false)
   const [typeid, SetTypeid] = React.useState(null)
   const [playaudioUrl, setplayAudioUrl] = React.useState('')

   const rowClick = (e, cell) => {
      const { id = null, audioUrl = null } = cell.getData() || {}
      if (id) {
         SetTypeid(id)
      }
      if (audioUrl) {
         setplayAudioUrl(audioUrl)
         console.log(playaudioUrl)
      }
   }

   const audioTune = new Audio(playaudioUrl)
   const audioRef = React.useRef(audioTune)

   const handleEndedAudio = React.useCallback(() => {
      setIsPlaying(false)
   }, [])

   React.useEffect(() => {
      if (!tab) {
         addTab('Notifications', '/settings/notifications')
      }
   }, [tab, addTab])

   const togglePlayback = () => {
      if (audioTune.error) {
         toast.error('Wrong Audio Url')
      } else {
         setIsPlaying(!isPlaying)
      }
   }
   const playAudio = () => {
      if (audioTune.error) {
         toast.error('Wrong Audio Url')
      } else {
         audioRef.current.play()
      }
   }
   const pauseAudio = () => {
      audioRef.current.pause()
   }

   React.useEffect(() => {
      if (isPlaying) {
         playAudio()
      } else {
         pauseAudio()
      }
   }, [isPlaying])

   React.useEffect(() => {
      audioRef.current.addEventListener('ended', handleEndedAudio)
      return () => {
         audioRef.current.removeEventListener('ended', handleEndedAudio)
      }
   }, [handleEndedAudio, isPlaying])

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
                  playAudio: notificationType.playAudio,
                  audioUrl: notificationType.audioUrl,
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
      const cellValue = cell._cell.getValue()
      return (
         <>
            {emailConfigs.length > 0 ? (
               <ButtonGroup onClick={() => openTunnel(1)}>
                  <AvatarGroup>
                     <Avatar title="Mary" />
                     <Avatar title="James Arthur" />
                  </AvatarGroup>
                  <Tag>
                     {emailConfigs.length}
                     <PlusIcon />
                  </Tag>
               </ButtonGroup>
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
               title: 'Audio',
               field: 'playAudio',
               editor: true,
               formatter: reactFormatter(
                  <ToggleButton
                     toggleHandler={toggleHandler}
                     toggleType="playAudio"
                  />
               ),
               width: 100,
            },
            {
               title: 'Play',
               field: 'audioUrl',
               formatter: reactFormatter(
                  <>
                     <ButtonGroup onClick={togglePlayback}>
                        {isPlaying ? <PauseButton /> : <PlayButton />}
                     </ButtonGroup>
                  </>
               ),
               width: 100,
               editor: true,
               cellClick: (e, cell) => rowClick(e, cell),
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
         cellClick: (e, cell) => rowClick(e, cell),
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
         <audio ref={audioRef} src={playaudioUrl}></audio>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="md">
               <AddEmailAdresses typeid={typeid} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export default NotificationTable
