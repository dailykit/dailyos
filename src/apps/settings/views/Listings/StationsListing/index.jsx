import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   ButtonGroup,
   IconButton,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import { StyledWrapper, StyledHeader, StyledBadge } from '../styled'

// Icons
import {
   EditIcon,
   DeleteIcon,
   AddIcon,
} from '../../../../../shared/assets/icons'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.listings.stationslisting.'

const StationsListing = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   const createTab = () => {
      const hash = `untitled${uuid().split('-')[0]}`
      addTab(hash, `/settings/stations/${hash}`)
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/stations`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])
   const data = [
      {
         id: 1,
         title: 'Meat',
         type: 'Packaging',
         devices: 3,
         sachets: 24,
      },
      {
         id: 2,
         title: 'Spices',
         type: 'Packaging',
         devices: 2,
         sachets: 45,
      },
   ]
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">{t(address.concat('stations'))}</Text>
            <IconButton type="solid" onClick={() => createTab()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('station name'))}</TableCell>
                  <TableCell>{t(address.concat('station type'))}</TableCell>
                  <TableCell>{t(address.concat('devices'))}</TableCell>
                  <TableCell>{t(address.concat('sachets'))}</TableCell>
                  <TableCell align="right">{t(address.concat('actions'))}</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map(row => (
                  <TableRow key={row.title}>
                     <TableCell>{row.title}</TableCell>
                     <TableCell>{row.type}</TableCell>
                     <TableCell>
                        <StyledBadge>{row.devices}</StyledBadge>
                     </TableCell>
                     <TableCell>
                        <StyledBadge>{row.sachets}</StyledBadge>
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

export default StationsListing
