import React from 'react'
import { useTabs } from '../../../context'
import { useHistory } from 'react-router-dom'
import { reactFormatter, ReactTabulator } from 'react-tabulator'
import { NOTIFICATIONS, UPDATE_NOTIFICATION } from '../../../graphql'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { StyledWrapper, StyledHeader } from '../styled'
import { Loader } from '../../../components'
import {
   ButtonGroup,
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   AvatarGroup,
   Avatar,
   Text,
   Toggle,
   Tunnels,
   Tunnel,
   useTunnel,
   TextButton,
   TunnelHeader,
   Input,
   ButtonTile,
} from '@dailykit/ui'

const Notifications = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const { loading, error, data } = useSubscription(NOTIFICATIONS)
   const [updateNotification] = useMutation(UPDATE_NOTIFICATION)
   //const [checked, setChecked] = React.useState(true)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)

   React.useEffect(() => {
      const tab =
         tabs.find(item => item.path === `/settings/notifications`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])
   if (loading)
      return (
         <StyledWrapper>
            <Loader />
         </StyledWrapper>
      )
   if (error) return <StyledWrapper>{error.message}</StyledWrapper>
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Order App</Text>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>Notifications</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Display Settings</TableCell>
                  <TableCell>Notification Audio</TableCell>
                  <TableCell>Send Emails</TableCell>
                  <TableCell>Send SMS</TableCell>
                  <TableCell>Active</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.notificationTypes.map(row => (
                  <TableRow key={row.id}>
                     <TableCell>{row.description}</TableCell>
                     <TableCell>{row.template.title}</TableCell>
                     <TableCell>
                        <TableRow>
                           <TableCell>
                              <Toggle
                                 checked={row.isGlobal}
                                 label="Show on DailyOS"
                                 setChecked={e => {
                                    updateNotification({
                                       variables: {
                                          id: row.id,
                                          isGlobal: !row.isGlobal,
                                          isLocal: row.isLocal,
                                          isActive: row.isActive,
                                          playAudio: row.playAudio,
                                       },
                                    })
                                    //setChecked(isGlobal)
                                 }}
                              />
                           </TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell>
                              <Toggle
                                 checked={row.isLocal}
                                 label="Show on App"
                                 setChecked={e => {
                                    updateNotification({
                                       variables: {
                                          id: row.id,
                                          isGlobal: row.isGlobal,
                                          isLocal: !row.isLocal,
                                          isActive: row.isActive,
                                          playAudio: row.playAudio,
                                       },
                                    })
                                    //setChecked(isGlobal)
                                 }}
                              />
                           </TableCell>
                        </TableRow>
                     </TableCell>
                     <TableCell>
                        <TableRow>
                           <Toggle
                              checked={row.playAudio}
                              label="Play"
                              setChecked={e => {
                                 updateNotification({
                                    variables: {
                                       id: row.id,
                                       isGlobal: row.isGlobal,
                                       isLocal: row.isLocal,
                                       isActive: row.isActive,
                                       playAudio: !row.playAudio,
                                    },
                                 })
                                 //setChecked(isGlobal)
                              }}
                           />
                        </TableRow>
                        <TableRow>{row.audioUrl}</TableRow>
                     </TableCell>
                     <TableCell>
                        <TableRow>
                           <TextButton
                              type="ghost"
                              onClick={() => openTunnel(1)}
                           >
                              Configure
                           </TextButton>
                           <Tunnels tunnels={tunnels}>
                              <Tunnel layer={1}>
                                 <TunnelHeader
                                    title="Configure Email"
                                    right={{
                                       action: () => {},
                                       title: 'Save',
                                    }}
                                    close={() => closeTunnel(1)}
                                 />
                                 <ButtonTile
                                    type="primary"
                                    text="Add an email address"
                                    //onClick={ e => console.log('Tile clicked') }
                                    style={{ margin: '20px 0' }}
                                 />
                              </Tunnel>
                              <Tunnel layer={2}>
                                 <TunnelHeader
                                    title="Configure SMS"
                                    right={{
                                       action: () => {},
                                       title: 'Save',
                                    }}
                                    close={() => closeTunnel(2)}
                                 />
                                 <ButtonTile
                                    type="primary"
                                    text="Add a phone number"
                                    //onClick={ e => console.log('Tile clicked') }
                                    style={{ margin: '20px 0' }}
                                 />
                              </Tunnel>
                           </Tunnels>
                        </TableRow>
                        <TableRow>
                           <AvatarGroup>
                              <Avatar title="Mary" />
                              <Avatar
                                 title="Jack Middle Jones"
                                 url="https://randomuser.me/api/portraits/men/61.jpg"
                              />
                              <Avatar title="James Arthur" />
                           </AvatarGroup>
                        </TableRow>
                     </TableCell>
                     <TableCell>
                        <TableRow>
                           <TextButton
                              type="ghost"
                              onClick={() => openTunnel(2)}
                           >
                              Configure
                           </TextButton>
                        </TableRow>
                        <TableRow>
                           <AvatarGroup>
                              <Avatar title="Mary" />
                              <Avatar
                                 title="Jack Middle Jones"
                                 url="https://randomuser.me/api/portraits/men/61.jpg"
                              />
                              <Avatar title="James Arthur" />
                           </AvatarGroup>
                        </TableRow>
                     </TableCell>
                     <TableCell>
                        <Toggle
                           checked={row.isActive}
                           setChecked={e => {
                              updateNotification({
                                 variables: {
                                    id: row.id,
                                    isGlobal: row.isGlobal,
                                    isLocal: row.isLocal,
                                    isActive: !row.isActive,
                                    playAudio: row.playAudio,
                                 },
                              })
                              //setChecked(isGlobal)
                           }}
                        />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default Notifications
