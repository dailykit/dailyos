import React from 'react'
import _ from 'lodash'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import { useParams, useHistory } from 'react-router-dom'

// Components
import {
   TextButton,
   IconButton,
   Input,
   ButtonTile,
   Tunnels,
   Tunnel,
   useTunnel,
   ClearIcon,
   useMultiList,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   Avatar,
   TickIcon,
   ArrowUpIcon,
   ArrowDownIcon,
   Toggle,
   Text,
   TunnelHeader,
   TagGroup,
   Tag,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import {
   StyledWrapper,
   StyledHeader,
   StyledSection,
   StyledTunnelHeader,
   StyledTunnelMain,
} from '../styled'
import { ROLES } from '../../../graphql'
import { StyledAppItem, StyledPermissions } from './styled'
import { InlineLoader, Flex } from '../../../../../shared/components'
import { toast } from 'react-toastify'

const RoleForm = () => {
   const params = useParams()
   const { tab, addTab } = useTabs()
   const [isOpen, setIsOpen] = React.useState('')
   const [apps, setApps] = React.useState([])
   const [insert] = useMutation(ROLES.INSERT_ROLES_APPS, {
      onCompleted: () => {
         toast.success('Apps added successfully to the role.')
      },
      onError: () => {
         toast.success('Failed to add apps to the role.')
      },
   })
   const [appsTunnels, openAppsTunnel, closeAppsTunnel] = useTunnel(1)
   const { loading, data: { role = {} } = {} } = useSubscription(ROLES.ROLE, {
      variables: {
         id: params.id,
      },
      onSubscriptionData: ({
         subscriptionData: { data: { role = {} } = {} } = {},
      }) => {
         setApps(role.apps)
      },
   })

   React.useEffect(() => {
      if (!loading && !tab && role?.id) {
         addTab(role.title, `/settings/roles/${role.id}`)
      }
   }, [loading, role.title, params.id, tab, addTab])

   const publish = () => {
      const objects = _.differenceBy(apps, role.apps, 'app.id')
      insert({
         variables: {
            objects: objects.map(({ app }) => ({
               appId: app.id,
               roleId: role.id,
            })),
         },
      })
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
            {apps.length > 0 &&
               apps.map(({ app }) => (
                  <StyledAppItem key={app.id}>
                     <div>
                        <div>
                           <Avatar
                              url=""
                              withName
                              type="round"
                              title={app.title}
                           />
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
                        <TextButton type="ghost">Add Users</TextButton>
                     </div>
                  </StyledAppItem>
               ))}
            <ButtonTile
               noIcon
               size="sm"
               type="secondary"
               text="Select and Configure Apps"
               onClick={() => openAppsTunnel(1)}
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
      </StyledWrapper>
   )
}

export default RoleForm

const AppsTunnel = ({ closeTunnel, selectedApps }) => {
   const params = useParams()
   const [apps, setApps] = React.useState([])
   const [search, setSearch] = React.useState('')
   const { loading } = useSubscription(ROLES.APPS, {
      variables: {
         roleId: {
            _eq: params.id,
         },
      },
      onSubscriptionData: ({
         subscriptionData: { data: { apps: list = [] } = {} } = {},
      }) => {
         if (!_.isEmpty(list)) {
            setApps(value => [
               ...value,
               ...list.map(node => ({ ...node, icon: '' })),
            ])
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
