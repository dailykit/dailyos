import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'

// Components
import { Text, Tag } from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { DEVICES } from '../../../graphql'

import { Loader } from '../../../components'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

const DevicesListing = () => {
   const { tabs } = useTabs()
   const history = useHistory()
   const { loading, error, data: { computers = [] } = {} } = useSubscription(
      DEVICES
   )

   const computerTableColumns = [
      {
         title: 'Name',
         field: 'name',
         headerFilter: true,
      },
      {
         title: 'Host Name',
         field: 'hostname',
         headerFilter: true,
      },
      {
         title: 'Total Printers',
         field: 'totalPrinters.aggregate.count',
         headerFilter: true,
      },
      {
         title: 'Active Printers',
         field: 'activePrinters.aggregate.count',
         headerFilter: true,
      },
      {
         title: 'State',
         field: 'state',
         headerFilter: true,
         formatter: reactFormatter(<StatusTag />),
      },
   ]

   const tableOptions = {
      cellVertAlign: 'middle',
      layout: 'fitColumns',
      autoResize: true,
      maxHeight: 420,
      resizableColumns: false,
      virtualDomBuffer: 80,
      placeholder: 'No Data Available',
      persistence: true,
      persistenceMode: 'cookie',
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/devices`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   if (loading)
      return (
         <StyledWrapper>
            <Loader />
         </StyledWrapper>
      )
   if (error) return <StyledWrapper>{error.message}</StyledWrapper>
   return (
      <StyledWrapper>
         <section>
            <StyledHeader>
               <Text as="h2">Computers</Text>
            </StyledHeader>

            <ReactTabulator
               columns={computerTableColumns}
               data={computers}
               options={tableOptions}
            />
         </section>
         {/* <section>
            <StyledHeader>
               <Text as="h2">Printers</Text>
            </StyledHeader>

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
         </section> */}
         {/* <section>
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
         </section> */}
      </StyledWrapper>
   )
}

function StatusTag({
   cell: {
      _cell: { value },
   },
}) {
   if (value) return <Tag>{value}</Tag>
   return null
}

export default DevicesListing
