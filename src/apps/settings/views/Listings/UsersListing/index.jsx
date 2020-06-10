import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'

// Components
import {
   Loader,
   IconButton,
   Table,
   TableHead,
   TableBody,
   TableRow,
   TableCell,
   Avatar,
   Text,
} from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { USERS } from '../../../graphql'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../../../shared/assets/icons'

const UsersListing = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const {
      loading,
      error,
      data: { settings_user: users = [] } = {},
   } = useSubscription(USERS)

   const createTab = () => {
      const hash = `user${uuid().split('-')[0]}`
      addTab(hash, `/settings/users/${hash}`)
   }

   React.useEffect(() => {
      const tab = tabs.find(item => item.path === `/settings/users`) || {}
      if (!Object.prototype.hasOwnProperty.call(tab, 'path')) {
         history.push('/settings')
      }
   }, [history, tabs])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Users</Text>
            <IconButton type="solid" onClick={() => createTab()}>
               <AddIcon color="#fff" size={24} />
            </IconButton>
         </StyledHeader>
         {loading && <Loader />}
         {error && <div>{error.message}</div>}
         {users.length === 0 && <div>No users yet!</div>}
         {users.length > 0 && (
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>User</TableCell>
                     <TableCell>Email</TableCell>
                     <TableCell>Phone No.</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {users.map(user => (
                     <TableRow
                        key={user.id}
                        onClick={() =>
                           addTab(
                              `${user.firstName} ${user.lastName}`,
                              `/settings/users/${user.id}`
                           )
                        }
                     >
                        <TableCell>
                           <Avatar
                              withName
                              title={`${user.firstName} ${user.lastName}`}
                           />
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNo}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         )}
      </StyledWrapper>
   )
}

export default UsersListing
