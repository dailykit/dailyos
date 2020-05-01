import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListSearch,
   ListOptions,
   useSingleList,
} from '@dailykit/ui'

import { SachetOrderContext } from '../../../../context/sachetOrder'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.sachetworkorder.tunnels.'

export default function SelectInputBulkItemTunnel({ close }) {
   const { t } = useTranslation()
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )
   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList(
      sachetOrderState.supplierItem.shippedProcessing
   )
   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("select input bulk item processing"))}
            next={() => {
               sachetOrderDispatch({ type: 'ADD_INPUT_ITEM', payload: current })
               close(5)
            }}
            close={() => close(5)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.title,
                     description: `Shelf Life: ${current.shelfLife} On Hand: ${current.onHand}`,
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
                           description: `Shelf Life: ${option.shelfLife} On Hand: ${option.onHand}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
