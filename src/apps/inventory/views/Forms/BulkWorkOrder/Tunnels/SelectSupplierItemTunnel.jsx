import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { BulkOrderContext } from '../../../../context/bulkOrder'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'

import { useTranslation } from 'react-i18next'

const address = 'apps.inventory.views.forms.bulkworkorder.tunnels.'

export default function AddressTunnel({ close }) {
   const { t } = useTranslation()
   const { bulkOrderDispatch } = useContext(BulkOrderContext)

   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList([
      {
         id: 1,
         title: 'Potato-001',
         shippedProcessing: [
            { id: 1, title: 'raw', shelfLife: 20, onHand: 2000, yield: 85 },
            { id: 2, title: 'sliced', shelfLife: 20, onHand: 2000, yield: 82 },
         ],
      },

      {
         id: 3,
         title: 'Lettuce-001',
         shippedProcessing: [
            { id: 3, title: 'raw', shelfLife: 20, onHand: 2000, yield: 92 },
            { id: 4, title: 'Boiled', shelfLife: 20, onHand: 2000, yield: 88 },
         ],
      },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("select supplier item"))}
            next={() => {
               bulkOrderDispatch({
                  type: 'ADD_SUPPLIER_ITEM',
                  payload: current,
               })
               close(1)
            }}
            close={() => close(1)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.title,
                     description: `Processings as shipped: ${current.shippedProcessing
                        .map(proc => proc.title)
                        .join(', ')}`,
                  }}
               />
            ) : (
                  <ListSearch
                     onChange={value => setSearch(value)}
                     placeholder={t(address.concat("type what you're looking for")).concat('...')}
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
                           description: `Processings as shipped: ${option.shippedProcessing
                              .map(proc => proc.title)
                              .join(', ')}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
