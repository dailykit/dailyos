import React from 'react'
import { isEmpty } from 'lodash'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { useSubscription, useQuery, useMutation } from '@apollo/react-hooks'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Text,
   Tag,
   ComboButton,
   Tunnels,
   Tunnel,
   useTunnel,
   TunnelHeader,
   Spacer,
   Input,
   List,
   useSingleList,
   ListItem,
   ListOptions,
   ListSearch,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { StyledWrapper, StyledHeader } from '../styled'
import { PrinterIcon } from '../../../../../shared/assets/icons'
import { Flex, InlineLoader } from '../../../../../shared/components'
import { DEVICES, PRINT_JOB } from '../../../graphql'

const DevicesListing = () => {
   const { tab, addTab } = useTabs()
   const [computers, setComputers] = React.useState([])
   const [printers, setPrinters] = React.useState([])
   const [scales, setScales] = React.useState([])
   const [tunnels, openTunnel, closeTunnel] = useTunnel(1)
   const { data: { admins = [] } = {} } = useQuery(DEVICES.PRINTNODE_DETAILS)
   const { loading, error } = useSubscription(DEVICES.LIST, {
      onSubscriptionData: ({ subscriptionData: { data = {} } }) => {
         setComputers(data.computers)
         setPrinters(
            [...data.computers.map(computer => computer.printers)].flat()
         )
         setScales([...data.computers.map(computer => computer.scales)].flat())
      },
   })

   React.useEffect(() => {
      if (!tab) {
         addTab('Devices', '/settings/devices')
      }
   }, [tab, addTab])

   if (loading)
      return (
         <StyledWrapper>
            <InlineLoader />
         </StyledWrapper>
      )
   if (error) return <StyledWrapper>{error.message}</StyledWrapper>
   return (
      <StyledWrapper>
         <div>
            <section>
               <StyledHeader>
                  <Text as="h2">Printnode Details</Text>
                  <ComboButton type="solid" onClick={() => openTunnel(1)}>
                     <PrinterIcon />
                     Print PDF
                  </ComboButton>
               </StyledHeader>
               <section>
                  <Text as="p">
                     Email: {admins.length > 0 && admins[0].email}
                  </Text>
                  <Text as="p">
                     Password:{' '}
                     {admins.length > 0 && admins[0].password.slice(0, 8)}
                  </Text>
                  <Spacer size="16px" />
                  <Text as="h2">Support Links</Text>
                  <Spacer size="12px" />
                  <StyledLinks>
                     <li>
                        <a href="https://www.printnode.com/en/download">
                           Download Printnode
                        </a>
                     </li>
                     <li>
                        <a href="https://www.printnode.com/en/docs/installation">
                           Installation
                        </a>
                     </li>
                     <li>
                        <a href="https://www.printnode.com/en/docs/supported-printers">
                           Supported Printers
                        </a>
                     </li>
                     <li>
                        <a href="https://www.printnode.com/en/docs/supported-scales">
                           Supported Scales
                        </a>
                     </li>
                  </StyledLinks>
               </section>
               <StyledHeader>
                  <Text as="h2">Computers</Text>
               </StyledHeader>
               {computers.length > 0 ? (
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Host Name</TableCell>
                           <TableCell>Total Printers</TableCell>
                           <TableCell>Active Printers</TableCell>
                           <TableCell>State</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {computers.map(computer => (
                           <TableRow key={computer.printNodeId}>
                              <TableCell>{computer.name}</TableCell>
                              <TableCell>{computer.hostname}</TableCell>
                              <TableCell>
                                 {computer.totalPrinters.aggregate.count}
                              </TableCell>
                              <TableCell>
                                 {computer.activePrinters.aggregate.count}
                              </TableCell>
                              <TableCell>
                                 <Tag>{computer.state}</Tag>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               ) : (
                  <h4>No computers yet!</h4>
               )}
            </section>
            <section>
               <StyledHeader>
                  <Text as="h2">Printers</Text>
               </StyledHeader>
               {printers.length > 0 ? (
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Computer</TableCell>
                           <TableCell>State</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {printers.map(printer => (
                           <TableRow key={printer.printNodeId}>
                              <TableCell>{printer.name}</TableCell>
                              <TableCell>{printer.computer.name}</TableCell>
                              <TableCell>
                                 <Tag>{printer.state}</Tag>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               ) : (
                  <h4>No printers yet!</h4>
               )}
            </section>
            <section>
               <StyledHeader>
                  <Text as="h2">Scales</Text>
               </StyledHeader>
               {scales.length > 0 ? (
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Computer</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {scales.map(scale => (
                           <TableRow key={scale.deviceNum}>
                              <TableCell>{scale.name}</TableCell>
                              <TableCell>{scale.computer.name}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               ) : (
                  <h4>No scales yet!</h4>
               )}
            </section>
         </div>
         <Tunnels tunnels={tunnels}>
            <Tunnel layer={1} size="sm">
               <PrintTunnel closeTunnel={closeTunnel} />
            </Tunnel>
         </Tunnels>
      </StyledWrapper>
   )
}

export default DevicesListing

const StyledLinks = styled.ul`
   display: flex;
   align-items: center;
   flex-wrap: wrap;
   li {
      list-style: none;
      margin-bottom: 16px;
      margin-right: 16px;
   }
`

const PrintTunnel = ({ closeTunnel }) => {
   const [url, setUrl] = React.useState('')
   const [search, setSearch] = React.useState('')
   const [printers, setPrinters] = React.useState([])
   const [createPrint] = useMutation(PRINT_JOB, {
      onCompleted: () => {
         closeTunnel(1)
         toast.success('Successfully Printed!')
      },
      onError: error => {
         toast.error('Failed to print!')
         console.log(error)
      },
   })
   const { loading } = useQuery(DEVICES.PRINTERS.ONLINE, {
      onCompleted: ({ printers = [] }) => {
         setPrinters(
            printers.map(node => ({ id: node.printNodeId, title: node.name }))
         )
      },
   })
   const [list, current, selectOption] = useSingleList(printers)

   const print = () => {
      if (!url) return toast.error('Please enter the PDF URL!')
      if (isEmpty(current)) return toast.error('Please select a printer!')
      createPrint({
         variables: {
            url,
            source: 'DailyOS',
            title: 'Custom Print',
            contentType: 'pdf_uri',
            printerId: current?.id,
         },
      })
   }

   return (
      <>
         <TunnelHeader
            title="Print PDF"
            right={{ action: print, title: 'Print' }}
            close={() => closeTunnel(1)}
         />
         <Flex padding="16px" overflowY="auto" height="calc(100vh - 105px)">
            <Input
               type="text"
               name="url"
               value={url}
               label="PDF Url"
               onChange={e => setUrl(e.target.value)}
            />
            <Spacer size="24px" />
            <Text as="h3">Select Printer</Text>
            <Spacer size="12px" />
            {loading ? (
               <InlineLoader />
            ) : (
               <List>
                  {Object.keys(current).length > 0 ? (
                     <ListItem type="SSL1" title={current.title} />
                  ) : (
                     <ListSearch
                        onChange={value => setSearch(value)}
                        placeholder="search by printer name..."
                     />
                  )}
                  <ListOptions>
                     {list
                        .filter(option =>
                           option.title.toLowerCase().includes(search)
                        )
                        .map(option => (
                           <ListItem
                              type="SSL1"
                              key={option.id}
                              title={option.title}
                              isActive={option.id === current.id}
                              onClick={() => selectOption('id', option.id)}
                           />
                        ))}
                  </ListOptions>
               </List>
            )}
         </Flex>
      </>
   )
}
