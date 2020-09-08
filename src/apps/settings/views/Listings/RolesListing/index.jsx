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
import {
   EditIcon,
   DeleteIcon,
   AddIcon,
} from '../../../../../shared/assets/icons'

const address = 'apps.settings.views.listings.roleslisting.'

const RolesListing = () => {
   const { t } = useTranslation()
   const { tab, addTab } = useTabs()
   const [insert] = useMutation(ROLES.CREATE, {
      onCompleted: ({ insertRole = {} }) => {
         const { id, title } = insertRole
         addTab(title, `/settings/roles/${id}`)
      },
      onError: () => {
         toast.error('Failed to create the role!')
      },
   })
   const { loading, data: { roles = [] } = {} } = useSubscription(ROLES.LIST)

   React.useEffect(() => {
      if (!tab) {
         addTab('Roles', '/settings/roles')
      }
   }, [tab, addTab])

   const addRole = () => {
      const hash = `role${uuid().split('-')[0]}`
      insert({
         variables: {
            role: hash,
         },
      })
   }

   const editRole = (id, role) => {
      addTab(role, `/settings/roles/${id}`)
   }

   if (loading) return <InlineLoader />
   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">{t(address.concat('roles'))}</Text>
            <IconButton type="solid" onClick={() => addRole()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         <Table>
            <TableHead>
               <TableRow>
                  <TableCell>{t(address.concat('roles'))}</TableCell>
                  <TableCell>{t(address.concat('apps configured'))}</TableCell>
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
                              {row.user_roles.map(node => (
                                 <Avatar
                                    url=""
                                    key={node.app.id}
                                    title={node.app.title}
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
      </StyledWrapper>
   )
}

export default RolesListing
