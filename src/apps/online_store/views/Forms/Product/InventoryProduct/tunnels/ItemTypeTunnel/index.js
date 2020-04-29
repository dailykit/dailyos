import React from 'react'

import { Text } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'
import { TunnelHeader, TunnelBody, SolidTile } from '../styled'
import { InventoryProductContext } from '../../../../../../context/product/inventoryProduct'

const ProductsTypeTunnel = ({ close, open }) => {
   const { state, dispatch } = React.useContext(InventoryProductContext)

   const select = value => {
      dispatch({ type: 'META', payload: { name: 'itemType', value } })
      open(3)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Select an Item Type</span>
            </div>
         </TunnelHeader>
         <TunnelBody>
            <SolidTile onClick={() => select('inventory')}>
               <Text as="h1">Inventory Item</Text>
               <Text as="subtitle">Bleh Bleh Bleh</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('sachet')}>
               <Text as="h1">sachet Item</Text>
               <Text as="subtitle">Blah Blah Blah</Text>
            </SolidTile>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductsTypeTunnel
