import React from 'react'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import {
   TableBody,
   TableCell,
   TableHead,
   Loader,
   Tunnel,
   Tunnels,
   useTunnel,
   Text,
   Table,
   TableRow,
   ButtonTile,
   Checkbox,
} from '@dailykit/ui'
import * as moment from 'moment'
import { useTranslation } from 'react-i18next'
import { DeleteIcon } from '../../../assets/icons'
import { toast } from 'react-toastify'
import {
   reducer,
   SafetyCheckContext,
   state as initialState,
} from '../../../context/check'

import { SAFETY_CHECK, USERS, DELETE_CHECKUP } from '../../../graphql'
import { StyledWrapper, Container } from '../styled'
import { StyledBody, StyledHeader } from '../styled'
import { UserTunnel, CheckTunnel } from './tunnels'
import { Context } from '../../../context'

const address = 'apps.safety.views.forms.safetyform.'
export default function SimpleRecipeProduct() {
   const { t } = useTranslation()

   const { state: tabs } = React.useContext(Context)
   const [checkState, checkDispatch] = React.useReducer(reducer, initialState)

   const [state, setState] = React.useState({})

   const [tunnels, openTunnel, closeTunnel] = useTunnel()

   const [users, setUsers] = React.useState([])

   // Subscription
   const { loading } = useSubscription(SAFETY_CHECK, {
      variables: {
         id: tabs.current.id,
      },
      onSubscriptionData: data => {
         console.log(data)
         setState(data.subscriptionData.data.safety_safetyCheck[0])
      },
   })
   useSubscription(USERS, {
      onSubscriptionData: data => {
         const users = data.subscriptionData.data.settings_user.map(user => ({
            id: user.id,
            title: user.firstName + ' ' + user.lastName,
         }))
         setUsers(users)
      },
   })

   // Mutation
   const [deleteCheckup] = useMutation(DELETE_CHECKUP, {
      onCompleted: () => {
         toast.success(t(address.concat('check deleted!')))
      },
      onError: error => {
         console.log(error)
         toast.error(t(address.concat('error')))
      },
   })

   if (loading) return <Loader />

   return (
      <SafetyCheckContext.Provider value={{ checkState, checkDispatch }}>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1}>
               <UserTunnel
                  openTunnel={openTunnel}
                  closeTunnel={closeTunnel}
                  users={users}
               />
            </Tunnel>
            <Tunnel layer={2}>
               <CheckTunnel state={state} closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
         <StyledWrapper>
            <StyledHeader>
               <div>
                  <Text as="title">
                     {moment(state.created_at).format('LLL')}
                  </Text>
               </div>
            </StyledHeader>
            <StyledBody>
               <Container paddingX="64">
                  <Text as="p">{t(address.concat('users'))}</Text>
                  <Container
                     bottom="32"
                     hidden={!state.SafetyCheckPerUsers?.length}
                  >
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>{t(address.concat('name'))}</TableCell>
                              <TableCell>
                                 {t(address.concat('uses mask'))}
                              </TableCell>
                              <TableCell>
                                 {t(address.concat('uses sanitizer'))}
                              </TableCell>
                              <TableCell>
                                 {t(address.concat('temprature'))}
                              </TableCell>
                              <TableCell></TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {state.SafetyCheckPerUsers?.map(check => (
                              <TableRow key={check.id}>
                                 <TableCell>
                                    {check.user.firstName +
                                       ' ' +
                                       check.user.lastName}
                                 </TableCell>
                                 <TableCell>
                                    <Checkbox
                                       checked={check.usesMask}
                                       onChange={() => console.log()}
                                    />
                                 </TableCell>
                                 <TableCell>
                                    <Checkbox
                                       checked={check.usesSanitizer}
                                       onChange={() => console.log()}
                                    />
                                 </TableCell>
                                 <TableCell>
                                    {check.temperature} &deg;F
                                 </TableCell>
                                 <TableCell>
                                    <span
                                       onClick={() =>
                                          deleteCheckup({
                                             variables: {
                                                id: check.id,
                                             },
                                          })
                                       }
                                    >
                                       <DeleteIcon color="#FF5A52" />
                                    </span>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Container>
                  <Container>
                     <ButtonTile
                        type="secondary"
                        text={t(address.concat('add user'))}
                        onClick={() => openTunnel(1)}
                     />
                  </Container>
               </Container>
            </StyledBody>
         </StyledWrapper>
      </SafetyCheckContext.Provider>
   )
}
