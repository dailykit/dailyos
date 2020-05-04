import React, { useContext } from 'react'
import { Text, Input, ButtonTile, IconButton, HelperText } from '@dailykit/ui'

import { ProductContext } from '../../../../context/product'

import { TunnelContainer, TunnelHeader, Spacer } from '../../../../components'
import { CloseIcon } from '../../../../assets/icons/'

import { useTranslation, Trans } from 'react-i18next'

const address = 'apps.online_store.views.forms.product.tunnels.'

export default function AddItemsTunnel({ close }) {
   const { t } = useTranslation()
   const { productState, productDispatch } = useContext(ProductContext)

   const addItemsHandler = () => {
      if (productState.items[productState.items.length - 1].label.length === 0)
         return

      productDispatch({ type: 'ADD_PRODUCT_ITEM' })
   }

   return (
      <TunnelContainer>
         <TunnelHeader
            title={t(address.concat("add items"))}
            close={() => {
               productDispatch({ type: 'REFINE_ITEMS' })
               close(1)
            }}
            next={() => {
               productDispatch({ type: 'REFINE_ITEMS' })
               close(1)
            }}
            nextAction="Save"
         />
         <Spacer />
         <Text as="h2"><Trans i18nKey={address.concat('text')}>Label your items to add recipes for.</Trans></Text>
         <br />

         {productState.items.map((item, index) => (
            <React.Fragment key={index}>
               <div style={{ display: 'flex' }}>
                  <Input
                     type="text"
                     name={item.id}
                     value={item.label}
                     onChange={e => {
                        productDispatch({
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
