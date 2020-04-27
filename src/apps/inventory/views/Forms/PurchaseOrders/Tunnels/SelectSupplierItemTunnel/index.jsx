import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListSearch,
   ListOptions,
   useSingleList,
} from '@dailykit/ui'

import { PurchaseOrderContext } from '../../../../../context/purchaseOrder'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

export default function AddressTunnel({ close }) {
   const { purchaseOrderDispatch } = useContext(PurchaseOrderContext)
   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList([
      { id: 1, title: 'Lettuce-101' },
      { id: 2, title: 'Tomato-100' },
      { id: 3, title: 'Onion-122' },
      { id: 4, title: 'Potato-1234' },
   ])
   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Output Bulk Item Processing"
            next={() => {
               purchaseOrderDispatch({
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
               <ListItem type="SSL1" title={current.title} />
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
                        type="SSL1"
                        key={option.id}
                        title={option.title}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
