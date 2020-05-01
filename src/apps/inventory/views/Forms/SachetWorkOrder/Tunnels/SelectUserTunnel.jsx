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

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectUserTunnel({ close }) {
   const { t } = useTranslation()
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
            title={t(address.concat("select user"))}
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
                     placeholder={t(address.concat("type what you’re looking for")).concat('...')}
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
