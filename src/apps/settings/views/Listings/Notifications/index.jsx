import React, { useState } from 'react'
import { useTabs } from '../../../context'
import { useHistory } from 'react-router-dom'
import {
   NOTIFICATION_TYPES,
   UPDATE_NOTIFICATION_TYPE,
   CREATE_NOTIFICATION_EMAIL_CONFIGS,
   CREATE_NOTIFICATION_SMS_CONFIGS,
} from '../../../graphql'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { StyledWrapper, StyledHeader } from '../styled'
import { Container, Flex, TunnelBody } from './styled'
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
   const [createNotificationEmailConfigs] = useMutation(
      CREATE_NOTIFICATION_EMAIL_CONFIGS
   )
   const [createNotificationSmsConfigs] = useMutation(
      CREATE_NOTIFICATION_SMS_CONFIGS
   )
   var num = 1
   const [email, setEmail] = useState([
      {
         typeId: '',
         email: '',
         isActive: true,
      },
   ])
   const [sms, setSms] = useState([
      {
         typeId: '',
         phoneNo: null,
         isActive: true,
      },
   ])
   function handleEmail(i, event, id) {
      const values = [...email]
      values[i].email = event.target.value
      values[i].typeId = id
      setEmail(values)
   }
   function handleSms(i, event, id) {
      const values = [...sms]
      values[i].phoneNo = event.target.value
      values[i].typeId = id
      setEmail(values)
   }
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
                  {data.map(row => {
                     return (
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
                                             action: () => {
                                                createNotificationEmailConfigs({
                                                   variables: {
                                                      objects: email,
                                                   },
                                                })
                                                setEmail([
                                                   {
                                                      typeId: '',
                                                      email: '',
                                                      isActive: true,
                                                   },
                                                ])
                                             },
                                             title: 'Save',
                                          }}
                                          close={() => closeTunnel(1)}
                                       />
                                       <TunnelBody>
                                          <ol type="1">
                                             {row.emailConfigs.map(email => (
                                                <li>{email.email}</li>
                                             ))}
                                             {email.map((inputRow, i) => (
                                                <li>
                                                   <Input
                                                      type="text"
                                                      placeholder="enter email address"
                                                      name="email"
                                                      id="email"
                                                      value={inputRow.email}
                                                      onChange={e =>
                                                         handleEmail(
                                                            i,
                                                            e,
                                                            row.id
                                                         )
                                                      }
                                                   />
                                                </li>
                                             ))}

                                             <ButtonTile
                                                type="primary"
                                                text="Add an email address"
                                                onClick={e =>
                                                   setEmail(
                                                      email.concat({
                                                         typeId: '',
                                                         email: '',
                                                         isActive: true,
                                                      })
                                                   )
                                                }
                                                style={{ margin: '20px 0' }}
                                             />
                                          </ol>
                                       </TunnelBody>
                                    </Tunnel>
                                    <Tunnel layer={2}>
                                       <TunnelHeader
                                          title="Configure SMS"
                                          right={{
                                             action: () => {
                                                createNotificationSmsConfigs({
                                                   variables: {
                                                      objects: sms,
                                                   },
                                                })
                                                setEmail([
                                                   {
                                                      typeId: '',
                                                      phoneNo: '',
                                                      isActive: true,
                                                   },
                                                ])
                                             },
                                             title: 'Save',
                                          }}
                                          close={() => closeTunnel(2)}
                                       />
                                       <TunnelBody>
                                          <ol type="1">
                                             {row.smsConfigs.map(phno => (
                                                <li>{phno.phoneNo}</li>
                                             ))}

                                             {sms.map((inputRow, i) => (
                                                <li>
                                                   <Input
                                                      type="text"
                                                      placeholder="contact number"
                                                      name="contact"
                                                      id="contact"
                                                      value={inputRow.phoneNo}
                                                      onChange={e =>
                                                         handleSms(i, e, row.id)
                                                      }
                                                   />
                                                </li>
                                             ))}
                                          </ol>

                                          <ButtonTile
                                             type="primary"
                                             text="Add a phone number"
                                             onClick={e =>
                                                setSms(
                                                   sms.concat({
                                                      typeId: '',
                                                      phoneNo: '',
                                                      isActive: true,
                                                   })
                                                )
                                             }
                                             style={{ margin: '20px 0' }}
                                          />
                                       </TunnelBody>
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
                     )
                  })}
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
