import React from 'react'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { useSubscription, useMutation } from '@apollo/react-hooks'
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
   Text,
} from '@dailykit/ui'

import { ROLES } from '../../../graphql'
import { useTabs } from '../../../context'
import { StyledWrapper, StyledHeader } from '../styled'
import { InlineLoader } from '../../../../../shared/components'
import { EditIcon } from '../../../../../shared/assets/icons'

const address = 'apps.settings.views.listings.roleslisting.'

const RolesListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const { loading, data: { roles = [] } = {} } = useSubscription(ROLES.LIST)

   React.useEffect(() => {
      if (!tab) {
         addTab('Roles', '/settings/roles')
      }
   }, [tab, addTab])

   const editRole = (id, role) => {
      addTab(role, `/settings/roles/${id}`)
   }

   if (loading) return <InlineLoader />
   return (
      <StyledWrapper>
         <div>
            <StyledHeader>
               <Text as="h2">{t(address.concat('roles'))}</Text>
            </StyledHeader>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>{t(address.concat('roles'))}</TableCell>
                     <TableCell>Users</TableCell>
                     <TableCell align="right">
                        {t(address.concat('actions'))}
                     </TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {_.isEmpty(roles) ? (
                     <span>No roles</span>
                  ) : (
                     roles.map(row => (
                        <TableRow key={row.id}>
                           <TableCell>{row.title}</TableCell>
                           <TableCell>
                              <AvatarGroup>
                                 {row.apps.map(({ app }) => (
                                    <Avatar
                                       url=""
                                       key={app.id}
                                       title={app.title}
                                    />
                                 ))}
                              </AvatarGroup>
                           </TableCell>
                           <TableCell align="right">
                              <ButtonGroup align="right">
                                 <IconButton
                                    type="outline"
                                    onClick={() => editRole(row.id, row.title)}
                                 >
                                    <EditIcon />
                                 </IconButton>
                              </ButtonGroup>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>
            </Table>
         </div>
      </StyledWrapper>
   )
}

export default RolesListing
