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

import { SAFETY_CHECK, USERS } from '../../../graphql'
import { StyledWrapper, MasterSettings, Container } from '../styled'
import { StyledBody, StyledHeader, StyledMeta, StyledRule } from '../styled'
import { UserTunnel, CheckTunnel } from './tunnels'
import { Context } from '../../../context'

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
                  <Text as="p">Users</Text>
                  <Container
                     bottom="32"
                     hidden={!state.SafetyCheckPerUsers?.length}
                  >
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell>Uses Mask</TableCell>
                              <TableCell>Uses Sanitizer</TableCell>
                              <TableCell>Temprature</TableCell>
                              <TableCell></TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {state.SafetyCheckPerUsers?.map(check => (
                              <TableRow key={check.id}>
                                 <TableCell>"Hello"</TableCell>
                                 <TableCell>
                                    <Checkbox checked={check.usesMask} />
                                 </TableCell>
                                 <TableCell>
                                    <Checkbox checked={check.usesSanitizer} />
                                 </TableCell>
                                 <TableCell>{check.temprature}</TableCell>
                                 <TableCell>
                                    <span onClick={() => console.log(check.id)}>
                                       <DeleteIcon />
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
                        text="Add User"
                        onClick={() => openTunnel(1)}
                     />
                  </Container>
               </Container>
            </StyledBody>
         </StyledWrapper>
      </SafetyCheckContext.Provider>
   )
}
