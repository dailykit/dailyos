import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   TextButton,
   TagGroup,
   Tag,
   List,
   ListSearch,
   ListOptions,
   ListItem,
   Tunnels,
   Tunnel,
   useTunnel,
   useMultiList,
   Loader,
   ButtonGroup,
   TunnelHeader,
} from '@dailykit/ui'

import {
   SectionTabs,
   SectionTab,
   SectionTabList,
   SectionTabPanels,
   SectionTabPanel,
} from '../../../../../components'

import { STATIONS } from '../../../../../graphql'

import { TunnelMain, StyledInfo } from '../../styled'

import { Header } from './styled'

export const Users = ({ station }) => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [deleteStationUser] = useMutation(STATIONS.USERS.DELETE)
   const [updateStationUserStatus] = useMutation(STATIONS.USERS.UPDATE)
   const {
      error,
      loading,
      data: { settings_user: users = [] } = {},
   } = useSubscription(STATIONS.USERS.LIST, {
      variables: {
         _eq: station.id,
      },
   })

   const updateStatus = (keycloakId, status) => {
      updateStationUserStatus({
         variables: {
            stationId: station.id,
            userKeycloakId: keycloakId,
            active: status,
         },
      })
   }

   const deleteUser = id => {
      deleteStationUser({
         variables: {
            stationId: station.id,
            userKeycloakId: id,
         },
      })
   }

   return (
      <>
         <SectionTabs>
            <SectionTabList>
               <TextButton
                  type="outline"
                  style={{ marginBottom: 8 }}
                  onClick={() => setIsOpen(true)}
               >
                  Add User
               </TextButton>
               {station.user.nodes.map(node => (
                  <SectionTab
                     key={node.user.id}
                     title={`${node.user.firstName} ${node.user.lastName}`}
                  />
               ))}
            </SectionTabList>
            <SectionTabPanels>
               {station.user.nodes.map(node => (
                  <SectionTabPanel key={node.user.id}>
                     <Header>
                        <div>
                           <h2>
                              {node.user.firstName} {node.user.lastName}
                           </h2>
                           {node.active && <Tag>Active</Tag>}
                        </div>
                        <ButtonGroup align="right">
                           <TextButton
                              type="solid"
                              onClick={() =>
                                 updateStatus(
                                    node.user.keycloakId,
                                    !node.active
                                 )
                              }
                           >
                              Mark {node.active ? 'Inactive' : 'Active'}
                           </TextButton>
                           <TextButton
                              type="outline"
                              onClick={() => deleteUser(node.user.keycloakId)}
                           >
                              Unassign
                           </TextButton>
                        </ButtonGroup>
                     </Header>
                  </SectionTabPanel>
               ))}
            </SectionTabPanels>
         </SectionTabs>
         {isOpen && (
            <AddUserTunnel
               error={error}
               isOpen={isOpen}
               loading={loading}
               station={station.id}
               setIsOpen={setIsOpen}
               data={users.map(({ id, firstName, lastName, keycloakId }) => ({
                  id,
                  keycloakId,
                  title: `${firstName} ${lastName}`,
               }))}
            />
         )}
      </>
   )
}

const AddUserTunnel = ({
   isOpen,
   station,
   setIsOpen,
   error,
   loading,
   data,
}) => {
   const [search, setSearch] = React.useState('')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [createStationUsers] = useMutation(STATIONS.USERS.CREATE, {
      onCompleted: () => {
         setIsOpen(false)
      },
   })

   const [list, selected, selectOption] = useMultiList(data)

   React.useEffect(() => {
      if (isOpen) {
         openTunnel(1)
      } else {
         closeTunnel(1)
      }
   }, [isOpen])

   const handleSubmit = () => {
      createStationUsers({
         variables: {
            objects: selected.map(user => ({
               stationId: station,
               userKeycloakId: user.keycloakId,
            })),
         },
      })
   }

   if (loading) return <Loader />
   if (error) return <div>{error.message}</div>
   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1} size="sm">
            <TunnelHeader
               title="Add User"
               right={
                  selected.length > 0 && { action: handleSubmit, title: 'Save' }
               }
               close={() => setIsOpen(false)}
            />
            <TunnelMain>
               {list.length > 0 && (
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
                                 type="MSL111"
                                 content={{
                                    img: '',
                                    roles: [],
                                    title: option.title,
                                 }}
                                 key={option.id}
                                 onClick={() => selectOption('id', option.id)}
                                 isActive={selected.find(
                                    item => item.id === option.id
                                 )}
                              />
                           ))}
                     </ListOptions>
                  </List>
               )}
               {list.length === 0 && (
                  <StyledInfo>No users left to add!</StyledInfo>
               )}
            </TunnelMain>
         </Tunnel>
      </Tunnels>
   )
}
