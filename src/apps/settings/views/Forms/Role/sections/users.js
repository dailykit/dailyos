import React from 'react'
import { useParams } from 'react-router-dom'
import { isEmpty, uniqBy } from 'lodash'
import { useQuery } from '@apollo/react-hooks'

// Components
import {
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

import { ROLES } from '../../../../graphql'
import { InlineLoader, Flex } from '../../../../../../shared/components'

export const Users = ({ users }) => {
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

export const UsersTunnel = ({ closeTunnel, selectedUsers }) => {
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
         if (!isEmpty(list)) {
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
         uniqBy(
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
