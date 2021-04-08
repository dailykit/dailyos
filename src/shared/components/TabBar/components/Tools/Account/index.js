import React from 'react'
import { useSubscription } from '@apollo/react-hooks'
import { Avatar, IconButton, Spinner } from '@dailykit/ui'
import {
   EditIcon,
   LogoutIcon,
   MailIcon,
   PhoneIcon,
} from '../../../../../assets/icons'
import { useAuth } from '../../../../../providers'
import BackButton from '../BackButton'
import { Styled } from './styled'
import { USERS } from './userQuery'
import { InlineLoader } from '../../../../InlineLoader'

const Account = ({ setIsMenuOpen, setOpen }) => {
   const { user, logout } = useAuth()
   const fullName = (f, l) => {
      let name = ''
      if (f) name += f
      if (l) name += ` ${l}`
      return name
   }

   const { loading, data: { users = [] } = {} } = useSubscription(USERS, {
      skip: !user?.email,
      variables: {
         where: {
            email: { _eq: user?.email },
         },
      },
   })
   if (loading)
      return (
         <Styled.Wrapper>
            <InlineLoader />
         </Styled.Wrapper>
      )

   return (
      <Styled.Wrapper>
         <BackButton setIsMenuOpen={setIsMenuOpen} setOpen={setOpen} />
         {users[0] && (
            <Styled.InnerWrapper>
               <Styled.EditSection>
                  <span>Account</span>
                  <IconButton type="ghost" size="sm">
                     <EditIcon size={20} color="#919699" />
                  </IconButton>
               </Styled.EditSection>
               <Styled.ImageSection>
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
               </Styled.ImageSection>
               <Styled.Contact>
                  <span>
                     <MailIcon size={12} />
                  </span>
                  <span>{user.email}</span>
               </Styled.Contact>
               <Styled.Contact>
                  <span>
                     <PhoneIcon size={12} />
                  </span>
                  <span>{users[0]?.phoneNo}</span>
               </Styled.Contact>
               <Styled.Logout>
                  <button onClick={logout}>
                     <LogoutIcon />
                     <span>Logout</span>
                  </button>
               </Styled.Logout>
            </Styled.InnerWrapper>
         )}
      </Styled.Wrapper>
   )
}

export default Account
