import {
   IconButton,
   SearchIcon,
   PlusIcon,
   useOnClickOutside,
   Avatar,
} from '@dailykit/ui'
import React from 'react'
import {
   EditIcon,
   LogoutIcon,
   MailIcon,
   NotificationIcon,
   PhoneIcon,
   SettingsIcon,
   StoreIcon,
} from '../../../../assets/icons'
import { useAuth } from '../../../../providers'
import { Wrapper, AddItem, Profile } from './styled'
import CreateNewItemPanel from '../CreateNewItemPanel'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { useSubscription } from '@apollo/react-hooks'
const StyledAvatar = styled(Avatar)`
   height: 24px;
   width: 24px;
   font-size: 12px;
   border: ${({ open }) => (open ? '2px solid #367BF5' : '1px solid #E3E3E3')};
`

const Tools = () => {
   const [open, setOpen] = React.useState(null)
   const { user, logout } = useAuth()
   const toolbarRef = React.useRef()

   const USERS = gql`
      subscription users($where: settings_user_bool_exp) {
         users: settings_user(where: $where) {
            id
            email
            firstName
            lastName
            phoneNo
            roles {
               id
               role {
                  id
                  title
               }
            }
         }
      }
   `

   const { data: { users = [] } = {} } = useSubscription(USERS, {
      skip: !user?.email,
      variables: {
         where: {
            email: { _eq: user?.email },
         },
      },
   })

   const fullName = (f, l) => {
      let name = ''
      if (f) {
         name += f
      }
      if (l) {
         name += ` ${l}`
      }
      return name
   }

   const buttonStrings = {
      addItems: 'add-item',
      profile: 'profile',
   }
   const { addItems, profile } = buttonStrings

   const handleOpen = item => {
      setOpen(open === null || open !== item ? item : null)
   }
   useOnClickOutside(toolbarRef, () => setOpen(false))
   return (
      <div ref={toolbarRef}>
         <Wrapper ref={toolbarRef}>
            <IconButton
               size="sm"
               type="ghost"
               onClick={() => handleOpen(addItems)}
            >
               <PlusIcon color={open === addItems ? '#367BF5' : '#45484C'} />
            </IconButton>
            <IconButton size="sm" type="ghost">
               <SearchIcon />
            </IconButton>
            <IconButton size="sm" type="ghost">
               <NotificationIcon />
            </IconButton>
            <IconButton size="sm" type="ghost">
               <SettingsIcon />
            </IconButton>
            <IconButton size="sm" type="ghost">
               <StoreIcon />
            </IconButton>
            <StyledAvatar
               onClick={() => handleOpen(profile)}
               url=""
               open={open === profile}
               title={fullName(users[0]?.firstName, users[0]?.lastName)}
            />
         </Wrapper>

         {open === addItems && (
            <AddItem>
               <span>Create new</span>
               <CreateNewItemPanel setOpen={setOpen} />
            </AddItem>
         )}
         {open === profile && (
            <>
               {users[0] && (
                  <Profile>
                     <div>
                        <span>Account</span>
                        <IconButton type="ghost" size="sm">
                           <EditIcon size={20} color="#919699" />
                        </IconButton>
                     </div>
                     <div>
                        <div>
                           <Avatar
                              style={{
                                 height: '60px',
                                 width: '60px',
                                 margin: '10px',
                              }}
                              url=""
                              title={fullName(
                                 users[0]?.firstName,
                                 users[0]?.lastName
                              )}
                           />
                        </div>
                        <div>
                           <span>Admin</span>
                           <span>{user.name}</span>
                           <span>Designation</span>
                        </div>
                     </div>
                     <div>
                        <span>
                           <MailIcon size={12} />
                        </span>
                        <span>{user.email}</span>
                     </div>
                     <div>
                        <span>
                           <PhoneIcon size={12} />
                        </span>
                        <span>{users[0]?.phoneNo}</span>
                     </div>
                     <div>
                        <button onClick={logout}>
                           <LogoutIcon />
                           <span>Logout</span>
                        </button>
                     </div>
                  </Profile>
               )}
            </>
         )}
      </div>
   )
}

export default Tools
