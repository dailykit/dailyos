import React from 'react'

import { Text } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, SolidTile } from '../styled'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

const ProductsTypeTunnel = ({ close, open }) => {
   const { state, dispatch } = React.useContext(InventoryProductContext)

   const select = value => {
      dispatch({ type: 'META', payload: { name: 'productsType', value } })
      open(5)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(4)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Select a Product Type</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">Inventory Product</Text>
               <Text as="subtitle">
                  Inventory product is just an item, supplied or bought
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('simple')}>
               <Text as="h1">Simple Recipe Product</Text>
               <Text as="subtitle">
                  Simple Recipe product is only one recipes, sold as Meal Kits
                  as well as Ready to Eat
               </Text>
            </SolidTile>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductsTypeTunnel
