import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSubscription } from '@apollo/react-hooks'

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
   Flex,
} from '@dailykit/ui'

import { useTabs } from '../../../context'
import { APPS } from '../../../graphql'
import { InlineLoader } from '../../../../../shared/components'

const address = 'apps.settings.views.listings.appslisting.'

const AppsListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const { loading, data: { apps = [] } = {} } = useSubscription(APPS.LIST)

   React.useEffect(() => {
      if (!tab) {
         addTab('Apps', '/settings/apps')
      }
   }, [tab, addTab])

   return (
      <Flex>
         <div>
            <Flex
               container
               as="header"
               height="80px"
               alignItems="center"
               justifyContent="space-between"
            >
               <Text as="h2">{t(address.concat('apps'))}</Text>
            </Flex>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('apps'))}</TableCell>
                     <TableCell>
                        {t(address.concat('roles assigned'))}
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {apps.map(apps => (
                     <TableRow key={apps.title}>
                        <TableCell>
                           <AvatarGroup>
                              <Avatar
                                 withName
                                 type="round"
                                 url=""
                                 title={apps.title}
                              />
                           </AvatarGroup>
                        </TableCell>
                        <TableCell>
                           <AvatarGroup>
                              {apps.roles.map(({ role }) => (
                                 <Avatar
                                    url=""
                                    key={role.id}
                                    title={role.title}
                                 />
                              ))}
                           </AvatarGroup>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </Flex>
   )
}

export default AppsListing
