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

export default function SelectInputBulkItemTunnel({ close }) {
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
            title="Select Input Bulk Item Processing"
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
                           description: `Shelf Life: ${option.shelfLife} On Hand: ${option.onHand}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
