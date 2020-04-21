import React from 'react'

import {
   useSingleList,
   List,
   ListItem,
   ListSearch,
   ListOptions,
} from '@dailykit/ui'

import { CloseIcon } from '../../../../../assets/icons'

import { ItemContext } from '../../../../../context/item'

import { TunnelHeader, TunnelBody } from '../styled'

export default function SuppliersTunnel({ close, next, suppliers }) {
   const [search, setSearch] = React.useState('')
   const { state, dispatch } = React.useContext(ItemContext)
   const [list, current, selectOption] = useSingleList(suppliers)

   const selectSupplier = supplier => {
      dispatch({ type: 'SUPPLIER', payload: { supplier } })
      close()
      next()
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={close}>
                  <CloseIcon size={24} />
               </span>
               <span>Select Supplier</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <List>
               {Object.keys(current).length > 0 ? (
                  <ListItem
                     type="SSL22"
                     content={{
                        supplier: current.supplier,
                        contact: current.contact,
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
                        option.supplier.title.toLowerCase().includes(search)
                     )
                     .map(option => (
                        <ListItem
                           type="SSL22"
                           key={option.id}
                           isActive={option.id === current.id}
                           onClick={() => selectSupplier(option)}
                           content={{
                              supplier: option.supplier,
                              contact: option.contact,
                           }}
                        />
                     ))}
               </ListOptions>
            </List>
         </TunnelBody>
      </React.Fragment>
   )
}
