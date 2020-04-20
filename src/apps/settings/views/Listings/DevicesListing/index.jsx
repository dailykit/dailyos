import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'

// Components
import {
   ButtonGroup,
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   AvatarGroup,
   Avatar,
   TagGroup,
   Tag,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import {
   EditIcon,
   DeleteIcon,
   AddIcon,
} from '../../../../../shared/assets/icons'

const DevicesListing = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   const createTab = () => {
      const hash = `untitled${uuid().split('-')[0]}`
      addTab(hash, `/settings/devices/${hash}`)
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/devices`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   const data = [
      {
         name: 'Weighing Scale Terminal',
         stations: ['Station 1', 'Station 2'],
         users: [
            { url: '', title: 'Jack' },
            { url: '', title: 'Back Bones' },
            { url: '', title: 'Stack Cue Stones' },
         ],
      },
      {
         name: 'Terminal',
         stations: ['Station 2'],
         users: [
            { url: '', title: 'Stack Cue Stones' },
            { url: '', title: 'Back Bones' },
         ],
      },
   ]
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Devices</Text>
            <IconButton type="solid" onClick={() => createTab()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>Devices</TableCell>
                  <TableCell>Stations</TableCell>
                  <TableCell>Users Assigned</TableCell>
                  <TableCell align="right">Actions</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map(row => (
                  <TableRow key={row.name}>
                     <TableCell>{row.name}</TableCell>
                     <TableCell>
                        <TagGroup>
                           {row.stations.map(station => (
                              <Tag key={station}>{station}</Tag>
                           ))}
                        </TagGroup>
                     </TableCell>
                     <TableCell>
                        <AvatarGroup>
                           {row.users.map(user => (
                              <Avatar
                                 url={user.url}
                                 key={user.title}
                                 title={user.title}
                              />
                           ))}
                        </AvatarGroup>
                     </TableCell>
                     <TableCell align="right">
                        <ButtonGroup align="right">
                           <IconButton type="outline">
                              <EditIcon />
                           </IconButton>
                           <IconButton type="outline">
                              <DeleteIcon />
                           </IconButton>
                        </ButtonGroup>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default DevicesListing
