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
   Avatar,
   AvatarGroup,
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

const address = 'apps.settings.views.listings.userslisting.'

const UsersListing = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs, addTab } = useTabs()

   const createTab = () => {
      const hash = `untitled${uuid().split('-')[0]}`
      addTab(hash, `/settings/users/${hash}`)
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/users`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   const data = [
      {
         id: 1,
         user: {
            title: 'Marky Mark',
            url: '',
         },
         devices: 4,
         apps: [
            { title: 'Inventory App', url: '' },
            { title: 'Recipe App', url: '' },
            { title: 'Ingredient App', url: '' },
         ],
      },
      {
         id: 2,
         user: {
            title: 'Alex Tod',
            url: '',
         },
         apps: [
            { title: 'Recipe App', url: '' },
            { title: 'Ingredient App', url: '' },
         ],
      },
   ]
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">{t(address.concat('users'))}</Text>
            <IconButton type="solid" onClick={() => createTab()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('users'))}</TableCell>
                  <TableCell>{t(address.concat('apps configured'))}</TableCell>
                  <TableCell>{t(address.concat('devices assigned'))}</TableCell>
                  <TableCell align="right">{t(address.concat('actions'))}</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map(row => (
                  <TableRow key={row.id}>
                     <TableCell>
                        <Avatar
                           withName
                           url={row.user.url}
                           title={row.user.title}
                        />
                     </TableCell>
                     <TableCell>
                        <AvatarGroup>
                           {row.apps.map(app => (
                              <Avatar
                                 url={app.url}
                                 key={app.title}
                                 title={app.title}
                              />
                           ))}
                        </AvatarGroup>
                     </TableCell>
                     <TableCell>
                        {row.devices ? (
                           <StyledBadge>{row.devices}</StyledBadge>
                        ) : (
                              'NA'
                           )}
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

export default UsersListing
