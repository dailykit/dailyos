import React from 'react'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   TextButton,
   Tag,
   Tunnels,
   Tunnel,
   useTunnel,
   IconButton,
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

import { CloseIcon } from '../../../../../../../shared/assets/icons'
import { KOT_PRINTERS } from '../../../../../graphql/subscriptions'
import {
   CREATE_STATION_KOT_PRINTER,
   UPDATE_STATION_KOT_PRINTER,
   DELETE_STATION_KOT_PRINTER,
   UPDATE_STATION_DEFAULT_KOT_PRINTER,
} from '../../../../../graphql/mutations'

export const KotPrinters = ({ station }) => {
   const [isOpen, setIsOpen] = React.useState(false)
   const [update] = useMutation(UPDATE_STATION_KOT_PRINTER)
   const [remove] = useMutation(DELETE_STATION_KOT_PRINTER)
   const [updateDefault] = useMutation(UPDATE_STATION_DEFAULT_KOT_PRINTER)

   const { loading, error, data: { kotPrinters = [] } = {} } = useSubscription(
      KOT_PRINTERS,
      {
         variables: {
            type: 'KOT_PRINTER',
            stationId: station.id,
         },
      }
   )

   const updateKotPrinterStatus = (id, status) => {
      update({
         variables: {
            printNodeId: id,
            stationId: station.id,
            active: status,
         },
      })
   }

   const deleteStationKotPrinter = id => {
      remove({
         variables: {
            stationId: station.id,
            printNodeId: id,
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
                  Add Printer
               </TextButton>
               {station.kotPrinter.nodes.map(node => (
                  <SectionTab
                     key={node.kotPrinter.printNodeId}
                     title={node.kotPrinter.name}
                  />
               ))}
            </SectionTabList>
            <SectionTabPanels>
               {station.kotPrinter.nodes.map(node => (
                  <SectionTabPanel key={node.kotPrinter.printNodeId}>
                     <Header>
                        <div>
                           <h2>{node.kotPrinter.name}</h2>
                           {node.active && <Tag>Active</Tag>}
                        </div>
                        <ButtonGroup align="right">
                           <TextButton
                              type="solid"
                              onClick={() =>
                                 updateKotPrinterStatus(
                                    node.kotPrinter.printNodeId,
                                    !node.active
                                 )
                              }
                           >
                              Mark {node.active ? 'Inactive' : 'Active'}
                           </TextButton>
                           {station.defaultKotPrinterId !==
                              node.kotPrinter.printNodeId && (
                              <TextButton
                                 type="outline"
                                 onClick={() =>
                                    updateDefault({
                                       variables: {
                                          id: station.id,
                                          defaultKotPrinterId:
                                             node.kotPrinter.printNodeId,
                                       },
                                    })
                                 }
                              >
                                 Make Default
                              </TextButton>
                           )}
                           <TextButton
                              type="outline"
                              onClick={() =>
                                 deleteStationKotPrinter(
                                    node.kotPrinter.printNodeId
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
               printers={kotPrinters.map(({ printNodeId, name, computer }) => ({
                  id: printNodeId,
                  title: name,
                  description: `${computer.name} | ${computer.hostname}`,
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
   printers,
}) => {
   const [search, setSearch] = React.useState('')
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const [list, selected, selectOption] = useMultiList(printers)

   const [create] = useMutation(CREATE_STATION_KOT_PRINTER, {
      onCompleted: () => setIsOpen(false),
   })

   React.useEffect(() => {
      if (isOpen) {
         openTunnel(1)
      } else {
         closeTunnel(1)
      }
   }, [isOpen])

   const insert = () => {
      create({
         variables: {
            objects: selected.map(printer => ({
               stationId: station,
               printNodeId: printer.id,
            })),
         },
      })
   }

   return (
      <Tunnels tunnels={tunnels}>
         <Tunnel layer={1} size="sm">
            <TunnelHeader
               title="Add Printer"
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
                  <StyledInfo>No printers available!</StyledInfo>
               )}
            </TunnelMain>
         </Tunnel>
      </Tunnels>
   )
}
