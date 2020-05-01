import React, { useContext } from './node_modules/react'
import { Text, Input, ButtonTile, IconButton, HelperText } from './node_modules/@dailykit/ui'

import { InventoryProductContext } from '../../../../../context/product/inventoryProduct'

import {
   TunnelContainer,
   TunnelHeader,
   Spacer,
} from '../../../../../components'
import { CloseIcon } from '../../../../../assets/icons'

import { useTranslation, Trans } from './node_modules/react-i18next'

const address = 'apps.online_store.views.forms.product.inventoryproduct.tunnels.'

export default function AddItemsTunnel({ close }) {
   const { t } = useTranslation()
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
            title={t(address.concat("add items"))}
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
         <Text as="h2"><Trans i18nKey={address.concat("text 1")}>Label your items to add recipes for.</Trans></Text>
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
                     message={t(address.concat("fill this first to continue adding new items!"))}
                  />
               )}
            </React.Fragment>
         ))}

         <ButtonTile
            type="secondary"
            text={t(address.concat("add another item"))}
            onClick={addItemsHandler}
            style={{ margin: '20px 0' }}
         />
      </TunnelContainer>
   )
}
