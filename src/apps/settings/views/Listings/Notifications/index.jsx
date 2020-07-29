import React from 'react'
import { useTabs } from '../../../context'
import { useHistory } from 'react-router-dom'
import { NOTIFICATION_TYPES, UPDATE_NOTIFICATION_TYPE } from '../../../graphql'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { StyledWrapper, StyledHeader } from '../styled'
import { Container, Flex } from './styled'
import { Loader } from '../../../components'
import SideNav from './SideNav'
import {
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

const NotificationsTable = ({ id, title, data }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(2)
   const [updateNotificationType] = useMutation(UPDATE_NOTIFICATION_TYPE)
   return (
      <>
         <Container id={id} height="100">
            <StyledHeader>
               <Container left="32">
                  <Text as="h1">{title}</Text>
               </Container>
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
                  {data.map(row => (
                     <TableRow key={row.id} id={row.id}>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.template.title}</TableCell>
                        <TableCell>
                           <TableRow>
                              <TableCell>
                                 <Toggle
                                    checked={row.isGlobal}
                                    label="Show on DailyOS"
                                    setChecked={e => {
                                       updateNotificationType({
                                          variables: {
                                             id: row.id,
                                             _set: {
                                                isGlobal: !row.isGlobal,
                                             },
                                          },
                                       })
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
                                       updateNotificationType({
                                          variables: {
                                             id: row.id,
                                             _set: {
                                                isLocal: !row.isLocal,
                                             },
                                          },
                                       })
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
                                    updateNotificationType({
                                       variables: {
                                          id: row.id,
                                          _set: {
                                             playAudio: !row.playAudio,
                                          },
                                       },
                                    })
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
                                    <ol type="1">
                                       {row.emailConfigs.map(email => (
                                          <li>{email}</li>
                                       ))}
                                       <li>
                                          <Input
                                             type="text"
                                             placeholder="enter email address"
                                             name="email"
                                             id="email"
                                          />
                                       </li>
                                    </ol>
                                    <ButtonTile
                                       type="primary"
                                       text="Add an email address"
                                       onClick={e => {
                                          updateNotificationType({
                                             variables: {
                                                id: row.id,
                                                _set: {
                                                   isLocal: !row.isLocal,
                                                },
                                             },
                                          })
                                       }}
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
                                    <ol type="1">
                                       {row.smsConfigs.map(phno => (
                                          <li>{phno}</li>
                                       ))}
                                    </ol>

                                    <ButtonTile
                                       type="primary"
                                       text="Add a phone number"
                                       /*onClick={ e => {
                                          updateNotificationType({
                                             variables: {
                                                id: row.id,
                                                _set: {
                                                   isLocal: !row.isLocal,
                                                },
                                             },
                                          })
                                       } }*/
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
                                 updateNotificationType({
                                    variables: {
                                       id: row.id,
                                       _set: {
                                          isActive: !row.isActive,
                                       },
                                    },
                                 })
                              }}
                           />
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </Container>
      </>
   )
}

const Notifications = () => {
   const { loading, error, data } = useSubscription(NOTIFICATION_TYPES)
   const history = useHistory()
   const { tabs, addTab } = useTabs()
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
   const apps = [...new Set(data.notificationTypes.map(row => row.app))]
   return (
      <Flex direction="row">
         <SideNav />
         <Container>
            {apps.map(app => {
               const content = data.notificationTypes.filter(
                  row => row.app == app
               )
               return (
                  <Container>
                     <NotificationsTable
                        id={app}
                        title={`${app} App`}
                        data={content}
                     />
                  </Container>
               )
            })}
         </Container>
      </Flex>
   )
}

export default Notifications
