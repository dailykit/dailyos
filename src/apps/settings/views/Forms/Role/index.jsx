import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
   Input,
   Text,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Avatar,
   IconButton,
   ButtonGroup,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { Spacer } from '../../../../../shared/styled'
import { StyledWrapper, StyledHeader } from '../styled'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { ROLES, DELETE_USERS_APPS_ROLES } from '../../../graphql'
import { InlineLoader, Flex } from '../../../../../shared/components'

const RoleForm = () => {
   const params = useParams()
   const { tab, addTab, setTabTitle } = useTabs()
   const [title, setTitle] = React.useState('')
   const [update] = useMutation(ROLES.UPDATE, {
      onCompleted: ({ updateRole = {} }) => {
         setTabTitle(updateRole.title)
         toast.success('Successfully updated the role title!')
      },
      onError: () => {
         setTitle(role.title)
         toast.error("Can not edit, user's are assigned to this role")
      },
   })
   const [deleteUserFromApp] = useMutation(DELETE_USERS_APPS_ROLES, {
      onCompleted: () => {
         toast.success('Succesfully removed user!')
      },
      onError: error => {
         toast.error(error.message)
      },
   })
   const { loading, data: { role = {} } = {} } = useSubscription(ROLES.ROLE, {
      variables: {
         id: params.id,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { role = {} } = {} } = {},
      }) => {
         setTitle(role.title)
      },
   })
   const { data: { apps = [] } = {} } = useSubscription(ROLES.APPS, {
      variables: {
         title: { _eq: role.title },
      },
   })

   React.useEffect(() => {
      if (!loading && !tab && role?.id) {
         addTab(role.title, `/settings/roles/${role.id}`)
      }
   }, [loading, role.title, params.id, tab, addTab])

   const deleteUser = (userId, appId) => {
      deleteUserFromApp({
         variables: {
            where: {
               appId: { _eq: appId },
               roleId: { _eq: role.id },
               keycloakId: { _eq: userId },
            },
         },
      })
   }

   if (loading) return <InlineLoader />
   return (
      <StyledWrapper>
         <StyledHeader>
            <Input
               type="text"
               value={title}
               name="title"
               label="Title"
               style={{ maxWidth: '280px' }}
               onChange={e => setTitle(e.target.value)}
               onBlur={e =>
                  update({
                     variables: {
                        id: role.id,
                        _set: { title: e.target.value },
                     },
                  })
               }
            />
         </StyledHeader>
         <Flex
            margin="0 auto"
            padding="24px 0"
            maxWidth="980px"
            width="calc(100vw - 40px)"
         >
            <Text as="h2">Apps</Text>
            <Spacer size="24px" />
            <ul>
               {apps.map(app => (
                  <li key={app.id} style={{ listStyle: 'none' }}>
                     <Flex
                        container
                        padding="0 12px"
                        alignItems="center"
                        justifyContent="space-between"
                     >
                        <Text as="title">{app.title}</Text>
                     </Flex>
                     <Spacer size="16px" />
                     <Table>
                        <TableHead>
                           <TableRow>
                              <TableCell>User</TableCell>
                              <TableCell align="right">Actions</TableCell>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           {_.isEmpty(app.users) ? (
                              <Flex padding="16px 0">
                                 <span>No user's assigned.</span>
                              </Flex>
                           ) : (
                              app.users.map(({ user }) => (
                                 <TableRow key={user.id}>
                                    <TableCell>
                                       <Avatar
                                          url=""
                                          key={user.id}
                                          withName
                                          title={
                                             user.firstName
                                                ? user.firstName +
                                                  ' ' +
                                                  user.lastName
                                                : 'N A'
                                          }
                                       />
                                    </TableCell>
                                    <TableCell align="right">
                                       <ButtonGroup align="right">
                                          <IconButton
                                             type="outline"
                                             onClick={() =>
                                                deleteUser(
                                                   user.keycloakId,
                                                   app.id
                                                )
                                             }
                                          >
                                             <DeleteIcon color="#000" />
                                          </IconButton>
                                       </ButtonGroup>
                                    </TableCell>
                                 </TableRow>
                              ))
                           )}
                        </TableBody>
                     </Table>
                     <Spacer size="24px" />
                  </li>
               ))}
            </ul>
         </Flex>
      </StyledWrapper>
   )
}

export default RoleForm
