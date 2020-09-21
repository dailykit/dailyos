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
} from '@dailykit/ui'

import { ROLES } from '../../../graphql'
import { useTabs } from '../../../context'
import { InlineLoader } from '../../../../../shared/components'
import { Apps, AppsTunnel, Users, UsersTunnel } from './sections'
import { StyledWrapper, StyledHeader, StyledSection } from '../styled'

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
      onSubscriptionData: ({
         subscriptionData: { data: { role = {} } = {} } = {},
      }) => {
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
      },
   })

   React.useEffect(() => {
      if (!loading && !tab && role?.id) {
         addTab(role.title, `/settings/roles/${role.id}`)
      }
   }, [loading, role, params.id, tab, addTab])

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
      <StyledWrapper>
         <StyledHeader>
            <Text as="title">{role.title}</Text>
            <TextButton type="solid" onClick={publish}>
               Publish
            </TextButton>
         </StyledHeader>
         <StyledSection>
            <Text as="h2">Apps ({apps.length})</Text>
            {apps.length > 0 && <Apps apps={apps} />}
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text="Select and Configure Apps"
               onClick={() => openAppsTunnel(1)}
            />
         </StyledSection>
         <StyledSection>
            <Text as="h2">Users ({users.length})</Text>
            {users.length > 0 && <Users users={users} />}
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text="Select and Configure Users"
               onClick={() => openUsersTunnel(1)}
            />
         </StyledSection>
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
      </StyledWrapper>
   )
}

export default RoleForm
