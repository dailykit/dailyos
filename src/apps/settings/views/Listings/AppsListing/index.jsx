import React from 'react'
import { useHistory } from 'react-router-dom'

// Components
import {
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   AvatarGroup,
   Avatar,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

import { useTranslation } from 'react-i18next'

const address = 'apps.settings.views.listings.appslisting.'

const AppsListing = () => {
   const { t } = useTranslation()
   const history = useHistory()
   const { tabs } = useTabs()
   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/apps`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])
   const data = [
      {
         title: 'Ingredient',
         url: '',
         users: [
            { url: '', title: 'Jack' },
            { url: '', title: 'Back Bones' },
            { url: '', title: 'Stack Cue Stones' },
         ],
      },
      {
         title: 'Recipe',
         url: '',
         users: [
            { url: '', title: 'Back Bones' },
            { url: '', title: 'Stack Cue Stones' },
            { url: '', title: 'Jack' },
         ],
      },
      {
         title: 'Inventory',
         url: '',
         users: [
            { url: '', title: 'Back Bones' },
            { url: '', title: 'Jack' },
         ],
      },
   ]
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">{t(address.concat('apps'))}</Text>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('apps'))}</TableCell>
                  <TableCell>{t(address.concat('users assigned'))}</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {data.map(row => (
                  <TableRow key={row.title}>
                     <TableCell>
                        <AvatarGroup>
                           <Avatar
                              withName
                              type="round"
                              url={row.url}
                              title={row.title}
                           />
                        </AvatarGroup>
                     </TableCell>
                     <TableCell>
                        <AvatarGroup>
                           {row.users.map(user => (
                              <Avatar
                                 key={user.title}
                                 title={user.title}
                                 url={user.url}
                              />
                           ))}
                        </AvatarGroup>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </StyledWrapper>
   )
}

export default AppsListing
