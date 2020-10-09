import React from 'react'
import { v4 as uuid } from 'uuid'
import { useMutation, useSubscription } from '@apollo/react-hooks'
import { reactFormatter, ReactTabulator } from '@dailykit/react-tabulator'

import { useTabs } from '../../../context'
import tableOptions from '../tableOption'
import { CREATE_USER, USERS } from '../../../graphql'
import { StyledWrapper, StyledHeader } from '../styled'
import { AddIcon } from '../../../../../shared/assets/icons'
import { Loader, IconButton, Avatar, Text } from '@dailykit/ui'

const UsersListing = () => {
   const { tab, addTab } = useTabs()
   const {
      loading,
      error,
      data: { settings_user: users = [] } = {},
   } = useSubscription(USERS)
   const [createUser] = useMutation(CREATE_USER, {
      onCompleted: ({ insert_settings_user_one = {} }) => {
         const { id, firstName } = insert_settings_user_one
         addTab(firstName, `/settings/users/${id}`)
      },
   })
   const tableRef = React.useRef()

   const rowClick = (e, row) => {
      const { id, firstName, lastName } = row._row.data
      addTab(`${firstName} ${lastName}`, `/settings/users/${id}`)
   }

   const addUser = () => {
      const hash = `user${uuid().split('-')[0]}`
      createUser({
         variables: {
            object: {
               firstName: hash,
               tempPassword: hash.slice(4),
            },
         },
      })
   }

   const columns = [
      {
         title: 'User',
         headerFilter: false,
         headerSort: false,
         hozAlign: 'left',
         headerHozAlign: 'left',
         formatter: reactFormatter(<UserAvatar />),
      },
      {
         title: 'Email',
         field: 'email',
         headerFilter: true,
         hozAlign: 'left',
         headerHozAlign: 'left',
      },
      {
         title: 'Phone No.',
         field: 'phoneNo',
         headerFilter: true,
         hozAlign: 'right',
         headerHozAlign: 'right',
         width: 150,
      },
   ]

   React.useEffect(() => {
      if (!tab) {
         addTab('Users', '/settings/users')
      }
   }, [tab, addTab])

   return (
      <StyledWrapper>
         <StyledHeader>
            <Text as="h2">Users</Text>
            <IconButton type="solid" onClick={addUser}>
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
