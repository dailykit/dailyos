import React, { useState, useContext } from 'react'
import {
   List,
   ListItem,
   ListSearch,
   ListOptions,
   useSingleList,
} from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

export default function SelectDerivedProcessingTunnel({ close, next }) {
   const { state, dispatch } = useContext(ItemContext)
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList([
      { id: 1, name: { id: 1, title: 'Potato' } },
      { id: 2, name: { id: 2, title: 'Tomato' } },
      { id: 3, name: { id: 3, title: 'Onion' } },
      { id: 4, name: { id: 4, title: 'Ginger' } },
   ])

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Processing"
            next={() => {
               dispatch({ type: 'ADD_DERIVED_PROCESSING', payload: current })
               dispatch({
                  type: 'ADD_CONFIGURABLE_PROCESSING',
                  payload: current,
               })
               close(6)
               next(7)
            }}
            close={() => close(6)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem type="SSL1" title={current.name.title} />
            ) : (
               <ListSearch
                  onChange={value => setSearch(value)}
                  placeholder="type what you’re looking for..."
               />
            )}
            <ListOptions>
               {list
                  .filter(option =>
                     option.name.title.toLowerCase().includes(search)
                  )
                  .map(option => (
                     <ListItem
                        type="SSL1"
                        key={option.id}
                        title={option.name.title}
                        isActive={option.id === current.id}
                        onClick={() => selectOption('id', option.id)}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
