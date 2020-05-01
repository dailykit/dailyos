import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { SachetOrderContext } from '../../../../context/sachetOrder'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

export default function SelectUserTunnel({ close }) {
   const { sachetOrderDispatch } = useContext(SachetOrderContext)

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList([
      {
         id: 1,
         title: 'User 1',
         description: 'user1@mailto.com',
      },
      { id: 2, title: 'User 2', description: 'user2@mailto.com' },
      {
         id: 3,
         title: 'User 3',
         description: 'user3@mailto.com',
      },
      { id: 4, title: 'User 4', description: 'user4@mailto.com' },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select User"
            next={() => {
               sachetOrderDispatch({ type: 'SELECT_USER', payload: current })
               close(3)
            }}
            close={() => close(3)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.title,
                     description: current.description,
                  }}
               />
            ) : (
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
            )}
            <ListOptions>
               {list
                  .filter(option => option.title.toLowerCase().includes(search))
                  .map(option => (
                     <ListItem
                        type="SSL2"
                        key={option.id}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                        content={{
                           title: option.title,
                           description: option.description,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
