import React from 'react'
import { v4 as uuid } from 'uuid'
import { useHistory } from 'react-router-dom'
import { useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from 'react-tabulator'

// Components
import { Loader, IconButton, Avatar, Text } from '@dailykit/ui'

// State
import { useTabs } from '../../../context'

import { USERS } from '../../../graphql'

// Styled
import { StyledWrapper, StyledHeader } from '../styled'

// Icons
import { AddIcon } from '../../../../../shared/assets/icons'
import tableOptions from '../tableOption'

const UsersListing = () => {
   const history = useHistory()
   const { tabs, addTab } = useTabs()
   const {
      loading,
      error,
      data: { settings_user: users = [] } = {},
   } = useSubscription(USERS)
   const tableRef = React.useRef()

   const createTab = () => {
      const hash = `user${uuid().split('-')[0]}`
      addTab(hash, `/settings/users/${hash}`)
   }

   const rowClick = (e, row) => {
      const { id, name } = row._row.data
      addTab(name, 'suppliers', id)
   }

   const columns = [
      {
         title: 'User',
         headerFilter: false,
         headerSort: false,
         formatter: reactFormatter(<UserAvatar />),
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
      },
      {
         title: 'Phone No.',
         field: 'phoneNo',
         headerFilter: true,
      },
   ]

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
         {users.length && (
            <ReactTabulator
               ref={tableRef}
               columns={columns}
               data={users}
               rowClick={rowClick}
               options={tableOptions}
            />
         )}
      </StyledWrapper>
   )
}

function UserAvatar({
   cell: {
      _cell: {
         row: { data },
      },
   },
}) {
   if (data && data.firstName && data.lastName)
      return <Avatar withName title={`${data.firstName} ${data.lastName}`} />

   return null
}

export default UsersListing
