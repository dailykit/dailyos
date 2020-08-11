import React from 'react'
import { TunnelHeader, Text } from '@dailykit/ui'
import { TunnelBody, SolidTile } from '../styled'
import { ModifiersContext } from '../../../../../../context/product/modifiers'

const ModifierTypeTunnel = ({ open, close }) => {
   const { modifiersDispatch } = React.useContext(ModifiersContext)

   const select = type => {
      modifiersDispatch({
         type: 'META',
         payload: {
            name: 'modifierProductType',
            value: type,
         },
      })
      open(4)
   }

   return (
      <>
         <TunnelHeader title="Choose Option Type" close={() => close(3)} />
         <TunnelBody>
            <SolidTile onClick={() => select('inventoryProduct')}>
               <Text as="h1">Inventory Product</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('simpleRecipeProduct')}>
               <Text as="h1">Simple Recipe Product</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('sachetItem')}>
               <Text as="h1">Sachet Item</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('bulkItem')}>
               <Text as="h1">Bulk Item</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ModifierTypeTunnel
