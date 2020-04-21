import React from 'react'
import { Text, IconButton } from '@dailykit/ui'

import { Content, Flexible, RecipeButton } from '../styled'

import { InventoryProductContext } from '../../../../context/product/inventoryProduct'
import RecipeConfigurator from './RecipeConfigurator'
import AddIcon from '../../../../assets/icons/Add'

export default function Item({ open }) {
   const {
      inventoryProductState: { itemView, currentInventoryItem },
      inventoryProductDispatch,
   } = React.useContext(InventoryProductContext)
   return (
      <Content>
         <Flexible width="1">
            <Content
               style={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
               <Text as="title">Inventory Items for {itemView.label}</Text>
               <IconButton type="ghost" onClick={() => open(2)}>
                  <AddIcon />
               </IconButton>
            </Content>
            <hr style={{ border: '1px solid #dddddd' }} />
            <br />

            {itemView.inventoryItems?.map((inventoryItem, index) => (
               <RecipeButton
                  key={inventoryItem.id}
                  active={inventoryItem.id === currentInventoryItem.id}
                  onClick={() =>
                     inventoryProductDispatch({
                        type: 'SET_CURRENT_INVENTORY_ITEM',
                        payload: inventoryItem,
                     })
                  }
               >
                  <img src={inventoryItem.img} alt={inventoryItem.title} />
                  <h4 style={{ marginLeft: '10px' }}>{inventoryItem.title}</h4>
               </RecipeButton>
            ))}
         </Flexible>
         <Flexible width="3">
            <RecipeConfigurator open={open} />
         </Flexible>
      </Content>
   )
}
