import React, { useContext } from 'react'
import { Text, Input, ButtonTile, IconButton, HelperText } from '@dailykit/ui'

import { InventoryProductContext } from '../../../../../context/product/inventoryProduct'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { CloseIcon } from '../../../../../assets/icons/'

export default function AddItemsTunnel({ close }) {
   const { inventoryProductState, inventoryProductDispatch } = useContext(
      InventoryProductContext
   )

   const addItemsHandler = () => {
      if (
         inventoryProductState.items[inventoryProductState.items.length - 1]
            .label.length === 0
      )
         return

      inventoryProductDispatch({ type: 'ADD_PRODUCT_ITEM' })
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title="Add Items"
            close={() => {
               inventoryProductDispatch({ type: 'REFINE_ITEMS' })
               close(1)
            }}
            next={() => {
               inventoryProductDispatch({ type: 'REFINE_ITEMS' })
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <Text as="h2">Label your items to add recipes for.</Text>
         <br />

         {inventoryProductState.items.map((item, index) => (
            <React.Fragment key={index}>
               <div style={{ display: 'flex' }}>
                  <Input
                     type="text"
                     name={item.id}
                     value={item.label}
                     onChange={e => {
                        inventoryProductDispatch({
                           type: 'SET_PRODUCT_ITEM',
                           payload: { label: e.target.value, index },
                        })
                     }}
                  />

                  {item.label?.length > 0 && (
                     <IconButton
                        type="outline"
                        onClick={() => {
                           // TODO: removeItems
                        }}
                     >
                        <CloseIcon />
                     </IconButton>
                  )}
               </div>
               <br />
               {item.label?.length === 0 && (
                  <HelperText
                     type="hint"
                     message="fill this first to continue adding new items!"
                  />
               )}
            </React.Fragment>
         ))}

         <ButtonTile
            type="secondary"
            text="Add Another Item"
            onClick={addItemsHandler}
            style={{ margin: '20px 0' }}
         />
      </TunnelContainer>
   )
}
