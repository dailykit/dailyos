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

export default function SelectOutputSachetItemTunnel({ close }) {
   const { sachetOrderState, sachetOrderDispatch } = useContext(
      SachetOrderContext
   )
   const [search, setSearch] = useState('')

   const [list, current, selectOption] = useSingleList(
      sachetOrderState.inputItemProcessing.sachets
   )
   return (
      <TunnelContainer>
         <TunnelHeader
            title="Select Output Bulk Sachet"
            next={() => {
               sachetOrderDispatch({
                  type: 'ADD_OUTPUT_SACHET',
                  payload: current,
               })
               close(2)
            }}
            close={() => close(2)}
            nextAction="Save"
         />

         <Spacer />

         <List>
            {Object.keys(current).length > 0 ? (
               <ListItem
                  type="SSL2"
                  content={{
                     title: current.title,
                     description: `Available: ${current.available} / ${current.total}  |  Par: ${current.onHand}`,
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
                           description: `Available: ${option.available} / ${option.total}  |  Par: ${option.onHand}`,
                        }}
                     />
                  ))}
            </ListOptions>
         </List>
      </TunnelContainer>
   )
}
