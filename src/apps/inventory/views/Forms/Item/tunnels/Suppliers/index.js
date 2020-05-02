import React, { useContext } from 'react'
import {
   List,
   ListItem,
   ListOptions,
   ListSearch,
   useSingleList,
} from '@dailykit/ui'

import { ItemContext } from '../../../../../context/item'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'

export default function SupplierTunnel({
   close,
   suppliers,
   open,
   rawSuppliers,
}) {
   const { state, dispatch } = useContext(ItemContext)
   const [search, setSearch] = React.useState('')

   const [list, current, selectOption] = useSingleList(suppliers)

   return (
      <>
         <TunnelContainer>
            <TunnelHeader
               title="Select Supplier"
               next={() => {
                  const payload = rawSuppliers.find(
                     supplier => supplier.id === current.id
                  )
                  dispatch({ type: 'SUPPLIER', payload })
                  close(1)
                  open(2)
               }}
               close={() => close(1)}
               nextAction="Next"
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
                     .filter(option =>
                        option.title.toLowerCase().includes(search)
                     )
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
      </>
   )
}
