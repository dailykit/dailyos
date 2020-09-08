import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'
import {
   Text,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Avatar,
   IconButton,
   ButtonGroup,
   PlusIcon,
   Tunnels,
   Tunnel,
   useTunnel,
   TunnelHeader,
   useMultiList,
   List,
   ListSearch,
   TagGroup,
   Tag,
   ListOptions,
   ListItem,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { Spacer } from '../../../../../shared/styled'
import { StyledWrapper, StyledHeader } from '../styled'
import { DeleteIcon } from '../../../../../shared/assets/icons'
import { ROLES, DELETE_USERS_APPS_ROLES } from '../../../graphql'
import { InlineLoader, Flex } from '../../../../../shared/components'

const RoleForm = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const [selectedApp, setSelectedApp] = React.useState(null)
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
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
            <Text as="title">{role.title}</Text>
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
                        <IconButton
                           type="solid"
                           onClick={() => {
                              openTunnel(1)
                              setSelectedApp(app.id)
                           }}
                        >
                           <PlusIcon />
                        </IconButton>
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
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <AddUserTunnel closeTunnel={closeTunnel} appId={selectedApp} />
            </Tunnel>
         </Tunnels>
      </StyledWrapper>
   )
}

export default RoleForm

const AddUserTunnel = ({ closeTunnel, appId }) => {
   const params = useParams()
   const [users, setUsers] = React.useState([])
   const [search, setSearch] = React.useState('')
   const [insert] = useMutation(ROLES.INSERT_USERS_ROLES_APPS, {
      onCompleted: () => {
         closeTunnel(1)
         toast.success('Succesfully assigned role to the selected users.')
      },
      onError: () => {
         toast.error('Failed to assign role to the selected users.')
      },
   })
   const { loading } = useQuery(ROLES.USERS, {
      variables: {
         roleId: { _eq: params.id },
      },
      onCompleted: ({ users: list = [] }) => {
         const formatted = list
            .filter(
               node =>
                  _.isEmpty(node.users_roles_apps) ||
                  node.users_roles_apps.some(node => node.app.id !== appId)
            )
            .map(node => ({
               id: node.keycloakId,
               description: node.email,
               title: node.firstName
                  ? node.firstName + ' ' + node.lastName
                  : 'N/A',
            }))
         setUsers(formatted)
      },
   })
   const [list, selected, selectOption] = useMultiList(users)

   const addUser = () => {
      const objects = selected.map(node => ({
         appId,
         roleId: params.id,
         keycloakId: node.id,
      }))
      insert({
         variables: {
            objects,
         },
      })
   }

   if (loading) return <InlineLoader />
   return (
      <>
         <TunnelHeader
            title="Add User"
            close={() => closeTunnel(1)}
            right={{ action: () => addUser(), title: 'Save' }}
         />
         <Flex padding="16px">
            <List>
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
               {selected.length > 0 && (
                  <TagGroup style={{ margin: '8px 0' }}>
                     {selected.map(option => (
                        <Tag
                           key={option.id}
                           title={option.title}
                           onClick={() => selectOption('id', option.id)}
                        >
                           {option.title}
                        </Tag>
                     ))}
                  </TagGroup>
               )}
               <ListOptions>
                  {list
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="MSL2"
                           key={option.id}
                           content={{
                              title: option.title,
                              description: option.description,
                           }}
                           onClick={() => selectOption('id', option.id)}
                           isActive={selected.find(
                              item => item.id === option.id
                           )}
                        />
                     ))}
               </ListOptions>
            </List>
         </Flex>
      </>
   )
}
