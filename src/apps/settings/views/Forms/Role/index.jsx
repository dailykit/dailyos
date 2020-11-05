import React from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { isEmpty, differenceBy } from 'lodash'
import { useSubscription, useMutation } from '@apollo/react-hooks'

// Components
import {
   TextButton,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   Text,
   Flex,
} from '@dailykit/ui'

import { ROLES } from '../../../graphql'
import { useTabs } from '../../../context'
import { Spacer } from '../../../../../shared/styled'
import { Apps, AppsTunnel, Users, UsersTunnel } from './sections'
import { InlineLoader, Tooltip } from '../../../../../shared/components'

const RoleForm = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const [apps, setApps] = React.useState([])
   const [users, setUsers] = React.useState([])
   const [insertApps] = useMutation(ROLES.INSERT_ROLES_APPS, {
      onCompleted: () => {
         toast.success('Apps added successfully to the role.')
      },
      onError: () => {
         toast.error('Failed to add apps to the role.')
      },
   })
   const [insertUsers] = useMutation(ROLES.INSERT_ROLES_USERS, {
      onCompleted: () => {
         toast.success('Users added successfully to the role.')
      },
      onError: () => {
         toast.error('Failed to add users to the role.')
      },
   })
   const [appsTunnels, openAppsTunnel, closeAppsTunnel] = useTunnel(1)
   const [usersTunnels, openUsersTunnel, closeUsersTunnel] = useTunnel(1)
   const { loading, data: { role = {} } = {} } = useSubscription(ROLES.ROLE, {
      variables: {
         id: params.id,
      },
   })

   React.useEffect(() => {
      if (!loading && !tab && role?.id) {
         addTab(role.title, `/settings/roles/${role.id}`)
      }
   }, [loading, role, params.id, tab, addTab])

   React.useEffect(() => {
      if (!loading && role?.id) {
         setApps(role.apps)
         setUsers(
            role.users.map(({ user }) => ({
               user: {
                  id: user.keycloakId,
                  title: user.firstName
                     ? user.firstName + ' ' + user.lastName
                     : 'Not Available',
                  description: user.email,
               },
            }))
         )
      }
   }, [loading, role])

   const publish = () => {
      const _apps = differenceBy(apps, role.apps, 'app.id')
      if (!isEmpty(_apps)) {
         insertApps({
            variables: {
               objects: _apps.map(({ app }) => ({
                  appId: app.id,
                  roleId: role.id,
               })),
            },
         })
      }

      const _users = differenceBy(
         users,
         role.users.map(node => ({
            user: { ...node.user, id: node.user.keycloakId },
         })),
         'user.id'
      )
      if (!isEmpty(_users)) {
         insertUsers({
            variables: {
               objects: _users.map(({ user }) => ({
                  userId: user.id,
                  roleId: role.id,
               })),
            },
         })
      }
   }

   if (loading) return <InlineLoader />
   return (
      <Flex padding="0 32px">
         <Flex
            container
            as="header"
            height="80px"
            margin="0 auto"
            alignItems="center"
            justifyContent="space-between"
         >
            <Text as="title">{role.title}</Text>
            <TextButton type="solid" onClick={publish}>
               Publish
            </TextButton>
         </Flex>
         <Flex>
            <Flex container alignItems="center">
               <Text as="h2">Apps ({apps.length})</Text>
               <Tooltip identifier="form_role_section_apps_heading" />
            </Flex>
            <Spacer size="16px" />
            {apps.length > 0 && <Apps apps={apps} />}
            <Spacer size="16px" />
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text="Select and Configure Apps"
               onClick={() => openAppsTunnel(1)}
            />
         </Flex>
         <Spacer size="24px" />
         <Flex>
            <Flex container alignItems="center">
               <Text as="h2">Users ({users.length})</Text>
               <Tooltip identifier="form_role_section_users_heading" />
            </Flex>
            <Spacer size="16px" />
            {users.length > 0 && <Users users={users} />}
            <Spacer size="16px" />
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text="Select and Configure Users"
               onClick={() => openUsersTunnel(1)}
            />
         </Flex>
         <Spacer size="24px" />
         <Tunnels tunnels={appsTunnels}>
            <Tunnel layer={1} size="sm">
               <AppsTunnel
                  selectedApps={setApps}
                  closeTunnel={closeAppsTunnel}
               />
            </Tunnel>
         </Tunnels>
         <Tunnels tunnels={usersTunnels}>
            <Tunnel layer={1} size="sm">
               <UsersTunnel
                  selectedUsers={setUsers}
                  closeTunnel={closeUsersTunnel}
               />
            </Tunnel>
         </Tunnels>
      </Flex>
   )
}

export default RoleForm
