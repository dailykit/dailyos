import React from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty, uniqBy } from 'lodash'
import { useQuery } from '@apollo/react-hooks'

// Components
import {
   TextButton,
   Tunnels,
   Tunnel,
   useTunnel,
   useMultiList,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   Avatar,
   TunnelHeader,
   TagGroup,
   Tag,
} from '@dailykit/ui'

import { StyledAppItem } from './styled'
import { ROLES } from '../../../../graphql'
import { PermissionsTunnel } from './permissions'
import { InlineLoader, Flex } from '../../../../../../shared/components'

export const Apps = ({ apps }) => {
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [selectedApp, setSelectedApp] = React.useState(null)

   const selectApp = app => {
      setSelectedApp(app)
      openTunnel(1)
   }

   return (
      <>
         {apps.map(({ app }) => (
            <StyledAppItem key={app.id}>
               <Avatar url="" withName type="round" title={app.title} />
               <TextButton type="ghost" onClick={() => selectApp(app)}>
                  Manage Permissions
               </TextButton>
            </StyledAppItem>
         ))}
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <PermissionsTunnel
                  app={selectedApp}
                  setApp={setSelectedApp}
                  closeTunnel={closeTunnel}
               />
            </Tunnel>
         </Tunnels>
      </>
   )
}

export const AppsTunnel = ({ closeTunnel, selectedApps }) => {
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
         if (!isEmpty(list)) {
            setApps(list.map(node => ({ ...node, icon: '' })))
         }
      },
   })
   const [list, selected, selectOption] = useMultiList(apps)

   const save = () => {
      closeTunnel(1)
      selectedApps(value =>
         uniqBy([...value, ...selected.map(node => ({ app: node }))], 'app.id')
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
