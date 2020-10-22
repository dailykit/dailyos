import React from 'react'
import { toast } from 'react-toastify'
import { useSubscription, useMutation } from '@apollo/react-hooks'

import {
   Text,
   PlusIcon,
   IconButton,
   TextButton,
   Tag,
   Tunnels,
   Tunnel,
   useTunnel,
   Flex,
   ListItem,
   List,
   ListOptions,
   ListSearch,
   TagGroup,
   useMultiList,
   ButtonGroup,
   TunnelHeader,
   SectionTabs,
   SectionTabList,
   SectionTab,
   SectionTabPanels,
   SectionTabPanel,
   SectionTabsListHeader,
   Spacer,
   Filler,
} from '@dailykit/ui'

import { STATIONS } from '../../../../../graphql'
import { logger } from '../../../../../../../shared/utils'
import {
   Tooltip,
   InlineLoader,
   ErrorBoundary,
} from '../../../../../../../shared/components'

export const KotPrinters = ({ station }) => {
   const [tabIndex, setTabIndex] = React.useState(0)
   const [isOpen, setIsOpen] = React.useState(false)
   const [update] = useMutation(STATIONS.KOT_PRINTERS.UPDATE, {
      onCompleted: () => toast.success('Successfully updated kot printer!'),
      onError: error => {
         logger(error)
         toast.error('Failed to update the kot printer!')
      },
   })
   const [remove] = useMutation(STATIONS.KOT_PRINTERS.DELETE, {
      onCompleted: () => toast.success('Successfully unassigned kot printer!'),
      onError: error => {
         logger(error)
         toast.error('Failed to unassign the kot printer!')
      },
   })
   const [updateDefault] = useMutation(STATIONS.UPDATE, {
      onCompleted: () => toast.success('Selected printer is now default!'),
      onError: error => {
         logger(error)
         toast.error('Failed to set printer as default!')
      },
   })

   const { loading, error, data: { kotPrinters = [] } = {} } = useSubscription(
      STATIONS.KOT_PRINTERS.LIST,
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
         <SectionTabs onChange={index => setTabIndex(index)}>
            <SectionTabList>
               <SectionTabsListHeader>
                  <Flex container alignItems="center">
                     <Text as="title">KOT Printers</Text>
                     <Tooltip identifier="station_section_kot_printers_heading" />
                  </Flex>
                  <IconButton type="outline" onClick={() => setIsOpen(true)}>
                     <PlusIcon />
                  </IconButton>
               </SectionTabsListHeader>
               {station.kotPrinter.nodes.map((node, index) => (
                  <SectionTab key={node.kotPrinter.printNodeId}>
                     <Spacer size="14px" />
                     <Text
                        as="h3"
                        style={{ ...(index === tabIndex && { color: '#fff' }) }}
                     >
                        {node.kotPrinter.name}
                     </Text>
                     <Spacer size="14px" />
                  </SectionTab>
               ))}
            </SectionTabList>
            <SectionTabPanels>
               {station.kotPrinter.nodes.map(node => (
                  <SectionTabPanel key={node.kotPrinter.printNodeId}>
                     <Flex
                        as="main"
                        container
                        alignItems="center"
                        justifyContent="space-between"
                     >
                        <Flex as="section" container alignItems="center">
                           <Text as="h2">{node.kotPrinter.name}</Text>
                           <Spacer size="16px" xAxis />
                           {node.active && <Tag>Active</Tag>}
                        </Flex>
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
                                          pk_columns: { id: station.id },
                                          _set: {
                                             defaultKotPrinterId:
                                                node.kotPrinter.printNodeId,
                                          },
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
                     </Flex>
                  </SectionTabPanel>
               ))}
            </SectionTabPanels>
         </SectionTabs>
         {isOpen && (
            <ErrorBoundary rootRoute="/apps/settings">
               <AddPrinterTunnel
                  isOpen={isOpen}
                  station={station.id}
                  setIsOpen={setIsOpen}
                  error={error}
                  loading={loading}
                  printers={kotPrinters.map(
                     ({ printNodeId, name, computer }) => ({
                        id: printNodeId,
                        title: name,
                        description: `${computer.name} | ${computer.hostname}`,
                     })
                  )}
               />
            </ErrorBoundary>
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

   const [create] = useMutation(STATIONS.KOT_PRINTERS.CREATE, {
      onCompleted: () => {
         setIsOpen(false)
         toast.success('Successfully assigned the kot printer!')
      },
   })

   React.useEffect(() => {
      if (isOpen) {
         openTunnel(1)
      } else {
         closeTunnel(1)
      }
   }, [isOpen])

   if (!loading && error) {
      toast.error('Failed to fetch kot printers!')
      logger(error)
   }

   const insert = () => {
      create({
         variables: {
            objects: selected.map(printer => ({
               active: true,
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
               close={() => setIsOpen(false)}
               right={selected.length > 0 && { action: insert, title: 'Save' }}
               tooltip={
                  <Tooltip identifier="station_section_kot_printer_tunnel_add" />
               }
            />
            <Flex padding="0 16px" overflowY="auto" height="calc(100% - 104px)">
               {loading ? (
                  <InlineLoader />
               ) : (
                  <>
                     {list.length > 0 ? (
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
                                       onClick={() =>
                                          selectOption('id', option.id)
                                       }
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
                                       onClick={() =>
                                          selectOption('id', option.id)
                                       }
                                       isActive={selected.find(
                                          item => item.id === option.id
                                       )}
                                    />
                                 ))}
                           </ListOptions>
                        </List>
                     ) : (
                        <Filler
                           height="500px"
                           message="No printers available to add to station."
                        />
                     )}
                  </>
               )}
            </Flex>
         </Tunnel>
      </Tunnels>
   )
}
