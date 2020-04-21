import React from 'react'
import { Text } from '@dailykit/ui'

import { InventoryProductContext } from '../../../../context/product/inventoryProduct'

import Item from './Item'
import { TabContainer, ItemTab } from '../styled'

export default function Items({ open }) {
   const { inventoryProductState, inventoryProductDispatch } = React.useContext(
      InventoryProductContext
   )

   React.useEffect(() => {
      inventoryProductDispatch({
         type: 'SET_ITEM_VIEW',
         payload: inventoryProductState.items[0],
      })
   }, [])

   return (
      <>
         <TabContainer>
            {inventoryProductState.items.map(item => {
               return (
                  <ItemTab
                     key={item.id}
                     active={inventoryProductState.itemView?.id === item.id}
                     onClick={() => {
                        inventoryProductDispatch({
                           type: 'SET_ITEM_VIEW',
                           payload: item,
                        })
                        inventoryProductDispatch({
                           type: 'SET_CURRENT_INVENTORY_ITEM',
                           payload: {},
                        })
                     }}
                  >
                     <Text as="title">{item.label}</Text>
                  </ItemTab>
               )
            })}
         </TabContainer>
         <Item open={open} />
      </>
   )
}
