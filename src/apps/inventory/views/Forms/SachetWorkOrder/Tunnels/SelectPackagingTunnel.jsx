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

export default function SelectPackagingTunnel({ close }) {
   const { t } = useTranslation()
   const { sachetOrderDispatch } = useContext(SachetOrderContext)

   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList([
      {
         id: 1,
         title: 'packaging 1',
         description: 'lorem ipsum dolla sit amet',
      },
      {
         id: 2,
         title: 'packaging 2',
         description: 'lorem ipsum dolla sit amet',
      },
      {
         id: 3,
         title: 'packaging 3',
         description: 'lorem ipsum dolla sit amet',
      },
      {
         id: 4,
         title: 'packaging 4',
         description: 'lorem ipsum dolla sit amet',
      },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("select packaging"))}
            next={() => {
               sachetOrderDispatch({
                  type: 'SELECT_PACKAGING',
                  payload: current,
               })
               close(6)
            }}
            close={() => close(6)}
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
