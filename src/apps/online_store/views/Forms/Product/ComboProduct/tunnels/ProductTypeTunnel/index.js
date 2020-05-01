import React from 'react'

import { Text } from '@dailykit/ui'

import { CloseIcon } from '../../../../../../assets/icons'

import { TunnelHeader, TunnelBody, SolidTile } from '../styled'
import { ComboProductContext } from '../../../../../../context/product/comboProduct'

const ProductTypeTunnel = ({ close, open }) => {
   const { dispatch } = React.useContext(ComboProductContext)

   const select = type => {
      dispatch({
         type: 'META',
         payload: {
            name: 'productType',
            value: type,
         },
      })
      open(4)
   }

   return (
      <React.Fragment>
         <TunnelHeader>
            <div>
               <span onClick={() => close(2)}>
                  <CloseIcon color="#888D9D" />
               </span>
               <span>Select Product Type</span>
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
                  Simple Recipe Product is only one recipe, sold as Meal Kits as
                  well as Ready to Eat
               </Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('customizable')}>
               <Text as="h1">Customizable Product</Text>
               <Text as="subtitle">
                  Simple Recipe Product is only one recipe, sold as Meal Kits as
                  well as Ready to Eat
               </Text>
            </SolidTile>
         </TunnelBody>
      </React.Fragment>
   )
}

export default ProductTypeTunnel
