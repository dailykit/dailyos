import React from 'react'
import { TunnelHeader, Text } from '@dailykit/ui'
import { TunnelBody, SolidTile } from '../styled'
import { ModifiersContext } from '../../../../../../context/product/modifiers'
import { Tooltip } from '../../../../../../../../shared/components'

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
         <TunnelHeader
            title="Choose Option Type"
            close={() => close(3)}
            tooltip={<Tooltip identifier="modifier_option_type_tunnel" />}
         />
         <TunnelBody>
            <SolidTile onClick={() => select('inventoryProductOption')}>
               <Text as="h1">Inventory Product</Text>
            </SolidTile>
            <br />
            <SolidTile onClick={() => select('simpleRecipeProductOption')}>
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
            <br />
            <SolidTile onClick={() => select('supplierItem')}>
               <Text as="h1">Supplier Item</Text>
            </SolidTile>
         </TunnelBody>
      </>
   )
}

export default ModifierTypeTunnel
