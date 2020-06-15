import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/react-hooks'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   IconButton,
   ButtonGroup,
   Text,
   Loader,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { STATIONS, DELETE_STATION } from '../../../graphql'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon, DeleteIcon } from '../../../../../shared/assets/icons'

const StationsListing = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const { error, loading, data: { stations } = {} } = useSubscription(STATIONS)
   const [remove] = useMutation(DELETE_STATION)

   const createTab = () => {
      const hash = `stations${uuid().split('-')[0]}`
      addTab(hash, `/settings/stations/${hash}`)
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/stations`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Stations</Text>
            <IconButton type="solid" onClick={() => createTab()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         {loading && <Loader />}
         {error && <div>{error.message}</div>}
         {stations?.length === 0 && <div>No stations yet!</div>}
         {stations?.length > 0 && (
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Station Name</TableCell>
                     <TableCell align="right">Actions</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {stations.map(station => (
                     <TableRow
                        key={station.id}
                        onClick={() =>
                           addTab(
                              station.name,
                              `/settings/stations/${station.id}`
                           )
                        }
                     >
                        <TableCell>{station.name}</TableCell>
                        <TableCell align="right">
                           <ButtonGroup align="right">
                              <IconButton
                                 type="outline"
                                 onClick={e =>
                                    e.stopPropagation() ||
                                    remove({ variables: { id: station.id } })
                                 }
                              >
                                 <DeleteIcon />
                              </IconButton>
                           </ButtonGroup>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         )}
      </StyledWrapper>
   )
}

export default StationsListing
