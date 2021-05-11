import React from 'react'
import { IconButton, SearchIcon } from '@dailykit/ui'
import {
   NotificationIcon,
   PlusIcon,
   SettingsIcon,
   StoreIcon,
} from '../../../../assets/icons'
import { StyledAvatar, Wrapper } from './styled'
import { useAuth } from '../../../../providers'

const ToolList = ({ toolbarRef, handleOpen, open, tools }) => {
   const { user } = useAuth()

   const { createItem, search, profile, marketPlace } = tools
   return (
      <Wrapper ref={toolbarRef}>
         <IconButton
            size="sm"
            type="ghost"
            onClick={() => handleOpen(createItem)}
         >
            <PlusIcon color={open === createItem ? '#367BF5' : '#45484C'} />
         </IconButton>
         {/* <IconButton size="sm" type="ghost" onClick={() => handleOpen(search)}>
            <SearchIcon />
         </IconButton> */}
         {/* <IconButton size="sm" type="ghost">
            <NotificationIcon />
         </IconButton> */}
         {/* <IconButton size="sm" type="ghost">
            <SettingsIcon />
         </IconButton> */}
         <IconButton
            size="sm"
            type="ghost"
            onClick={() => handleOpen(marketPlace)}
         >
            <StoreIcon color={open === marketPlace ? '#367BF5' : '#45484C'} />
         </IconButton>
         <StyledAvatar
            onClick={() => handleOpen(profile)}
            url=""
            open={open === profile}
            title={user?.name || 'user'}
         />
      </Wrapper>
   )
}

export default ToolList
