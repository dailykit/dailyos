import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   TextButton,
   Tag,
   Tunnels,
   Tunnel,
   useTunnel,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   TagGroup,
   useMultiList,
   ButtonGroup,
   TunnelHeader,
} from '@dailykit/ui'

import {
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
   Loader,
} from '../../../../../components'

import { Header } from './styled'
import { TunnelMain, StyledInfo } from '../../styled'

import { STATIONS } from '../../../../../graphql'

export const Scales = ({ station }) => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [update] = useMutation(STATIONS.SCALES.UPDATE)
   const [remove] = useMutation(STATIONS.SCALES.DELETE)

   const { loading, error, data: { scales = [] } = {} } = useSubscription(
      STATIONS.SCALES.LIST
   )
   console.log('Scales -> scales', scales)

   const updateStatus = (num, name, id, status) => {
      update({
         variables: {
            deviceNum: num,
            deviceName: name,
            computerId: id,
            active: status,
         },
      })
   }

   const removeStation = (num, name, id) => {
      remove({
         variables: {
            deviceNum: num,
            deviceName: name,
            computerId: id,
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
                  Add Scale
               </TextButton>
               {station.scale.nodes.map(node => (
                  <SectionTab key={node.deviceNum} title={node.deviceName} />
               ))}
            </SectionTabList>
            <SectionTabPanels>
               {station.scale.nodes.map(node => (
                  <SectionTabPanel key={node.deviceNum}>
                     <Header>
                        <div>
                           <h2>{node.deviceName}</h2>
                           {node.active && <Tag>Active</Tag>}
                        </div>
                        <ButtonGroup align="right">
                           <TextButton
                              type="solid"
                              onClick={() =>
                                 updateStatus(
                                    node.deviceNum,
                                    node.deviceName,
                                    node.computer.printNodeId,
                                    !node.active
                                 )
                              }
                           >
                              Mark {node.active ? 'Inactive' : 'Active'}
                           </TextButton>
                           <TextButton
                              type="outline"
                              onClick={() =>
                                 removeStation(
                                    node.deviceNum,
                                    node.deviceName,
                                    node.computer.printNodeId
                                 )
                              }
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
            <AddPrinterTunnel
               isOpen={isOpen}
               station={station.id}
               setIsOpen={setIsOpen}
               error={error}
               loading={loading}
               scales={scales.map(({ deviceNum, deviceName, computer }) => ({
                  title: deviceName,
                  description: `${computer.name} | ${computer.hostname}`,
                  id: `${deviceNum}-${deviceName}-${computer.printNodeId}`,
               }))}
            />
         )}
      </>
   )
}

const AddPrinterTunnel = ({
   isOpen,
   setIsOpen,
   station,
   loading,
   error,
   scales,
}) => {
   const [search, setSearch] = React.useState('')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [list, selected, selectOption] = useMultiList(scales)

   const [create] = useMutation(STATIONS.SCALES.CREATE)

   React.useEffect(() => {
      if (isOpen) {
         openTunnel(1)
      } else {
         closeTunnel(1)
      }
   }, [isOpen])

   const insert = async () => {
      await Promise.all(
         selected.map(async scale => {
            await create({
               variables: {
                  deviceNum: Number(scale.id.split('-')[0]),
                  deviceName: scale.id.split('-')[1],
                  computerId: Number(scale.id.split('-')[2]),
                  stationId: station,
               },
            })
         })
      )
      setIsOpen(false)
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1} size="sm">
            <TunnelHeader
               title="Add Scales"
               right={selected.length > 0 && { action: insert, title: 'Save' }}
               close={() => setIsOpen(false)}
            />
            <TunnelMain>
               {loading && <Loader />}
               {error && <div>{error.message}</div>}
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
               )}
               {list.length === 0 && (
                  <StyledInfo>No scales available!</StyledInfo>
               )}
            </TunnelMain>
         </Tunnel>
      </Tunnels>
   )
}
