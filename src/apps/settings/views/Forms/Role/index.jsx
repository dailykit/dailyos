import React from 'react'
import _ from 'lodash'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation, useQuery } from '@apollo/react-hooks'

// Components
import {
   TextButton,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   useMultiList,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   Avatar,
   ArrowUpIcon,
   ArrowDownIcon,
   Text,
   TunnelHeader,
   TagGroup,
   Tag,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { StyledWrapper, StyledHeader, StyledSection } from '../styled'
import { ROLES } from '../../../graphql'
import { StyledAppItem } from './styled'
import { InlineLoader, Flex } from '../../../../../shared/components'
import { toast } from 'react-toastify'

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
      const _apps = _.differenceBy(apps, role.apps, 'app.id')
      if (!_.isEmpty(_apps)) {
         insertApps({
            variables: {
               objects: _apps.map(({ app }) => ({
                  appId: app.id,
                  roleId: role.id,
               })),
            },
         })
      }

      const _users = _.differenceBy(
         users,
         role.users.map(node => ({
            user: { ...node.user, id: node.user.keycloakId },
         })),
         'user.id'
      )
      if (!_.isEmpty(_users)) {
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

const Apps = ({ apps }) => {
   const [isOpen, setIsOpen] = React.useState('')

   return (
      <>
         {apps.map(({ app }) => (
            <StyledAppItem key={app.id}>
               <div>
                  <div>
                     <Avatar url="" withName type="round" title={app.title} />
                     <span
                        tabIndex="0"
                        role="button"
                        onClick={() =>
                           setIsOpen(value =>
                              value === app.title ? '' : app.title
                           )
                        }
                        onKeyPress={e =>
                           e.charCode === 32 &&
                           setIsOpen(value =>
                              value === app.title ? '' : app.title
                           )
                        }
                     >
                        {isOpen === app.title ? (
                           <ArrowUpIcon color="#555B6E" size={24} />
                        ) : (
                           <ArrowDownIcon color="#555B6E" size={24} />
                        )}
                     </span>
                  </div>
               </div>
            </StyledAppItem>
         ))}
      </>
   )
}

const AppsTunnel = ({ closeTunnel, selectedApps }) => {
   const params = useParams()
   const [apps, setApps] = React.useState([])
   const [search, setSearch] = React.useState('')
   const { loading } = useQuery(ROLES.APPS, {
      variables: {
         roleId: {
            _eq: params.id,
         },
      },
      onCompleted: ({ apps: list = [] } = {}) => {
         if (!_.isEmpty(list)) {
            setApps(list.map(node => ({ ...node, icon: '' })))
         }
      },
   })
   const [list, selected, selectOption] = useMultiList(apps)

   const save = () => {
      closeTunnel(1)
      selectedApps(value =>
         _.uniqBy(
            [...value, ...selected.map(node => ({ app: node }))],
            'app.id'
         )
      )
   }

   return (
      <>
         <TunnelHeader
            title="Add Apps"
            right={{ action: save, title: 'Save' }}
            close={() => closeTunnel(1)}
         />
         <Flex padding="16px">
            {loading ? (
               <InlineLoader />
            ) : (
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
                              type="MSL1101"
                              key={option.id}
                              content={{
                                 icon: option.icon,
                                 title: option.title,
                              }}
                              onClick={() => selectOption('id', option.id)}
                              isActive={selected.find(
                                 item => item.id === option.id
                              )}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </Flex>
      </>
   )
}

const Users = ({ users }) => {
   return (
      <ul>
         {users.map(({ user }) => (
            <li
               key={user.id}
               style={{ marginBottom: '16px', listStyle: 'none' }}
            >
               <Avatar withName url="" title={user.title} />
            </li>
         ))}
      </ul>
   )
}

const UsersTunnel = ({ closeTunnel, selectedUsers }) => {
   const params = useParams()
   const [users, setUsers] = React.useState([])
   const [search, setSearch] = React.useState('')
   const { loading } = useQuery(ROLES.USERS, {
      variables: {
         roleId: {
            _eq: params.id,
         },
      },
      onCompleted: ({ users: list = [] } = {}) => {
         if (!_.isEmpty(list)) {
            setUsers(
               list.map(node => ({
                  id: node.keycloakId,
                  title: node.firstName + ' ' + node.lastName,
                  description: node.email,
               }))
            )
         }
      },
   })
   const [list, selected, selectOption] = useMultiList(users)

   const save = () => {
      closeTunnel(1)
      selectedUsers(value =>
         _.uniqBy(
            [...value, ...selected.map(node => ({ user: node }))],
            'user.id'
         )
      )
   }

   return (
      <>
         <TunnelHeader
            title="Add Apps"
            right={{ action: save, title: 'Save' }}
            close={() => closeTunnel(1)}
         />
         <Flex padding="16px">
            {loading ? (
               <InlineLoader />
            ) : (
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
                                 icon: option.icon,
                                 title: option.title,
                              }}
                              onClick={() => selectOption('id', option.id)}
                              isActive={selected.find(
                                 item => item.id === option.id
                              )}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </Flex>
      </>
   )
}
