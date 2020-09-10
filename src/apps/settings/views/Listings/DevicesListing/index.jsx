import React from 'react'
import { useSubscription, useQuery } from '@apollo/react-hooks'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Text,
   Tag,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { DEVICES, PRINTNODE_CREDS } from '../../../graphql'

import { Loader } from '../../../components'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

const DevicesListing = () => {
   const { tab, addTab } = useTabs()
   const [computers, setComputers] = React.useState([])
   const [printers, setPrinters] = React.useState([])
   const [scales, setScales] = React.useState([])
   const { data: { admins = [] } = {} } = useQuery(PRINTNODE_CREDS)
   const { loading, error } = useSubscription(DEVICES, {
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
            <Loader />
         </StyledWrapper>
      )
   if (error) return <StyledWrapper>{error.message}</StyledWrapper>
   return (
      <StyledWrapper>
         <div>
            <section>
               <StyledHeader>
                  <Text as="h2">Printnode Details</Text>
               </StyledHeader>
               <section>
                  <Text as="subtitle">
                     Email: {admins.length > 0 && admins[0].email}
                  </Text>
                  <Text as="subtitle">
                     Password:{' '}
                     {admins.length > 0 && admins[0].password.slice(0, 8)}
                  </Text>
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
      </StyledWrapper>
   )
}

export default DevicesListing
